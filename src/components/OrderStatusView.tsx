'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, RefreshCw } from 'lucide-react';
import { Order } from '@/types';
import StatusTimeline from './StatusTimeline';
import OrderDetailsCard from './OrderDetailsCard';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/lib/utils';

interface OrderStatusViewProps {
    orderId: string;
}

export default function OrderStatusView({ orderId }: OrderStatusViewProps) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchOrder = async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        else setRefreshing(true);
        
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
                setLastUpdated(new Date());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrder();
        
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchOrder(true);
        }, 30000);

        return () => clearInterval(interval);
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                <p className="text-slate-500 font-black animate-pulse uppercase tracking-[0.2em] text-sm">Synchronizing Status...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20 px-4">
                <div className="bg-red-50 text-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 font-black text-3xl">!</div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 font-serif">Order Vanished</h2>
                <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium leading-relaxed">
                    We couldn't retrieve this order. It might have been archived or the ID is incorrect.
                </p>
                <Link
                    href="/track-order"
                    className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-black hover:bg-orange-600 transition-all inline-flex items-center gap-2 shadow-xl shadow-orange-100"
                >
                    <ArrowLeft size={20} />
                    Try Another Lookup
                </Link>
            </div>
        );
    }

    const timeAgo = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    const timeAgoText = timeAgo < 60 ? 'Just now' : `${Math.floor(timeAgo / 60)} minutes ago`;

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-orange-50/50 p-8 sm:p-12 rounded-[3rem] border border-orange-100/50">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
                            Official Tracking
                        </span>
                        {refreshing && (
                            <span className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-widest animate-pulse">
                                <RefreshCw size={12} className="animate-spin" />
                                Updating...
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3 font-serif">
                        {order.order_number}
                    </h1>
                    <p className="text-slate-500 font-bold flex items-center gap-2">
                        Placed on {formatDate(order.order_date)}
                    </p>
                    <p className="text-orange-600 font-black text-sm uppercase tracking-widest mt-2 flex items-center gap-2">
                         For {order.customer_name.split(' ')[0]} 
                    </p>
                </div>
                
                <div className="flex flex-col items-center md:items-end gap-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Last Updated</p>
                    <p className="font-black text-slate-900 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                        {timeAgoText}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content: Timeline & Details */}
                <div className="lg:col-span-2 space-y-12">
                    <StatusTimeline currentStatus={order.status} history={order.status_history || []} />
                    <OrderDetailsCard order={order} />
                </div>

                {/* Sidebar: Order Summary */}
                <div className="space-y-8">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-8 font-serif pb-4 border-b border-slate-50 flex items-center gap-3">
                            <ShoppingBag className="text-orange-500" size={24} />
                            Order Summary
                        </h3>
                        
                        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {order.order_items?.map((item: any) => (
                                <div key={item.order_item_id} className="flex gap-4 items-start group">
                                    <div className="relative w-16 h-16 rounded-2xl bg-orange-50 overflow-hidden flex-shrink-0">
                                        {item.products.image_url ? (
                                            <Image src={item.products.image_url} alt={item.products.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full"><ShoppingBag size={20} className="text-orange-200" /></div>
                                        )}
                                    </div>
                                    <div className="flex-grow pt-1">
                                        <p className="font-black text-slate-900 text-sm leading-tight mb-1">{item.products.name}</p>
                                        <p className="text-xs font-bold text-slate-400">
                                            {item.quantity} × {formatCurrency(item.unit_price)}
                                        </p>
                                    </div>
                                    <div className="pt-1">
                                        <p className="font-black text-slate-900 text-sm">{formatCurrency(item.subtotal)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50 space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                <span>Subtotal</span>
                                <span>{formatCurrency(order.subtotal_amount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                <span>Delivery Fee</span>
                                <span>{formatCurrency(order.delivery_fee)}</span>
                            </div>
                            <div className="h-px bg-slate-50 my-2" />
                            <div className="flex justify-between items-center">
                                <span className="font-black text-slate-900">Total</span>
                                <span className="text-2xl font-black text-orange-600">{formatCurrency(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/menu"
                        className="w-full bg-slate-100 text-slate-600 py-5 rounded-2xl font-black text-center hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group"
                    >
                        New Order
                        <ArrowLeft size={20} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
