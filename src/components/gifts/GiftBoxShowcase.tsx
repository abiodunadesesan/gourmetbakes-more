'use client';

import React, { useState, useEffect } from 'react';
import GiftBoxCard from './GiftBoxCard';
import GiftBoxModal from './GiftBoxModal';

interface GiftBoxShowcaseProps {
    onRequestCustom: () => void;
}

export default function GiftBoxShowcase({ onRequestCustom }: GiftBoxShowcaseProps) {
    const [boxes, setBoxes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [activeBox, setActiveBox] = useState<any | null>(null);

    useEffect(() => {
        const fetchBoxes = async () => {
            try {
                const res = await fetch('/api/gift-boxes');
                if (!res.ok) throw new Error('Failed to load collections');
                const data = await res.json();
                setBoxes(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBoxes();
    }, []);

    return (
        <section id="showcase" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-4 font-serif">Our Curated Collections</h2>
                <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full mb-6"></div>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Choose from our most requested gift configurations, or use them as inspiration for your own custom request.
                </p>
            </div>

            {error ? (
                <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center border border-red-100">
                    <p className="mb-4">Unable to load gift boxes. Please refresh.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            ) : loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-slate-100 h-96 rounded-2xl border border-slate-200 shadow-sm"></div>
                    ))}
                </div>
            ) : boxes.length === 0 ? (
                <div className="text-center text-slate-500 py-12">No gift boxes currently available.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {boxes.map(box => (
                        <GiftBoxCard 
                            key={box.gift_box_id} 
                            box={box} 
                            onViewDetails={setActiveBox} 
                        />
                    ))}
                </div>
            )}

            {/* Modal Portal (in place) */}
            {activeBox && (
                <GiftBoxModal 
                    box={activeBox} 
                    onClose={() => setActiveBox(null)} 
                    onRequestCustom={onRequestCustom}
                />
            )}
        </section>
    );
}
