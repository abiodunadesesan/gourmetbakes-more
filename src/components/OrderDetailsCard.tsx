'use client';

import { useState } from 'react';
import { MapPin, Clock, CreditCard, MessageCircle, AlertCircle } from 'lucide-react';
import { calculateEstimatedDelivery } from '@/lib/orderTracking';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types';

interface OrderDetailsCardProps {
    order: Order;
}

export default function OrderDetailsCard({ order }: OrderDetailsCardProps) {
    const [notified, setNotified] = useState(order.notification_prefs?.notify_via_whatsapp ?? true);
    const [updating, setUpdating] = useState(false);

    const toggleNotifications = async () => {
        setUpdating(true);
        try {
            const res = await fetch('/api/notifications/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_id: order.order_id,
                    notify_via_whatsapp: !notified
                })
            });
            if (res.ok) {
                setNotified(!notified);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Delivery Info */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Delivery Address</p>
                                <p className="font-bold text-slate-900 leading-relaxed">{order.delivery_address}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Estimated Arrival</p>
                                <p className="font-black text-orange-600 text-lg">
                                    {calculateEstimatedDelivery(order.status, order.updated_at || order.order_date)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Meta */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Payment Method</p>
                                <p className="font-bold text-slate-900">Cash on Delivery</p>
                                <p className="text-lg font-black text-slate-900 mt-1">{formatCurrency(order.total_amount)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Subscription */}
                <div className="pt-8 border-t border-slate-50">
                    <div className={updating ? "opacity-50 pointer-events-none" : ""}>
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="relative flex items-center pt-1">
                                <input
                                    type="checkbox"
                                    checked={notified}
                                    onChange={toggleNotifications}
                                    className="peer sr-only"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-slate-900 flex items-center gap-2">
                                    <MessageCircle size={18} className="text-green-500" />
                                    Receive WhatsApp Status Updates
                                </p>
                                <p className="text-sm text-slate-500 mt-1 font-medium">We'll alert you whenever your order reaches a new stage.</p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Support Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-200">
                <div className="flex items-center gap-5 text-center sm:text-left">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-orange-500">
                        <AlertCircle size={28} />
                    </div>
                    <div>
                        <h4 className="font-black text-lg">Need Assistance?</h4>
                        <p className="text-slate-400 text-sm font-medium">Our support team is active 24/7 for you.</p>
                    </div>
                </div>
                <button 
                    onClick={() => window.open('https://wa.me/905338585872', '_blank')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <MessageCircle size={20} />
                    Chat with Us
                </button>
            </div>
        </div>
    );
}
