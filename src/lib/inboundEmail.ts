import { Resend } from 'resend';

export function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export type InboundEmailPayload = {
    subject: string;
    text: string;
    /** If omitted, a simple HTML wrapper is built from `text`. */
    html?: string;
};

/**
 * Sends a notification to your inbox via [Resend](https://resend.com).
 * Set RESEND_API_KEY and INBOUND_FORM_EMAIL in .env.local (see README).
 * Failures are logged only; they never throw (callers should not fail the HTTP response).
 */
export async function sendInboundNotificationEmail(
    payload: InboundEmailPayload
): Promise<{ sent: boolean; error?: string }> {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const to = process.env.INBOUND_FORM_EMAIL?.trim();

    if (!apiKey || !to) {
        if (!apiKey) {
            console.warn('[inboundEmail] Set RESEND_API_KEY to enable email notifications.');
        }
        if (!to) {
            console.warn('[inboundEmail] Set INBOUND_FORM_EMAIL to your receiving address.');
        }
        return { sent: false };
    }

    const from =
        process.env.RESEND_FROM_EMAIL?.trim() || 'Gourmet Bakes & More <onboarding@resend.dev>';

    const html =
        payload.html ??
        `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#1e293b">
<pre style="white-space:pre-wrap;margin:0">${escapeHtml(payload.text)}</pre>
</div>`;

    try {
        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
            from,
            to: [to],
            subject: payload.subject,
            text: payload.text,
            html,
        });

        if (error) {
            console.error('[inboundEmail] Resend error:', error);
            return { sent: false, error: error.message };
        }
        return { sent: true };
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('[inboundEmail]', msg);
        return { sent: false, error: msg };
    }
}
