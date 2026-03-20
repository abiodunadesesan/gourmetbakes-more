import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { OrderStatus } from '@/types';
import { sendWhatsAppMessage, normalizePhoneForWhatsApp } from '@/lib/whatsapp';

export async function POST(req: Request) {
    try {
        const supabase = createServerSupabaseClient();
        const body = await req.json();
        const { items, customer_info, subtotal, deliveryFee, totalAmount } = body;

        // 1. Generate human-readable order number: ORD-YYYYMMDD-XXX
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        const randomStr = Math.floor(100 + Math.random() * 900).toString(); // 3 random digits
        const orderNumber = `ORD-${dateStr}-${randomStr}`;

        // 2. Insert into Orders table
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                status: 'pending' as OrderStatus,
                total_amount: totalAmount,
                subtotal_amount: subtotal,
                delivery_fee: deliveryFee,
                delivery_address: `${customer_info.address}, ${customer_info.city}`,
                delivery_notes: customer_info.notes,
                customer_name: customer_info.name,
                customer_phone: customer_info.phone,
                customer_email: customer_info.email || null,
                whatsapp_sent: false,
                order_date: new Date().toISOString()
            })
            .select()
            .single();

        if (orderError) {
            console.error('Order Insert Error:', orderError);
            return NextResponse.json({ error: orderError.message }, { status: 500 });
        }

        // 3. Insert into Order Items table
        const orderItems = items.map((item: any) => ({
            order_id: order.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.unit_price * item.quantity
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            console.error('Order Items Insert Error:', itemsError);
            return NextResponse.json({ error: itemsError.message }, { status: 500 });
        }

        // 4. Initialize Status History (Pending)
        const { error: historyError } = await supabase
            .from('order_status_history')
            .insert({
                order_id: order.order_id,
                status: 'pending',
                notes: 'Order received and awaiting confirmation'
            });

        if (historyError) console.error('History Insert Error:', historyError);

        // 5. Initialize Notification Preferences (Enabled by default)
        const { error: prefError } = await supabase
            .from('notification_preferences')
            .insert({
                order_id: order.order_id,
                phone_number: customer_info.phone,
                notify_via_whatsapp: true
            });

        if (prefError) console.error('Pref Insert Error:', prefError);

        // 6. Send WhatsApp Confirmation to Customer
        const itemListSummary = items.map((item: any) => `${item.name} x${item.quantity}`).join(', ');
        const confirmMsg = `Hi ${customer_info.name}! 🎉\n\nYour order has been confirmed!\n\nOrder ID: #${orderNumber}\nItems: ${itemListSummary}\nTotal: ₦${totalAmount.toLocaleString()}\nDelivery Date: ${new Date(order.order_date).toLocaleDateString()}\n\nWe'll notify you when your order is ready. Thank you for choosing GourmetBakes & More! 🍰`;
        
        await sendWhatsAppMessage(normalizePhoneForWhatsApp(customer_info.phone), confirmMsg);

        // 7. Update status to reflect WhatsApp sent
        await supabase
            .from('orders')
            .update({ whatsapp_sent: true })
            .eq('order_id', order.order_id);

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('API Order Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
