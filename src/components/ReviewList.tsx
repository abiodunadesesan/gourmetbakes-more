'use client';

import { useState, useEffect } from 'react';
import { ArrowDown, Loader2, MessageSquare, Star } from 'lucide-react';
import { Review, ReviewSortOption } from '@/types';
import ReviewCard from './ReviewCard';
import RatingDisplay from './RatingDisplay';
import { cn } from '@/lib/utils';

interface ReviewListProps {
    productId: string;
    refreshTrigger?: number; // Used to trigger refresh from outside (e.g. after new review)
}

export default function ReviewList({ productId, refreshTrigger }: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [distribution, setDistribution] = useState<Record<number, number>>({});
    const [sort, setSort] = useState<ReviewSortOption>('recent');
    const [error, setError] = useState('');

    const fetchReviews = async (isInitial = true) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const currentPage = isInitial ? 1 : page + 1;
            const res = await fetch(`/api/products/${productId}/reviews?sort=${sort}&page=${currentPage}&limit=5`);
            if (res.ok) {
                const data = await res.json();
                if (isInitial) {
                    setReviews(data.reviews);
                    setAverageRating(data.average_rating);
                    setTotalCount(data.total_count);
                    setDistribution(data.star_distribution);
                    setPage(1);
                } else {
                    setReviews(prev => [...prev, ...data.reviews]);
                    setPage(currentPage);
                }
            } else {
                setError('Unable to load reviews');
            }
        } catch (err) {
            setError('Failed to reach server');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchReviews(true);
    }, [productId, sort, refreshTrigger]);

    if (loading && reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Gathering Feedbacks...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {totalCount > 0 ? (
                <>
                    <RatingDisplay 
                        averageRating={averageRating} 
                        reviewCount={totalCount} 
                        distribution={distribution} 
                    />

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-900 text-white rounded-lg">
                                <MessageSquare size={16} />
                            </div>
                            <h4 className="font-black text-slate-900 uppercase tracking-tight">Verified Reviews</h4>
                        </div>

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as ReviewSortOption)}
                            className="bg-slate-50 border-none rounded-xl px-4 py-2 font-black text-xs text-slate-600 focus:ring-0 cursor-pointer outline-none"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="highest">Highest Rated</option>
                            <option value="lowest">Lowest Rated</option>
                            <option value="helpful">Most Helpful</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {reviews.map((review) => (
                            <ReviewCard key={review.review_id} review={review} />
                        ))}
                    </div>

                    {reviews.length < totalCount && (
                        <div className="pt-4 flex flex-col items-center gap-4">
                            <button
                                onClick={() => fetchReviews(false)}
                                disabled={loadingMore}
                                className="bg-white border-2 border-slate-50 text-slate-900 px-10 py-4 rounded-2xl font-black text-sm hover:border-orange-500 hover:text-orange-500 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {loadingMore ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Loading More...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Load More Reviews</span>
                                        <ArrowDown size={18} />
                                    </>
                                )}
                            </button>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                Showing {reviews.length} of {totalCount} reviews
                            </p>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                        <Star size={32} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2 font-serif">No Reviews Yet</h4>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto mb-8">
                        Be the first to share your experience with this treat!
                    </p>
                </div>
            )}
        </div>
    );
}
