import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const supabase = createServerSupabaseClient();
        const { order_id, notify_via_whatsapp } = await req.json();

        if (!order_id) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('notification_preferences')
            .upsert({
                order_id,
                notify_via_whatsapp,
                updated_at: new Date().toISOString()
            }, { onConflict: 'order_id' });

        if (error) {
            throw error;
        }

        return NextResponse.json({ status: 'updated' });
    } catch (error: any) {
        console.error('API Preference Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
