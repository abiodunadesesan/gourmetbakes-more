import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const orderNumber = searchParams.get('order_number');
        const phoneNumber = searchParams.get('phone_number');

        if (!orderNumber || !phoneNumber) {
            return NextResponse.json({ error: 'Order number and phone number are required' }, { status: 400 });
        }

        const supabase = createServerSupabaseClient();

        // Normalize phone number for comparison (e.g., remove leading 0 and spaces)
        let normalizedPhone = phoneNumber.replace(/\s+/g, '');
        if (normalizedPhone.startsWith('0')) {
            normalizedPhone = '+234' + normalizedPhone.substring(1);
        }

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
            .eq('order_number', orderNumber.toUpperCase())
            .or(`customer_phone.eq.${phoneNumber},customer_phone.eq.${normalizedPhone}`)
            .single();

        if (error || !order) {
            console.error('Lookup Error:', error);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('API Lookup Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
