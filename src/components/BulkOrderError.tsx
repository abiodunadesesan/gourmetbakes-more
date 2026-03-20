'use client';

import { AlertCircle, RefreshCcw, MessageCircle } from 'lucide-react';

interface BulkOrderErrorProps {
    error: string;
    onRetry: () => void;
}

export default function BulkOrderError({ error, onRetry }: BulkOrderErrorProps) {
    return (
        <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-700">
            <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-red-50 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={40} />
                </div>

                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Something went wrong</h2>
                <p className="text-slate-500 mb-8 font-medium">
                    We couldn't submit your bulk order request. This is usually due to a temporary connection issue.
                </p>

                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-8 text-left">
                    <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-2">Error Details</p>
                    <p className="text-sm font-bold text-red-900">{error}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={onRetry}
                        className="w-full sm:w-auto px-8 py-4 bg-red-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-100"
                    >
                        <RefreshCcw size={18} />
                        <span>Try Again</span>
                    </button>
                    <Link
                        href="https://wa.me/2348001234567"
                        target="_blank"
                        className="w-full sm:w-auto px-8 py-4 bg-green-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-600 transition-all active:scale-95 shadow-lg shadow-green-100"
                    >
                        <MessageCircle size={18} />
                        <span>Chat via WhatsApp</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Internal Link component since we are not in a full page
function Link({ href, target, children, className }: any) {
    return <a href={href} target={target} className={className}>{children}</a>;
}
