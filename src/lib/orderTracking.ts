/**
 * Normalizes phone number to international format (+234...)
 */
export function normalizePhoneNumber(phone: string): string {
    let normalized = phone.replace(/\s+/g, '').replace(/-/g, '');
    if (normalized.startsWith('0')) {
        normalized = '+234' + normalized.substring(1);
    }
    return normalized;
}

/**
 * Formats order number as user types (ORD-YYYYMMDD-XXX)
 */
export function formatOrderNumber(value: string): string {
    let v = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!v.startsWith('ORD')) {
        v = 'ORD' + v;
    }
    
    let parts = [];
    if (v.length > 0) parts.push(v.substring(0, 3));
    if (v.length > 3) parts.push(v.substring(3, 11));
    if (v.length > 11) parts.push(v.substring(11, 14));
    
    return parts.join('-');
}

/**
 * Formats phone number as user types (+234 XXX XXX XXXX)
 */
export function formatPhoneNumber(value: string): string {
    let v = value.replace(/\D/g, '');
    if (v.startsWith('234')) {
        v = '+' + v;
    } else if (v.startsWith('0')) {
        // stay as is
    }
    
    // Simple grouping
    if (v.startsWith('+234')) {
        let parts = [];
        parts.push(v.substring(0, 4));
        if (v.length > 4) parts.push(v.substring(4, 7));
        if (v.length > 7) parts.push(v.substring(7, 10));
        if (v.length > 10) parts.push(v.substring(10, 14));
        return parts.join(' ');
    }
    
    return v;
}

/**
 * Calculates estimated delivery time based on status
 */
export function calculateEstimatedDelivery(status: string, updatedAt: string): string {
    const lastUpdate = new Date(updatedAt);
    let estimated = new Date(lastUpdate);

    switch (status) {
        case 'pending':
        case 'confirmed':
            estimated.setHours(estimated.getHours() + 2);
            break;
        case 'preparing':
            estimated.setMinutes(estimated.getMinutes() + 90);
            break;
        case 'on_the_way':
            estimated.setMinutes(estimated.getMinutes() + 30);
            break;
        case 'delivered':
            return 'Delivered';
        default:
            return 'Processing...';
    }

    const timeStr = estimated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isToday = estimated.toDateString() === new Date().toDateString();
    
    return `Expected by ${timeStr} ${isToday ? 'today' : 'tomorrow'}`;
}
