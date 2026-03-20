// GourmetBakes & More — Database Schema Types

export interface User {
    user_id: string;
    email: string;
    phone: string | null;
    first_name: string | null;
    last_name: string | null;
    created_at: string;
    updated_at: string;
}

export interface Product {
    product_id: string;
    name: string;
    description: string | null;
    short_description?: string | null;
    price: number;
    category: string;
    image_url: string | null;
    image_gallery?: string[];
    stock_quantity: number;
    is_available: boolean;
    is_featured?: boolean;
    reviews?: Review[];
    rating?: number;
    average_rating?: number;
    review_count?: number;
    star_distribution?: Record<number, number>;
    ingredients?: string;
    shelf_life?: string;
    allergen_info?: string;
    created_at: string;
    updated_at: string;
}

export interface Review {
    review_id: string;
    product_id: string;
    user_id: string | null;
    reviewer_name: string;
    rating: number;
    comment: string | null;
    is_verified_purchase: boolean;
    helpful_count: number;
    created_at: string;
    updated_at: string;
}

export type ReviewSortOption = 'recent' | 'helpful' | 'highest' | 'lowest';

export interface CartItem {
    id: string;
    product_id: string;
    name: string;
    price: number;
    image_url: string | null;
    quantity: number;
}

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'on_the_way'
    | 'delivered'
    | 'cancelled';

export interface Order {
    order_id: string;
    order_number: string;
    user_id: string | null;
    order_date: string;
    status: OrderStatus;
    total_amount: number;
    subtotal_amount: number;
    delivery_fee: number;
    delivery_address: string;
    delivery_notes: string | null;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    whatsapp_sent: boolean;
    created_at: string;
    updated_at: string;
    order_items?: OrderItem[];
    status_history?: OrderStatusHistory[];
    notification_prefs?: NotificationPreference;
}

export interface OrderItem {
    order_item_id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    products?: Product;
}

export interface OrderStatusHistory {
    status_history_id: string;
    order_id: string;
    status: OrderStatus;
    timestamp: string;
    notes: string | null;
}

export interface NotificationPreference {
    notification_pref_id: string;
    order_id: string;
    phone_number: string;
    notify_via_whatsapp: boolean;
    created_at: string;
    updated_at: string;
}

export interface ContactMessage {
    contact_message_id: string;
    name: string;
    email: string;
    phone?: string | null;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    created_at: string;
    updated_at: string;
}

export interface CateringInquiry {
    catering_inquiry_id: string;
    event_name: string;
    event_date: string;
    guest_count: number;
    event_type: string;
    products_requested: string[];
    dietary_requirements?: string | null;
    special_requests?: string | null;
    contact_name: string;
    phone: string;
    email: string;
    delivery_address: string;
    status: 'new' | 'quoted' | 'confirmed' | 'completed';
    created_at: string;
    updated_at: string;
}

export interface BulkOrderRequest {
    bulk_order_request_id: string;
    products_requested: Record<string, number>;
    total_quantity: number;
    delivery_date: string;
    delivery_frequency: 'one-time' | 'weekly' | 'bi-weekly' | 'monthly';
    business_name: string;
    business_type: string;
    resale_intent: boolean;
    contact_name: string;
    phone: string;
    email: string;
    delivery_address: string;
    status: 'new' | 'quoted' | 'confirmed' | 'completed';
    created_at: string;
    updated_at: string;
}

// API Response Types

export interface ApiHealthResponse {
    status: 'ok' | 'error';
    timestamp: string;
    database: 'connected' | 'disconnected';
    productCount?: number;
    error?: string;
}

export interface SystemStatus {
    productCount: number;
    apiStatus: 'connected' | 'error';
    dbStatus: 'connected' | 'error';
}
