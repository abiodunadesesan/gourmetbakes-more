import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { MOCK_PRODUCTS } from '@/lib/mockProducts';

type CartLine = { product_id: string; quantity: number };

function validateItems(
    items: CartLine[],
    productRows: { product_id: string; name: string; stock_quantity: number; is_available: boolean }[]
) {
    const unavailableItems: {
        product_id: string;
        name: string;
        reason: string;
    }[] = [];
    const productMap = new Map(productRows.map((p) => [p.product_id, p]));

    for (const item of items) {
        const product = productMap.get(item.product_id);
        if (!product || !product.is_available || product.stock_quantity < item.quantity) {
            unavailableItems.push({
                product_id: item.product_id,
                name: product?.name || 'Unknown Product',
                reason: !product
                    ? 'Not found'
                    : !product.is_available
                      ? 'Currently unavailable'
                      : 'Out of stock',
            });
        }
    }

    return {
        valid: unavailableItems.length === 0,
        unavailable_items: unavailableItems,
    };
}

export async function POST(req: Request) {
    try {
        const { items } = await req.json();

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid items format' }, { status: 400 });
        }

        const productIds = items.map((i: CartLine) => i.product_id);

        let usedFallback = false;

        try {
            const supabase = createServerSupabaseClient();
            const { data: products, error } = await supabase
                .from('products')
                .select('product_id, name, stock_quantity, is_available')
                .in('product_id', productIds);

            if (error) {
                throw error;
            }

            if (products && products.length > 0) {
                return NextResponse.json(validateItems(items, products));
            }

            // Query succeeded but no rows matched (empty table or IDs not in DB) — use mock catalog
            usedFallback = true;
        } catch {
            usedFallback = true;
        }

        const mockRows = MOCK_PRODUCTS.filter((p) => productIds.includes(p.product_id)).map((p) => ({
            product_id: p.product_id,
            name: p.name,
            stock_quantity: p.stock_quantity,
            is_available: p.is_available,
        }));

        const body = validateItems(items, mockRows);
        if (usedFallback && process.env.NODE_ENV === 'development') {
            console.warn('[cart/validate] Using mock catalog (database unavailable or empty).');
        }
        return NextResponse.json(body);
    } catch (error: any) {
        console.error('API Cart Validate Error:', error);
        return NextResponse.json(
            { error: error.message || 'Validation failed', valid: false, unavailable_items: [] },
            { status: 500 }
        );
    }
}
