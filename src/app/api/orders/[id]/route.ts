import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { OrderStatus } from '@/types';
import { sendWhatsAppMessage, normalizePhoneForWhatsApp } from '@/lib/whatsapp';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createServerSupabaseClient();
        const { id } = await params;

        const { data: order, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products (name, image_url)
                ),
                order_status_history (
                    *
                ),
                notification_preferences (
                    *
                )
            `)
            .eq('order_id', id)
            .single();

        if (error) {
            console.error('Fetch Order Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('API Get Order Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createServerSupabaseClient();
        const { id } = await params;
        const { status, notes } = await req.json();

        // 1. Update Order Status
        const { data: order, error: updateError } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('order_id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        // 2. Add to Status History
        await supabase
            .from('order_status_history')
            .insert({
                order_id: id,
                status,
                notes: notes || `Order status updated to ${status}`
            });

        // 3. Send WhatsApp Notification
        const { data: prefs } = await supabase
            .from('notification_preferences')
            .select('*')
            .eq('order_id', id)
            .single();

        if (prefs?.notify_via_whatsapp) {
            let message = '';
            switch (status as OrderStatus) {
                case 'confirmed':
                    message = `Your order #${order.order_number} has been confirmed! We are starting on it shortly.`;
                    break;
                case 'preparing':
                    message = `Good news! 👨🍳 Your order #${order.order_number} is now being prepared.`;
                    break;
                case 'ready':
                    message = `Your order #${order.order_number} is ready! 📦 It will be out for delivery shortly.`;
                    break;
                case 'on_the_way':
                    message = `Out for delivery! 🛵 Your order #${order.order_number} is on its way to you.`;
                    break;
                case 'delivered':
                    message = `Your order #${order.order_number} has been delivered! 🎉 Enjoy your GourmetBakes!`;
                    break;
            }

            if (message) {
                await sendWhatsAppMessage(normalizePhoneForWhatsApp(prefs.phone_number), message);
            }
        }

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        console.error('API Patch Order Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
