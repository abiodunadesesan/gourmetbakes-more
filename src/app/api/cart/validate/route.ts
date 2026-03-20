import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const supabase = createServerSupabaseClient();
        const { items } = await req.json(); // Array of { product_id, quantity }

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid items format' }, { status: 400 });
        }

        const productIds = items.map(i => i.product_id);

        const { data: products, error } = await supabase
            .from('products')
            .select('product_id, name, stock_quantity, is_available')
            .in('product_id', productIds);

        if (error) {
            throw error;
        }

        const unavailableItems: any[] = [];
        const productMap = new Map(products.map(p => [p.product_id, p]));

        for (const item of items) {
            const product = productMap.get(item.product_id);
            if (!product || !product.is_available || product.stock_quantity < item.quantity) {
                unavailableItems.push({
                    product_id: item.product_id,
                    name: product?.name || 'Unknown Product',
                    reason: !product ? 'Not found' : !product.is_available ? 'Currently unavailable' : 'Out of stock'
                });
            }
        }

        return NextResponse.json({
            valid: unavailableItems.length === 0,
            unavailable_items: unavailableItems
        });
    } catch (error: any) {
        console.error('API Cart Validate Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
