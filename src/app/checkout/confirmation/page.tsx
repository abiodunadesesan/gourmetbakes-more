'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderConfirmation from '@/components/OrderConfirmation';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {orderId ? (
                <OrderConfirmation orderId={orderId} />
            ) : (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 font-serif">Invalid Order</h2>
                    <p className="text-slate-500 mb-8">No order ID found in the URL.</p>
                </div>
            )}
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <main className="min-h-screen bg-slate-50/30 flex flex-col">
            <Navbar />
            
            <div className="flex-grow pt-32 pb-20">
                <Suspense fallback={
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    </div>
                }>
                    <ConfirmationContent />
                </Suspense>
            </div>

            <Footer />
        </main>
    );
}
