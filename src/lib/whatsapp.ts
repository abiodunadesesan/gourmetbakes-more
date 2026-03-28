import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const businessPhone = process.env.WHATSAPP_BUSINESS_PHONE;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendWhatsAppMessage(to: string, message: string) {
    if (!client) {
        console.warn('Twilio client not initialized. Check environment variables.');
        return { success: false, error: 'Twilio not configured' };
    }

    try {
        // Twilio WhatsApp numbers must be in the format 'whatsapp:+1234567890'
        const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
        const formattedFrom = businessPhone?.startsWith('whatsapp:') ? businessPhone : `whatsapp:${businessPhone}`;

        const response = await client.messages.create({
            body: message,
            from: formattedFrom,
            to: formattedTo,
        });

        console.log('WhatsApp message sent:', response.sid);
        return { success: true, messageId: response.sid };
    } catch (error: any) {
        console.error('Error sending WhatsApp message:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Normalizes phone number to international format (+234...)
 * for Twilio/WhatsApp compatibility if not already formatted.
 */
export function normalizePhoneForWhatsApp(phone: string): string {
    let normalized = phone.replace(/\s+/g, '').replace(/-/g, '');
    if (normalized.startsWith('0')) {
        normalized = '+234' + normalized.substring(1);
    } else if (!normalized.startsWith('+')) {
        normalized = '+' + normalized;
    }
    return normalized;
}

/**
 * WhatsApp alert to the shop owner. Set `ADMIN_PHONE` (E.164 or local NG format).
 * Requires Twilio + `WHATSAPP_BUSINESS_PHONE` like customer messages.
 */
export async function notifyShopWhatsApp(message: string): Promise<void> {
    const raw = process.env.ADMIN_PHONE?.trim();
    if (!raw) {
        console.warn('[whatsapp] ADMIN_PHONE not set; skipping shop owner WhatsApp.');
        return;
    }
    await sendWhatsAppMessage(normalizePhoneForWhatsApp(raw), message);
}
