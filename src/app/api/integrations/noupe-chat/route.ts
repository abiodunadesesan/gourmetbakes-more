import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { escapeHtml, sendInboundNotificationEmail } from '@/lib/inboundEmail';

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
    subject?: string;
    text?: string;
    plainText?: string;
    messages?: unknown;
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
 * Auth: set `NOUPE_CHAT_WEBHOOK_SECRET` and send the same value as
 * `Authorization: Bearer <secret>` or header `x-noupe-webhook-secret: <secret>`.
 */
export async function POST(req: Request) {
    const expectedSecret = process.env.NOUPE_CHAT_WEBHOOK_SECRET?.trim();
    if (!expectedSecret) {
        console.warn('[noupe-chat] NOUPE_CHAT_WEBHOOK_SECRET is not set; refusing requests.');
        return NextResponse.json({ ok: false, error: 'Webhook not configured' }, { status: 503 });
    }

    const provided = getProvidedSecret(req);
    if (!provided || !timingSafeStringEqual(expectedSecret, provided)) {
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

    if (!text) {
        return NextResponse.json(
            { ok: false, error: 'Provide `text`, `plainText`, or a non-empty `messages` array' },
            { status: 400 }
        );
    }

    text = truncate(text);

    const metaLines: string[] = [];
    if (body.sessionId) metaLines.push(`Session: ${body.sessionId}`);
    if (body.visitorName) metaLines.push(`Visitor name: ${body.visitorName}`);
    if (body.visitorEmail) metaLines.push(`Visitor email: ${body.visitorEmail}`);
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

    const baseSubject =
        typeof body.subject === 'string' && body.subject.trim()
            ? body.subject.trim()
            : '[Noupe chat] Conversation transcript';
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
        return NextResponse.json(
            { ok: false, error: result.error || 'Email not sent (check Resend env)' },
            { status: 502 }
        );
    }

    return NextResponse.json({ ok: true, emailed: true });
}
