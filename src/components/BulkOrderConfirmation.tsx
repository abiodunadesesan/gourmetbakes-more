'use client';

import { CheckCircle2, ChevronRight, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface BulkOrderConfirmationProps {
    orderData: any;
}

export default function BulkOrderConfirmation({ orderData }: BulkOrderConfirmationProps) {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-700">
            <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-orange-100 border border-orange-50 text-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-amber-500"></div>
                
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle2 size={48} />
                </div>

                <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                    Request Received!
                </h2>
                
                <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed mb-12">
                    Thank you, <span className="text-slate-900 font-bold">{orderData.full_name}</span>. We've received your bulk order request and will follow up with you via WhatsApp and email within 24 hours.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Order Summary</p>
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-slate-700">Total Units: <span className="text-slate-900">{orderData.total_units}</span></p>
                            <p className="text-sm font-bold text-slate-700">Purpose: <span className="text-slate-900">{orderData.purpose}</span></p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Delivery Details</p>
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-slate-700">Date: <span className="text-slate-900">{new Date(orderData.preferred_delivery_date).toLocaleDateString()}</span></p>
                            <p className="text-sm font-bold text-slate-700">Location: <span className="text-slate-900">{orderData.delivery_address.substring(0, 30)}...</span></p>
                        </div>
                    </div>
                </div>

                <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 mb-12 text-left">
                    <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                        <ChevronRight className="bg-orange-200 text-orange-700 rounded-full p-0.5" size={16} />
                        What happens next?
                    </h3>
                    <ul className="space-y-3">
                        {[
                            "Our team reviews your request and confirms availability",
                            "We provide a detailed quote with final pricing",
                            "We discuss payment terms and delivery logistics",
                            "You confirm and we begin preparations"
                        ].map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-orange-800 font-medium">
                                <span className="flex-shrink-0 w-5 h-5 bg-orange-200 text-orange-700 rounded-full text-[10px] flex items-center justify-center font-black">{i + 1}</span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-500 transition-all active:scale-95"
                    >
                        <Home size={18} />
                        <span>Return Home</span>
                    </Link>
                    <Link
                        href="/products"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <ShoppingBag size={18} />
                        <span>Browse Products</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
