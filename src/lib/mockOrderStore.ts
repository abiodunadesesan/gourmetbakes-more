import { MOCK_PRODUCTS } from '@/lib/mockProducts';
import type { Order, OrderStatus } from '@/types';

/** In-memory orders when Supabase is not used (local dev only). */
export type DevMockOrderRecord = Omit<Order, 'order_items'> & {
    order_items: Array<{
        order_item_id: string;
        order_id: string;
        product_id: string;
        quantity: number;
        unit_price: number;
        subtotal: number;
        products: { name: string; image_url: string | null };
    }>;
};

const orders = new Map<string, DevMockOrderRecord>();

export function saveDevMockOrder(order: DevMockOrderRecord) {
    orders.set(order.order_id, order);
}

export function getDevMockOrder(id: string): DevMockOrderRecord | null {
    return orders.get(id) ?? null;
}

function productById(productId: string) {
    return MOCK_PRODUCTS.find((p) => p.product_id === productId);
}

export function buildDevMockOrderFromCheckout(body: {
    items: Array<{ product_id: string; quantity: number; unit_price: number }>;
    customer_info: {
        name: string;
        phone: string;
        email?: string;
        address: string;
        city: string;
        postalCode?: string;
        notes?: string;
    };
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
}): DevMockOrderRecord {
    const order_id = crypto.randomUUID();
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const randomStr = Math.floor(100 + Math.random() * 900).toString();
    const order_number = `ORD-${dateStr}-${randomStr}`;

    const { items, customer_info, subtotal, deliveryFee, totalAmount } = body;

    const order_items = items.map((item, i) => {
        const p = productById(item.product_id);
        return {
            order_item_id: `dev-oi-${i}-${order_id.slice(0, 8)}`,
            order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.unit_price * item.quantity,
            products: {
                name: p?.name ?? 'Product',
                image_url: p?.image_url ?? null,
            },
        };
    });

    const now = today.toISOString();

    return {
        order_id,
        order_number,
        user_id: null,
        order_date: now,
        status: 'pending' as OrderStatus,
        total_amount: totalAmount,
        subtotal_amount: subtotal,
        delivery_fee: deliveryFee,
        delivery_address: `${customer_info.address}, ${customer_info.city}`,
        delivery_notes: customer_info.notes || null,
        customer_name: customer_info.name,
        customer_phone: customer_info.phone,
        customer_email: customer_info.email || null,
        whatsapp_sent: false,
        created_at: now,
        updated_at: now,
        order_items,
    };
}

export function isLikelySupabaseNetworkFailure(err: unknown): boolean {
    const msg =
        err && typeof err === 'object' && 'message' in err
            ? String((err as { message: string }).message)
            : String(err);
    return (
        msg.includes('fetch failed') ||
        msg.includes('ENOTFOUND') ||
        msg.includes('ECONNREFUSED') ||
        msg.includes('getaddrinfo')
    );
}

/** PostgREST: missing table/relation in schema cache (e.g. migrations not applied). */
export function isMissingDatabaseObjectError(err: unknown): boolean {
    const e = err as { code?: string; message?: string };
    if (e?.code === 'PGRST205') return true;
    const m = String(e?.message ?? '');
    return (
        m.includes('Could not find the table') ||
        (m.includes('Could not find the') && m.includes('in the schema cache')) ||
        (m.includes('relation') && m.includes('does not exist'))
    );
}
