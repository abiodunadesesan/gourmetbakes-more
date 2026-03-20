import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/utils';

export async function POST(req: Request) {
    try {
        const supabase = createServerSupabaseClient();
        const { order_id } = await req.json();

        // 1. Fetch full order details
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products (name)
                )
            `)
            .eq('order_id', order_id)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // 2. Prepare WhatsApp message based on status
        let statusEmoji = '📦';
        let statusText = order.status.replace(/_/g, ' ').toUpperCase();
        let bodyText = 'Your order status has been updated.';

        switch (order.status) {
            case 'pending':
                statusEmoji = '⏳';
                statusText = 'ORDER RECEIVED';
                bodyText = 'We have received your order and are currently reviewing it. Expect a confirmation soon!';
                break;
            case 'confirmed':
                statusEmoji = '✅';
                bodyText = 'Your order has been confirmed and is being processed.';
                break;
            case 'preparing':
                statusEmoji = '👨‍🍳';
                bodyText = 'Our chefs are currently preparing your delicious treats.';
                break;
            case 'on_the_way':
                statusEmoji = '🚚';
                bodyText = 'Your order is on the way! Get ready to receive it.';
                break;
            case 'delivered':
                statusEmoji = '🎉';
                bodyText = 'Your order has been delivered. Enjoy your meal!';
                break;
        }

        const message = `
${statusEmoji} *Order Update: ${statusText}*

*Order #:* ${order.order_number}
*Status:* ${order.status.replace(/_/g, ' ')}

${bodyText}

📍 *Delivery Address:*
${order.delivery_address}

💰 *Total:* ${formatCurrency(order.total_amount)} (Cash on Delivery)

Track your order: ${req.headers.get('origin') || 'https://gourmetbakes.com'}/track-order/${order.order_id}

Questions? Reply to this message.
`.trim();

        // 3. Log simulated WhatsApp message
        console.log('--- SIMULATED WHATSAPP MESSAGE ---');
        console.log(`To: ${order.customer_phone}`);
        console.log(`Message: ${message}`);
        console.log('-----------------------------------');

        // 4. Update order to mark WhatsApp as sent
        await supabase
            .from('orders')
            .update({ whatsapp_sent: true })
            .eq('order_id', order_id);

        return NextResponse.json({ status: 'sent', simulated: true });
    } catch (error: any) {
        console.error('API WhatsApp Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
