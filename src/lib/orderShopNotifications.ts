import { escapeHtml, sendInboundNotificationEmail } from '@/lib/inboundEmail';
import { notifyShopWhatsApp } from '@/lib/whatsapp';

/** Email + WhatsApp to shop when a customer completes checkout (not Noupe chat). */
export async function notifyShopOfNewCheckoutOrder(input: {
    orderNumber: string;
    orderId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddress: string;
    deliveryNotes?: string;
    itemsSummaryText: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
    isDevMock?: boolean;
}): Promise<void> {
    const devNote = input.isDevMock ? '\n\n[Development: order stored in memory only — Supabase not used.]' : '';
    const subject = `[Gourmet Bakes] New order ${input.orderNumber}`;
    const text = [
        'A new order was placed on the website checkout.',
        '',
        `Order number: ${input.orderNumber}`,
        `Order ID: ${input.orderId}`,
        '',
        `Customer: ${input.customerName}`,
        `Phone: ${input.customerPhone}`,
        `Email: ${input.customerEmail ?? '—'}`,
        `Delivery: ${input.deliveryAddress}`,
        input.deliveryNotes ? `Notes: ${input.deliveryNotes}` : '',
        '',
        'Items:',
        input.itemsSummaryText,
        '',
        `Subtotal: ₦${input.subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
        `Delivery fee: ₦${input.deliveryFee.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
        `Total: ₦${input.total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
        devNote,
    ]
        .filter((line) => line !== '')
        .join('\n');

    const addr = escapeHtml(input.deliveryAddress);
    const itemsBlock = escapeHtml(input.itemsSummaryText);
    const html = `<h2 style="margin:0 0 16px;font-family:system-ui,sans-serif;color:#0f172a">New checkout order</h2>
<p style="font-family:system-ui,sans-serif;font-size:14px;color:#64748b;margin:0 0 20px">Place details in your admin / Supabase — customer was sent WhatsApp confirmation if Twilio is configured.</p>
<table style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1e293b;border-collapse:collapse">
<tr><td style="padding:4px 16px 4px 0;font-weight:600">Order</td><td>${escapeHtml(input.orderNumber)}</td></tr>
<tr><td style="padding:4px 16px 4px 0;font-weight:600">Order ID</td><td style="font-size:13px;word-break:break-all">${escapeHtml(input.orderId)}</td></tr>
<tr><td style="padding:4px 16px 4px 0;font-weight:600">Customer</td><td>${escapeHtml(input.customerName)}</td></tr>
<tr><td style="padding:4px 16px 4px 0;font-weight:600">Phone</td><td>${escapeHtml(input.customerPhone)}</td></tr>
<tr><td style="padding:4px 16px 4px 0;font-weight:600">Email</td><td>${escapeHtml(input.customerEmail || '—')}</td></tr>
<tr><td style="padding:4px 16px 4px 0;font-weight:600;vertical-align:top">Delivery</td><td>${addr}</td></tr>
${input.deliveryNotes ? `<tr><td style="padding:4px 16px 4px 0;font-weight:600;vertical-align:top">Notes</td><td>${escapeHtml(input.deliveryNotes)}</td></tr>` : ''}
</table>
<p style="font-family:system-ui,sans-serif;font-weight:600;margin:20px 0 8px">Items</p>
<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap;background:#f8fafc;padding:16px;border-radius:8px;margin:0 0 16px;font-size:14px">${itemsBlock}</pre>
<p style="font-family:system-ui,sans-serif;margin:0"><strong>Subtotal:</strong> ₦${input.subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}<br/>
<strong>Delivery:</strong> ₦${input.deliveryFee.toLocaleString('en-NG', { minimumFractionDigits: 2 })}<br/>
<strong>Total:</strong> ₦${input.total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
${input.isDevMock ? '<p style="font-family:system-ui,sans-serif;color:#b45309;margin-top:16px"><strong>Dev mode:</strong> in-memory order only.</p>' : ''}`;

    await sendInboundNotificationEmail({ subject, text, html });

    const waLines = input.itemsSummaryText.split('\n').filter(Boolean).join(' • ');
    const waMsg =
        `🛒 *New website order*\n\n` +
        `*Order:* ${input.orderNumber}\n` +
        `*Customer:* ${input.customerName}\n` +
        `*Phone:* ${input.customerPhone}\n` +
        (input.customerEmail ? `*Email:* ${input.customerEmail}\n` : '') +
        `*Deliver to:* ${input.deliveryAddress}\n\n` +
        `*Items:*\n${waLines || input.itemsSummaryText}\n\n` +
        `*Total:* ₦${input.total.toLocaleString('en-NG')}` +
        (input.isDevMock ? `\n\n_DEV mode — mock order_` : '');

    await notifyShopWhatsApp(waMsg);
}
