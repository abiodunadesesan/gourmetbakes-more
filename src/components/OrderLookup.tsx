'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, ArrowRight, ShieldCheck, Phone, Hash } from 'lucide-react';
import { formatOrderNumber, formatPhoneNumber } from '@/lib/orderTracking';
import Link from 'next/link';
import FormField from './FormField';

export default function OrderLookup() {
    const router = useRouter();
    const [orderNumber, setOrderNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrderNumber(formatOrderNumber(e.target.value));
        setError('');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhoneNumber(e.target.value));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber || !phone) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/orders/lookup?order_number=${orderNumber}&phone_number=${encodeURIComponent(phone)}`);
            if (res.ok) {
                const order = await res.json();
                router.push(`/track-order/${order.order_id}`);
            } else {
                const data = await res.json();
                setError(data.error || 'Order not found. Please check and try again.');
            }
        } catch (err) {
            setError('Unable to reach server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isReady = orderNumber.length >= 12 && phone.length >= 10;

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-orange-100/50 relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-50 rounded-full blur-3xl group-hover:bg-orange-100 transition-colors" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-50 rounded-full blur-3xl group-hover:bg-orange-100 transition-colors" />

                <div className="relative">
                    <div className="bg-orange-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-200 rotate-3 group-hover:rotate-0 transition-transform">
                        <Search size={28} />
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 mb-2 font-serif">Order Lookup</h2>
                    <p className="text-slate-500 mb-8 font-medium">Quickly find your order status using your details.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Hash size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Order Number (ORD-YYYYMMDD-XXX)"
                                    value={orderNumber}
                                    onChange={handleOrderChange}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                                    maxLength={15}
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!isReady || loading}
                            className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 hover:-translate-y-1 active:scale-95 disabled:grayscale disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    <span>Searching...</span>
                                </>
                            ) : (
                                <>
                                    <span>Track Order</span>
                                    <ArrowRight size={24} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
                        <Link 
                            href="/menu"
                            className="text-slate-400 hover:text-orange-500 font-bold transition-colors text-sm underline underline-offset-4"
                        >
                            Back to Menu
                        </Link>
                        
                        <p className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest">
                            <ShieldCheck size={14} />
                            Secure Lookup
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
