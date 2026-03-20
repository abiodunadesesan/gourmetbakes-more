import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppMessage, normalizePhoneForWhatsApp } from '@/lib/whatsapp';

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
