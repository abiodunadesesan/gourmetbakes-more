import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { escapeHtml, sendInboundNotificationEmail } from '@/lib/inboundEmail';
import { isBrowserBridgeNoiseOnlyTranscript } from '@/lib/noupePostMessageNoise';

export const runtime = 'nodejs';

const MAX_TEXT_CHARS = 50_000;

function timingSafeStringEqual(expected: string, received: string): boolean {
    if (expected.length !== received.length) {
        return false;
    }
    try {
        return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(received, 'utf8'));
    } catch {
        return false;
    }
}

function getProvidedSecret(req: Request): string | null {
    const header = req.headers.get('x-noupe-webhook-secret')?.trim();
    if (header) return header;
    const auth = req.headers.get('authorization')?.trim();
    if (auth?.toLowerCase().startsWith('bearer ')) {
        return auth.slice(7).trim();
    }
    return null;
}

function getBrowserIngestExpected(): string | undefined {
    return (
        process.env.NOUPE_BROWSER_INGEST_KEY?.trim() ||
        process.env.NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY?.trim()
    );
}

type AuthMode = 'webhook' | 'browser';

function authorizeRequest(req: Request): AuthMode | null {
    const browserHeader = req.headers.get('x-noupe-browser-ingest-key')?.trim();
    const browserExpected = getBrowserIngestExpected();
    if (browserHeader && browserExpected && timingSafeStringEqual(browserExpected, browserHeader)) {
        return 'browser';
    }

    const webhook = getProvidedSecret(req);
    const webhookExpected = process.env.NOUPE_CHAT_WEBHOOK_SECRET?.trim();
    if (webhook && webhookExpected && timingSafeStringEqual(webhookExpected, webhook)) {
        return 'webhook';
    }

    return null;
}

function truncate(s: string): string {
    if (s.length <= MAX_TEXT_CHARS) return s;
    return `${s.slice(0, MAX_TEXT_CHARS)}\n\n… (truncated)`;
}

function formatMessagesField(messages: unknown): string | null {
    if (!Array.isArray(messages) || messages.length === 0) return null;
    const lines: string[] = [];
    for (const m of messages) {
        if (!m || typeof m !== 'object') continue;
        const rec = m as Record<string, unknown>;
        const role = rec.role != null ? String(rec.role) : 'message';
        const content = rec.content != null ? String(rec.content) : '';
        if (!content.trim()) continue;
        lines.push(`${role}: ${content.trim()}`);
    }
    return lines.length > 0 ? lines.join('\n\n') : null;
}

type NoupeChatBody = {
    /** `order_intent` uses a stronger subject line (chat may not be a real checkout order). */
    kind?: 'transcript' | 'order_intent';
    subject?: string;
    text?: string;
    plainText?: string;
    messages?: unknown;
    /** Zapier / manual tests: JSON object serialized into the email when `text` is omitted. */
    payload?: unknown;
    /** Echoed in email metadata (e.g. `manual-test`, `zapier`). */
    source?: string;
    /** Optional Zapier-mapped fields (shown above the transcript). */
    externalId?: string;
    phone?: string;
    notes?: string;
    /** String or structured (stringified for email). */
    items?: unknown;
    sessionId?: string;
    visitorEmail?: string;
    visitorName?: string;
    pageUrl?: string;
    metadata?: Record<string, unknown>;
};

/**
 * Receives chat / conversation payloads (from Noupe via Zapier/Make, or a future Noupe webhook)
 * and emails the shop via Resend (`INBOUND_FORM_EMAIL`).
 *
 * Auth (pick one):
 * - **Webhook / Zapier:** `NOUPE_CHAT_WEBHOOK_SECRET` as `Authorization: Bearer …` or `x-noupe-webhook-secret`.
 * - **Browser bridge:** `NOUPE_BROWSER_INGEST_KEY` or `NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY` as `x-noupe-browser-ingest-key` (same value; exposed in client bundle — rotate if abused).
 */
export async function POST(req: Request) {
    const hasWebhook = !!process.env.NOUPE_CHAT_WEBHOOK_SECRET?.trim();
    const hasBrowser = !!getBrowserIngestExpected();
    if (!hasWebhook && !hasBrowser) {
        console.warn('[noupe-chat] Set NOUPE_CHAT_WEBHOOK_SECRET and/or NOUPE_BROWSER_INGEST_KEY (or NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY).');
        return NextResponse.json({ ok: false, error: 'Integration not configured' }, { status: 503 });
    }

    const auth = authorizeRequest(req);
    if (!auth) {
        return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    let body: NoupeChatBody;
    try {
        body = (await req.json()) as NoupeChatBody;
    } catch {
        return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const fromMessages = formatMessagesField(body.messages);
    let text =
        (typeof body.text === 'string' && body.text.trim()) ||
        (typeof body.plainText === 'string' && body.plainText.trim()) ||
        fromMessages ||
        '';

    if (!text && body.payload != null) {
        if (typeof body.payload === 'string') {
            text = body.payload.trim();
        } else {
            try {
                text = JSON.stringify(body.payload, null, 2);
            } catch {
                text = String(body.payload);
            }
        }
    }

    if (!text) {
        return NextResponse.json(
            {
                ok: false,
                error: 'Provide `text`, `plainText`, `payload`, or a non-empty `messages` array',
            },
            { status: 400 }
        );
    }

    text = truncate(text);

    if (auth === 'browser' && isBrowserBridgeNoiseOnlyTranscript(text)) {
        return NextResponse.json({
            ok: true,
            emailed: false,
            skipped: 'noupe_ui_events_only',
        });
    }

    const metaLines: string[] = [];
    if (body.kind === 'order_intent') {
        metaLines.push(
            'Note: This transcript may look like an order — it is not a confirmed Menu/checkout order unless you also see it in Supabase/orders.'
        );
    }
    if (typeof body.source === 'string' && body.source.trim()) {
        metaLines.push(`Source: ${body.source.trim()}`);
    }
    if (typeof body.externalId === 'string' && body.externalId.trim()) {
        metaLines.push(`External ID: ${body.externalId.trim()}`);
    }
    if (body.sessionId) metaLines.push(`Session: ${body.sessionId}`);
    if (body.visitorName) metaLines.push(`Visitor name: ${body.visitorName}`);
    if (body.visitorEmail) metaLines.push(`Visitor email: ${body.visitorEmail}`);
    if (typeof body.phone === 'string' && body.phone.trim()) {
        metaLines.push(`Phone: ${body.phone.trim()}`);
    }
    if (typeof body.notes === 'string' && body.notes.trim()) {
        metaLines.push(`Notes: ${body.notes.trim()}`);
    }
    if (body.items != null) {
        const itemsLine =
            typeof body.items === 'string'
                ? body.items.trim()
                : (() => {
                      try {
                          return JSON.stringify(body.items, null, 2);
                      } catch {
                          return String(body.items);
                      }
                  })();
        if (itemsLine) metaLines.push(`Items:\n${itemsLine}`);
    }
    if (body.pageUrl) metaLines.push(`Page: ${body.pageUrl}`);
    if (body.metadata && typeof body.metadata === 'object') {
        try {
            metaLines.push(`Metadata:\n${JSON.stringify(body.metadata, null, 2)}`);
        } catch {
            metaLines.push('Metadata: (unserializable)');
        }
    }

    const fullText =
        metaLines.length > 0 ? `${metaLines.join('\n')}\n\n---\n\n${text}` : text;

    /** Distinct from checkout mail (`[Gourmet Bakes] New order …` from `POST /api/orders`). */
    const defaultSubject =
        body.kind === 'order_intent'
            ? '[Noupe lead] Possible chat order — not a checkout order; confirm in dashboard'
            : '[Noupe lead] Chat transcript';
    const baseSubject =
        typeof body.subject === 'string' && body.subject.trim() ? body.subject.trim() : defaultSubject;
    const subject = body.sessionId ? `${baseSubject} (${body.sessionId})` : baseSubject;

    const metaHtml =
        metaLines.length > 0
            ? `<p style="font-family:system-ui,sans-serif;font-size:13px;color:#64748b">${metaLines
                  .map((line) => escapeHtml(line))
                  .join('<br/>')}</p><hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />`
            : '';

    const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#1e293b">
${metaHtml}<pre style="white-space:pre-wrap;margin:0">${escapeHtml(text)}</pre>
</div>`;

    const result = await sendInboundNotificationEmail({
        subject,
        text: fullText,
        html,
    });

    if (!result.sent) {
        console.error('[noupe-chat] Resend did not send email:', result.error || 'unknown');
        return NextResponse.json(
            { ok: false, error: result.error || 'Email not sent (check Resend env)' },
            { status: 502 }
        );
    }

    return NextResponse.json({ ok: true, emailed: true });
}
