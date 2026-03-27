'use client';

import React from 'react';

interface GiftBox {
    gift_box_id: string;
    name: string;
    occasion: string;
    description: string;
    price: number;
    image_url: string;
    contents: any[];
}

interface Props {
    box: GiftBox;
    onViewDetails: (box: GiftBox) => void;
}

export default function GiftBoxCard({ box, onViewDetails }: Props) {
    return (
        <div 
            onClick={() => onViewDetails(box)}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 cursor-pointer flex flex-col h-full hover:-translate-y-1"
        >
            <div className="relative h-64 overflow-hidden bg-orange-50 flex items-center justify-center">
                <img 
                    src={box.image_url} 
                    alt={box.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3">
                    <span className="bg-orange-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {box.occasion}
                    </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {box.name}
                </h3>
                
                <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-grow">
                    {box.description}
                </p>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-2xl font-black text-orange-600">
                        ₦{box.price.toLocaleString()}
                    </span>
                    
                    <button className="bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold py-2 px-4 rounded-lg text-sm transition-colors group-hover:bg-orange-500 group-hover:text-white">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}
