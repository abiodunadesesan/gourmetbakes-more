import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppMessage, normalizePhoneForWhatsApp } from '@/lib/whatsapp';
import { escapeHtml, sendInboundNotificationEmail } from '@/lib/inboundEmail';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            products,
            custom_products_description,
            total_units,
            delivery_address,
            preferred_delivery_date,
            delivery_time_window,
            delivery_instructions,
            purpose,
            estimated_budget,
            payment_terms,
            full_name,
            email,
            phone,
            company_name,
            additional_notes
        } = body;

        // 1. Save to database
        const { data, error } = await supabase
            .from('bulk_order_requests')
            .insert({
                full_name,
                email,
                phone,
                company_name,
                products_requested: products,
                custom_description: custom_products_description,
                total_units,
                delivery_address,
                preferred_delivery_date,
                delivery_time_window,
                delivery_instructions,
                purpose,
                estimated_budget,
                payment_terms,
                additional_notes,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;

        const productSummary =
            Array.isArray(products) && products.length > 0
                ? products.map((p: { name?: string; quantity?: number }) => `${p.name}: ${p.quantity} units`).join('\n')
                : '—';
        const emailText = `New bulk order request\n\nName: ${full_name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company_name || '—'}\n\nProducts:\n${productSummary}\n${custom_products_description ? `\nCustom: ${custom_products_description}\n` : ''}\nTotal units: ${total_units}\nDelivery: ${delivery_address}\nDate: ${preferred_delivery_date} (${delivery_time_window})\nPurpose: ${purpose}\nBudget: ${estimated_budget || '—'}\nPayment terms: ${payment_terms || '—'}\nNotes: ${additional_notes || '—'}`;
        const emailHtml = `<h2 style="font-family:system-ui,sans-serif">Bulk order request</h2>
<table style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1e293b">
<tr><td style="font-weight:600;padding:4px 16px 4px 0">Name</td><td>${escapeHtml(full_name)}</td></tr>
<tr><td style="font-weight:600;padding:4px 16px 4px 0">Email</td><td><a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a></td></tr>
<tr><td style="font-weight:600;padding:4px 16px 4px 0">Phone</td><td>${escapeHtml(phone)}</td></tr>
<tr><td style="font-weight:600;padding:4px 16px 4px 0">Company</td><td>${escapeHtml(company_name || '—')}</td></tr>
<tr><td style="font-weight:600;padding:4px 16px 4px 0">Total units</td><td>${escapeHtml(String(total_units))}</td></tr>
<tr><td style="font-weight:600;padding:4px 16px 4px 0">Delivery date</td><td>${escapeHtml(String(preferred_delivery_date))} (${escapeHtml(String(delivery_time_window))})</td></tr>
<tr><td style="font-weight:600;padding:4px 16px 4px 0">Purpose</td><td>${escapeHtml(String(purpose || '—'))}</td></tr>
<tr><td style="font-weight:600;padding:4px 16px 4px 0">Budget</td><td>${escapeHtml(String(estimated_budget || '—'))}</td></tr>
</table>
<p style="font-family:system-ui,sans-serif;font-weight:600;margin:16px 0 8px">Products</p>
<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap;background:#f8fafc;padding:16px;border-radius:8px;margin:0">${escapeHtml(productSummary)}</pre>
${custom_products_description ? `<p style="font-family:system-ui,sans-serif"><strong>Custom description</strong><br/>${escapeHtml(custom_products_description)}</p>` : ''}
<p style="font-family:system-ui,sans-serif"><strong>Delivery address</strong><br/>${escapeHtml(delivery_address)}</p>
<p style="font-family:system-ui,sans-serif;white-space:pre-wrap"><strong>Notes</strong><br/>${escapeHtml(additional_notes || '—')}</p>`;
        await sendInboundNotificationEmail({
            subject: `[Gourmet Bakes] Bulk order from ${full_name}`,
            text: emailText,
            html: emailHtml,
        });

        // 2. Prepare WhatsApp message for admin
        const ADMIN_PHONE = process.env.ADMIN_PHONE;
        if (ADMIN_PHONE) {
            const productSummary = products.map((p: any) => `- ${p.name}: ${p.quantity} units`).join('\n') || 'Custom request only';
            
            const message = `🎉 *New Bulk Order Request* from ${full_name}\n\n` +
                `📦 *Products:*\n${productSummary}\n` +
                (custom_products_description ? `📝 *Custom:* ${custom_products_description}\n` : '') +
                `🔢 *Total:* ${total_units} units\n\n` +
                `📍 *Delivery:* ${delivery_address}\n` +
                `📅 *Date:* ${preferred_delivery_date} (${delivery_time_window})\n` +
                `💼 *Purpose:* ${purpose}\n` +
                `💰 *Budget:* ${estimated_budget || 'Not specified'}\n` +
                `💳 *Terms:* ${payment_terms}\n\n` +
                `📞 *Contact:* ${phone} | ${email}\n` +
                (company_name ? `🏢 *Company:* ${company_name}\n` : '') +
                `📝 *Notes:* ${additional_notes || 'None'}\n\n` +
                `👉 Reply to discuss details and confirm order.`;

            await sendWhatsAppMessage(ADMIN_PHONE, message);
        }

        // 3. Send confirmation WhatsApp to customer
        const customerPhone = normalizePhoneForWhatsApp(phone);
        if (customerPhone) {
            const customerMsg = `Hello ${full_name}, thank you for your bulk order request with GourmetBakes & More! We've received your inquiry for ${total_units} units on ${preferred_delivery_date}. Our team will review it and get back to you with a quote within 24 hours.`;
            await sendWhatsAppMessage(customerPhone, customerMsg);
        }

        // 4. (TBD) Send Email - Requires email service setup (SendGrid/Resend)
        // For now, we rely on WhatsApp and Database.

        return NextResponse.json({ success: true, request_id: data.bulk_order_id });
    } catch (err: any) {
        console.error('Bulk order submission error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
