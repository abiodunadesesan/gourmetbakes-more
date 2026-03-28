import { NextResponse } from 'next/server';
import { createServerSupabaseClient, isServerSupabaseConfigured } from '@/lib/supabase';
import { sendWhatsAppMessage, normalizePhoneForWhatsApp } from '@/lib/whatsapp';
import {
    isLikelySupabaseNetworkFailure,
    isMissingDatabaseObjectError,
} from '@/lib/mockOrderStore';
import { escapeHtml, sendInboundNotificationEmail } from '@/lib/inboundEmail';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const isDev = process.env.NODE_ENV === 'development';

        if (!isServerSupabaseConfigured()) {
            if (isDev) {
                console.warn('[contact/submit] DEV: Supabase not configured; skipping DB, still sending WhatsApp if configured.');
            } else {
                return NextResponse.json(
                    {
                        error:
                            'Contact form is not available: database not configured. Set Supabase env vars and run contact_messages_schema.sql.',
                    },
                    { status: 503 }
                );
            }
        } else {
            const supabase = createServerSupabaseClient();

            const { error } = await supabase
                .from('contact_messages')
                .insert({
                    name,
                    email,
                    phone: phone || null,
                    subject,
                    message,
                    status: 'new',
                })
                .select()
                .single();

            if (error) {
                if (
                    isDev &&
                    (isLikelySupabaseNetworkFailure(error) || isMissingDatabaseObjectError(error))
                ) {
                    console.warn(
                        '[contact/submit] DEV: DB unavailable or contact_messages missing; continuing without insert. Run contact_messages_schema.sql in Supabase.'
                    );
                } else if (isMissingDatabaseObjectError(error)) {
                    return NextResponse.json(
                        {
                            error:
                                "Table contact_messages is missing. In Supabase → SQL Editor, run contact_messages_schema.sql from the project root.",
                            code: (error as { code?: string }).code,
                        },
                        { status: 503 }
                    );
                } else {
                    console.error('Database Error:', error);
                    return NextResponse.json({ error: error.message }, { status: 500 });
                }
            }
        }

        // 2. Email notification (Resend: RESEND_API_KEY + INBOUND_FORM_EMAIL)
        const emailText = `New contact form message\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\nSubject: ${subject}\n\nMessage:\n${message}`;
        const emailHtml = `<h2 style="margin:0 0 16px;font-family:system-ui,sans-serif;">New contact message</h2>
<table style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1e293b;border-collapse:collapse">
<tr><td style="padding:4px 16px 4px 0;font-weight:600">Name</td><td>${escapeHtml(name)}</td></tr>
<tr><td style="padding:4px 16px 4px 0;font-weight:600">Email</td><td><a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a></td></tr>
<tr><td style="padding:4px 16px 4px 0;font-weight:600">Phone</td><td>${escapeHtml(phone || '—')}</td></tr>
<tr><td style="padding:4px 16px 4px 0;font-weight:600">Subject</td><td>${escapeHtml(subject)}</td></tr>
</table>
<p style="font-family:system-ui,sans-serif;font-weight:600;margin:24px 0 8px">Message</p>
<div style="font-family:system-ui,sans-serif;border-left:4px solid #f97316;padding:12px 16px;background:#fff7ed;white-space:pre-wrap">${escapeHtml(message)}</div>`;
        await sendInboundNotificationEmail({
            subject: `[Gourmet Bakes] Contact: ${subject}`,
            text: emailText,
            html: emailHtml,
        });

        // 3. Send WhatsApp Notification to Business
        const businessMsg = `💬 *New Contact Message*\n\n*From:* ${name}\n*Email:* ${email}\n*Phone:* ${phone || 'N/A'}\n*Subject:* ${subject}\n\n*Message:* \n${message}`;
        await sendWhatsAppMessage(process.env.ADMIN_PHONE || '', businessMsg);

        // 4. Send Confirmation to User if phone provided
        if (phone) {
            const userMsg = `Hi ${name}! Thanks for reaching out to GourmetBakes & More. We've received your message about "${subject}" and will get back to you soon.`;
            await sendWhatsAppMessage(normalizePhoneForWhatsApp(phone), userMsg);
        }

        return NextResponse.json({ success: true, message: 'Thank you! We will get back to you soon.' });
    } catch (error: any) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
