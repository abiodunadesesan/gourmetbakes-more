import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { sendWhatsAppMessage, normalizePhoneForWhatsApp } from '@/lib/whatsapp';

export async function POST(req: Request) {
    try {
        const supabase = createServerSupabaseClient();
        const body = await req.json();
        const { name, email, phone, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Save to Database
        const { data, error } = await supabase
            .from('contact_messages')
            .insert({
                name,
                email,
                phone: phone || null,
                subject,
                message,
                status: 'new'
            })
            .select()
            .single();

        if (error) {
            console.error('Database Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 2. Send WhatsApp Notification to Business
        const businessMsg = `💬 *New Contact Message*\n\n*From:* ${name}\n*Email:* ${email}\n*Phone:* ${phone || 'N/A'}\n*Subject:* ${subject}\n\n*Message:* \n${message}`;
        await sendWhatsAppMessage(process.env.ADMIN_PHONE || '', businessMsg);

        // 3. Send Confirmation to User if phone provided
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
