'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, Truck, Calendar, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import { Order, OrderItem } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Image from 'next/image';

interface OrderConfirmationProps {
    orderId: string;
}

export default function OrderConfirmation({ orderId }: OrderConfirmationProps) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${orderId}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrder(data);
                }
            } catch (err) {
                console.error('Failed to fetch order', err);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-bold">Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20 px-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 font-serif">Order Not Found</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    We couldn't find the order you're looking for. Please check the URL or contact support.
                </p>
                <Link
                    href="/menu"
                    className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all inline-flex items-center gap-2"
                >
                    Return to Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Success Header */}
            <div className="bg-green-50 border border-green-100 rounded-3xl p-8 sm:p-12 text-center">
                <div className="bg-green-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100 animate-in zoom-in duration-500">
                    <CheckCircle2 size={40} />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 font-serif">Order Placed Successfully!</h1>
                <p className="text-slate-600 font-medium">
                    Thank you for your order, <span className="text-slate-900 font-bold">{order.customer_name}</span>.
                    A confirmation message has been sent to your WhatsApp number.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Details */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                        <h2 className="text-xl font-bold text-slate-900 font-serif">Order Details</h2>
                        <span className="bg-orange-100 text-orange-700 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                            {order.order_number}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-slate-600">
                            <Calendar size={20} className="text-orange-500" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Order Date</p>
                                <p className="font-bold text-slate-900">{formatDate(order.order_date)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                            <MapPin size={20} className="text-orange-500" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Delivery Address</p>
                                <p className="font-bold text-slate-900">{order.delivery_address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                            <Truck size={20} className="text-orange-500" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Estimated Delivery</p>
                                <p className="font-bold text-slate-900">24-48 hours</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50">
                        <div className="flex justify-between items-center mb-2 text-slate-500 font-medium">
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.subtotal_amount)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 text-slate-500 font-medium">
                            <span>Delivery Fee</span>
                            <span>{formatCurrency(order.delivery_fee)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                            <span className="font-bold text-slate-900">Total Paid on Delivery</span>
                            <span className="text-2xl font-black text-orange-600">{formatCurrency(order.total_amount)}</span>
                        </div>
                    </div>
                </div>

                {/* Items Summary */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 font-serif pb-4 border-b border-slate-50">Ordered Items</h2>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {(order as any).order_items?.map((item: any) => (
                            <div key={item.order_item_id} className="flex gap-4 items-center group">
                                <div className="relative w-16 h-16 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 group-hover:shadow-md transition-all">
                                    {item.products.image_url ? (
                                        <Image src={item.products.image_url} alt={item.products.name} fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center p-2"><ShoppingBag size={24} className="text-slate-300" /></div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{item.products.name}</p>
                                    <p className="text-sm text-slate-500">Qty: {item.quantity} @ {formatCurrency(item.unit_price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Next Steps */}
                    <div className="pt-6 border-t border-slate-50">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">What's Next?</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0">1</span>
                                <p className="text-sm text-slate-600 leading-relaxed">We're preparing your delicious treats with care.</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0">2</span>
                                <p className="text-sm text-slate-600 leading-relaxed">You'll receive WhatsApp updates on your order status.</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0">3</span>
                                <p className="text-sm text-slate-600 leading-relaxed">Relax and get ready to pay only when your order arrives!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center py-8">
                <Link
                    href="/track-order"
                    className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95"
                >
                    <Truck size={20} />
                    Track Your Order
                </Link>
                <Link
                    href="/menu"
                    className="bg-white border-2 border-orange-500 text-orange-500 px-10 py-4 rounded-2xl font-bold hover:bg-orange-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    Continue Shopping
                    <ArrowRight size={20} />
                </Link>
            </div>

            <div className="text-center">
                <Link
                    href="https://wa.me/905338585872"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-green-600 font-bold transition-colors group"
                >
                    <MessageCircle size={20} className="group-hover:text-green-500 transition-colors" />
                    Questions? Chat with us on WhatsApp
                </Link>
            </div>
        </div>
    );
}
