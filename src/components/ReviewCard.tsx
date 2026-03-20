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
        <div className="bg-white border border-slate-50 rounded-3xl p-6 hover:bg-slate-50/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900">{review.reviewer_name}</p>
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
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    {formatTimeAgo(review.created_at)}
                </p>
            </div>

            {review.comment ? (
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
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
