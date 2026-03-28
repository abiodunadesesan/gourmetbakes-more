import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { sendWhatsAppMessage, normalizePhoneForWhatsApp, notifyShopWhatsApp } from '@/lib/whatsapp';
import { escapeHtml, sendInboundNotificationEmail } from '@/lib/inboundEmail';

export async function POST(req: Request) {
    try {
        const supabase = createServerSupabaseClient();
        const body = await req.json();
        const { 
            eventName, eventDate, guestCount, eventType, 
            products, dietaryRequirements, specialRequests,
            name, phone, email, deliveryAddress 
        } = body;

        if (!eventName || !eventDate || !name || !phone || !email || !deliveryAddress) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Save to Database
        const { data, error } = await supabase
            .from('catering_inquiries')
            .insert({
                event_name: eventName,
                event_date: eventDate,
                guest_count: Number(guestCount),
                event_type: eventType,
                products_requested: products,
                dietary_requirements: dietaryRequirements || null,
                special_requests: specialRequests || null,
                contact_name: name,
                phone: phone,
                email: email,
                delivery_address: deliveryAddress,
                status: 'new'
            })
            .select()
            .single();

        if (error) {
            console.error('Catering Database Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const productsLine = Array.isArray(products) ? products.join(', ') : String(products);
        const emailText = `New catering inquiry\n\nEvent: ${eventName}\nDate: ${eventDate}\nGuests: ${guestCount}\nType: ${eventType}\n\nContact: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nProducts requested:\n${productsLine}\n\nDietary: ${dietaryRequirements || '—'}\nSpecial requests: ${specialRequests || '—'}\n\nDelivery address:\n${deliveryAddress}`;
        const emailHtml = `<h2 style="font-family:system-ui,sans-serif">Catering inquiry</h2>
<table style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">
<tr><td style="font-weight:600;padding-right:12px">Event</td><td>${escapeHtml(eventName)}</td></tr>
<tr><td style="font-weight:600;padding-right:12px">Date</td><td>${escapeHtml(eventDate)}</td></tr>
<tr><td style="font-weight:600;padding-right:12px">Guests</td><td>${escapeHtml(String(guestCount))}</td></tr>
<tr><td style="font-weight:600;padding-right:12px">Type</td><td>${escapeHtml(eventType)}</td></tr>
<tr><td style="font-weight:600;padding-right:12px">Contact</td><td>${escapeHtml(name)} — ${escapeHtml(phone)} — <a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a></td></tr>
</table>
<p style="font-family:system-ui,sans-serif"><strong>Products</strong><br/>${escapeHtml(productsLine)}</p>
<p style="font-family:system-ui,sans-serif;white-space:pre-wrap"><strong>Address</strong><br/>${escapeHtml(deliveryAddress)}</p>`;
        await sendInboundNotificationEmail({
            subject: `[Gourmet Bakes] Catering: ${eventName}`,
            text: emailText,
            html: emailHtml,
        });

        // 2. Send WhatsApp Notification to Business
        const bizMsg = `📋 *New Catering Inquiry*\n\n*Event:* ${eventName}\n*Date:* ${eventDate}\n*Guests:* ${guestCount}\n*Type:* ${eventType}\n\n*Contact:* ${name}\n*Phone:* ${phone}\n\n*Products:* ${products.join(', ')}\n\n*Address:* ${deliveryAddress}`;
        await notifyShopWhatsApp(bizMsg);

        // 3. Send Confirmation to Customer
        const userMsg = `Hi ${name}! 🎉 Your catering inquiry for "${eventName}" has been received. Our team will review your request and send a custom quote within 24 hours. Thank you!`;
        await sendWhatsAppMessage(normalizePhoneForWhatsApp(phone), userMsg);

        return NextResponse.json({ success: true, inquiryId: data.catering_inquiry_id });
    } catch (error: any) {
        console.error('Catering API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
