'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingDisplayProps {
    averageRating: number;
    reviewCount: number;
    distribution?: Record<number, number>;
}

export default function RatingDisplay({ averageRating, reviewCount, distribution }: RatingDisplayProps) {
    return (
        <div className="bg-orange-50/50 border border-orange-100 rounded-[2rem] p-8 sm:p-10">
            <div className="flex flex-col md:flex-row gap-10 items-center">
                {/* Large Rating */}
                <div className="text-center md:text-left space-y-2">
                    <div className="flex items-end justify-center md:justify-start gap-2">
                        <span className="text-6xl font-black text-slate-900 font-serif leading-none">
                            {averageRating > 0 ? averageRating.toFixed(1) : '–'}
                        </span>
                        <div className="pb-1.5">
                            <Star size={32} className="fill-orange-500 text-orange-500" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest">
                            {reviewCount} {reviewCount === 1 ? 'Customer Review' : 'Customer Reviews'}
                        </p>
                        <p className="text-xs text-slate-500 font-bold mt-1">Based on verified purchases</p>
                    </div>
                </div>

                {/* Progress Bars */}
                {distribution && (
                    <div className="flex-grow w-full max-w-xs space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-4 group">
                                <span className="text-[10px] font-black text-slate-400 w-4 group-hover:text-slate-900 transition-colors">{star}★</span>
                                <div className="flex-grow h-2 bg-white rounded-full overflow-hidden shadow-inner border border-orange-100/30">
                                    <div 
                                        className="h-full bg-orange-400 transition-all duration-1000 ease-out"
                                        style={{ width: `${distribution[star] || 0}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 w-8 text-right group-hover:text-orange-500 transition-colors">
                                    {distribution[star] || 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
