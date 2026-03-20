import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const supabase = createServerSupabaseClient();
        const { product_id, reviewer_name, rating, comment, user_id } = await req.json();

        if (!product_id || !reviewer_name || !rating) {
            return NextResponse.json({ error: 'Product ID, name, and rating are required' }, { status: 400 });
        }

        // 1. Verify Purchase if user_id is provided
        let is_verified_purchase = false;
        if (user_id) {
            const { data: orders } = await supabase
                .from('orders')
                .select('order_id, order_items(product_id)')
                .eq('user_id', user_id)
                .eq('status', 'delivered');
            
            if (orders) {
                is_verified_purchase = orders.some(order => 
                    (order.order_items as any[]).some(item => item.product_id === product_id)
                );
            }
        }

        // 2. Insert Review
        const { data: review, error: insertError } = await supabase
            .from('reviews')
            .insert({
                product_id,
                user_id: user_id || null,
                reviewer_name: reviewer_name.trim(),
                rating: Number(rating),
                comment: comment?.trim() || null,
                is_verified_purchase,
                helpful_count: 0
            })
            .select()
            .single();

        if (insertError) {
            console.error('Insert Review Error:', insertError);
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        // 3. Update Product Aggregate Rating (simplified for v1 - usually better as a DB trigger)
        // Note: In a production app, we would use a RPC call or a counter table.
        // For this demo, we'll just return the review and let the frontend update if needed,
        // or the next GET call will have fresh data.

        return NextResponse.json(review, { status: 201 });
    } catch (error: any) {
        console.error('API Review Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
