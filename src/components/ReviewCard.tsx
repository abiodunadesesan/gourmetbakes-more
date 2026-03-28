'use client';

import { Star, CheckCircle } from 'lucide-react';
import { Review } from '@/types';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/lib/utils'; // I'll add this to utils or use Date logic

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div className="max-w-full min-w-0 overflow-x-hidden rounded-3xl border border-slate-50 bg-white p-6 transition-all group hover:bg-slate-50/50">
            <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="break-words font-black text-slate-900">{review.reviewer_name}</p>
                        {review.is_verified_purchase && (
                            <span className="flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                                <CheckCircle size={10} />
                                Verified
                            </span>
                        )}
                    </div>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={14}
                                className={cn(
                                    "transition-colors",
                                    review.rating >= s ? "fill-orange-400 text-orange-400" : "text-slate-200"
                                )}
                            />
                        ))}
                    </div>
                </div>
                <p className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-300">
                    {formatTimeAgo(review.created_at)}
                </p>
            </div>

            {review.comment ? (
                <p className="w-full min-w-0 text-sm font-medium leading-relaxed text-slate-600 break-words hyphens-auto [overflow-wrap:anywhere]">
                    {review.comment}
                </p>
            ) : (
                <p className="text-slate-300 text-xs italic font-medium">
                    No comment provided.
                </p>
            )}

            <div className="mt-6 pt-4 border-t border-slate-50/50 flex items-center gap-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Helpful?</p>
                <div className="flex gap-3">
                    <button className="text-[10px] font-black text-slate-400 hover:text-orange-500 transition-colors uppercase flex items-center gap-1">
                        👍 {review.helpful_count || 0}
                    </button>
                    <button className="text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase">
                        👎
                    </button>
                </div>
            </div>
        </div>
    );
}
