import { NextResponse } from 'next/server';
import {
    createServerSupabaseClient,
    isServerSupabaseConfigured,
} from '@/lib/supabase';
import { OrderStatus } from '@/types';
import { sendWhatsAppMessage, normalizePhoneForWhatsApp } from '@/lib/whatsapp';
import {
    buildDevMockOrderFromCheckout,
    saveDevMockOrder,
    isLikelySupabaseNetworkFailure,
    isMissingDatabaseObjectError,
} from '@/lib/mockOrderStore';

async function fulfillDevMockOrder(body: {
    items: Array<{ product_id: string; quantity: number; unit_price: number }>;
    customer_info: {
        name: string;
        phone: string;
        email?: string;
        address: string;
        city: string;
        notes?: string;
    };
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
}) {
    const mockOrder = buildDevMockOrderFromCheckout(body);
    saveDevMockOrder(mockOrder);

    const itemListSummary = mockOrder.order_items
        .map((oi) => `${oi.products?.name ?? 'Item'} x${oi.quantity}`)
        .join(', ');

    const confirmMsg = `Hi ${body.customer_info.name}! 🎉\n\nYour order has been confirmed!\n\nOrder ID: #${mockOrder.order_number}\nItems: ${itemListSummary}\nTotal: ₦${body.totalAmount.toLocaleString()}\nDelivery Date: ${new Date(mockOrder.order_date).toLocaleDateString()}\n\nWe'll notify you when your order is ready. Thank you for choosing GourmetBakes & More! 🍰`;

    await sendWhatsAppMessage(normalizePhoneForWhatsApp(body.customer_info.phone), confirmMsg);

    mockOrder.whatsapp_sent = true;
    saveDevMockOrder(mockOrder);
    console.warn(
        '[orders] DEV: Order saved in memory (Supabase missing or unreachable). Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for a real database.'
    );
    return mockOrder;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, customer_info, subtotal, deliveryFee, totalAmount } = body;

        if (!items || !customer_info) {
            return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 });
        }

        const isDev = process.env.NODE_ENV === 'development';

        if (!isServerSupabaseConfigured()) {
            if (isDev) {
                const mockOrder = await fulfillDevMockOrder({
                    items,
                    customer_info,
                    subtotal,
                    deliveryFee,
                    totalAmount,
                });
                return NextResponse.json(mockOrder);
            }
            return NextResponse.json(
                {
                    error:
                        'Orders are not available: database not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for your Supabase project.',
                },
                { status: 503 }
            );
        }

        const supabase = createServerSupabaseClient();

        // 1. Generate human-readable order number: ORD-YYYYMMDD-XXX
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        const randomStr = Math.floor(100 + Math.random() * 900).toString();
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
                order_date: new Date().toISOString(),
            })
            .select()
            .single();

        if (orderError) {
            if (
                isDev &&
                (isLikelySupabaseNetworkFailure(orderError) || isMissingDatabaseObjectError(orderError))
            ) {
                console.warn(
                    '[orders] DEV: Falling back to in-memory order (orders insert failed). Run ecommerce_schema.sql in Supabase for real persistence.'
                );
                const mockOrder = await fulfillDevMockOrder({
                    items,
                    customer_info,
                    subtotal,
                    deliveryFee,
                    totalAmount,
                });
                return NextResponse.json(mockOrder);
            }
            if (isMissingDatabaseObjectError(orderError)) {
                return NextResponse.json(
                    {
                        error:
                            'Database tables are missing. In Supabase → SQL Editor, run ecommerce_schema.sql from the project root.',
                        code: (orderError as { code?: string }).code,
                    },
                    { status: 503 }
                );
            }
            console.error('Order Insert Error:', orderError);
            return NextResponse.json({ error: orderError.message }, { status: 500 });
        }

        // 3. Insert into Order Items table
        const orderItems = items.map((item: { product_id: string; quantity: number; unit_price: number }) => ({
            order_id: order.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.unit_price * item.quantity,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

        if (itemsError) {
            if (
                isDev &&
                (isLikelySupabaseNetworkFailure(itemsError) || isMissingDatabaseObjectError(itemsError))
            ) {
                console.warn(
                    '[orders] DEV: Falling back to in-memory order (order_items error). Run ecommerce_schema.sql in Supabase.'
                );
                const mockOrder = await fulfillDevMockOrder({
                    items,
                    customer_info,
                    subtotal,
                    deliveryFee,
                    totalAmount,
                });
                return NextResponse.json(mockOrder);
            }
            if (isMissingDatabaseObjectError(itemsError)) {
                return NextResponse.json(
                    {
                        error:
                            "Database tables are missing. Run `ecommerce_schema.sql` in the Supabase SQL Editor.",
                        code: (itemsError as { code?: string }).code,
                    },
                    { status: 503 }
                );
            }
            console.error('Order Items Insert Error:', itemsError);
            return NextResponse.json({ error: itemsError.message }, { status: 500 });
        }

        // 4. Initialize Status History (Pending)
        const { error: historyError } = await supabase.from('order_status_history').insert({
            order_id: order.order_id,
            status: 'pending',
            notes: 'Order received and awaiting confirmation',
        });

        if (historyError) console.error('History Insert Error:', historyError);

        // 5. Initialize Notification Preferences (Enabled by default)
        const { error: prefError } = await supabase.from('notification_preferences').insert({
            order_id: order.order_id,
            phone_number: customer_info.phone,
            notify_via_whatsapp: true,
        });

        if (prefError) console.error('Pref Insert Error:', prefError);

        // 6. Send WhatsApp Confirmation to Customer
        const itemListSummary = items
            .map(
                (item: { name?: string; product_id: string; quantity: number }) =>
                    `${item.name ?? item.product_id} x${item.quantity}`
            )
            .join(', ');
        const confirmMsg = `Hi ${customer_info.name}! 🎉\n\nYour order has been confirmed!\n\nOrder ID: #${orderNumber}\nItems: ${itemListSummary}\nTotal: ₦${totalAmount.toLocaleString()}\nDelivery Date: ${new Date(order.order_date).toLocaleDateString()}\n\nWe'll notify you when your order is ready. Thank you for choosing GourmetBakes & More! 🍰`;

        await sendWhatsAppMessage(normalizePhoneForWhatsApp(customer_info.phone), confirmMsg);

        // 7. Update status to reflect WhatsApp sent
        await supabase.from('orders').update({ whatsapp_sent: true }).eq('order_id', order.order_id);

        return NextResponse.json(order);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('API Order Error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
