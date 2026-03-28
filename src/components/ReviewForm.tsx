'use client';

import { useState } from 'react';
import { Star, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn, textareaFitClasses } from '@/lib/utils';

interface ReviewFormProps {
    productId: string;
    onSuccess?: (newReview: any) => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || rating === 0) {
            setError('Please enter your name and select a rating');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: productId,
                    reviewer_name: name,
                    rating,
                    comment,
                    // user_id: session?.user?.id, // If we had auth
                })
            });

            if (res.ok) {
                const data = await res.json();
                setSuccess(true);
                setName('');
                setRating(0);
                setComment('');
                if (onSuccess) onSuccess(data);
                
                // Auto-dismiss success after 3s
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Unable to post review. Please try again.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">Share Your Experience</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Your feedback helps others discover delicious treats!</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    {/* Star Rating Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Your Rating *</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setRating(s)}
                                    onMouseEnter={() => setHoverRating(s)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="relative transition-transform active:scale-90"
                                >
                                    <Star
                                        size={32}
                                        className={cn(
                                            "transition-colors duration-200",
                                            (hoverRating || rating) >= s
                                                ? "fill-orange-400 text-orange-400"
                                                : "text-slate-200"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Your Name *</label>
                        <input
                            type="text"
                            placeholder="e.g. Sarah Mitchell"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={50}
                            className="w-full min-w-0 px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                        />
                    </div>

                    {/* Comment Area */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Describe Your Experience</label>
                            {comment.length > 0 && (
                                <span className={cn(
                                    "text-[10px] font-black tracking-widest uppercase",
                                    comment.length >= 450 ? "text-red-500" : "text-slate-400"
                                )}>
                                    {comment.length}/500
                                </span>
                            )}
                        </div>
                        <textarea
                            placeholder="Tell us what you loved about it..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={500}
                            rows={4}
                            className={cn(
                                "w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-300 min-h-[7rem]",
                                textareaFitClasses
                            )}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 size={18} />
                        Thank you! Your review has been posted.
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!name || rating === 0 || loading}
                    className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 hover:-translate-y-1 active:scale-95 disabled:grayscale disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <span>Post Review</span>
                    )}
                </button>
            </form>
        </div>
    );
}
