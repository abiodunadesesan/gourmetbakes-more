'use client';

import React from 'react';

export default function GiftHeroSection() {
    return (
        <section className="bg-gradient-to-br from-orange-400 to-amber-300 text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
            </div>
            
            <div className="relative max-w-4xl mx-auto text-center z-10">
                <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 shadow-sm border border-white/30">
                    Premium Gifting Experience
                </div>
                
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-md">
                    Send a Taste of Home
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-orange-50 mb-10 max-w-2xl mx-auto drop-shadow-sm font-medium">
                    Curated Nigerian gift boxes for every occasion. Carefully packed, beautifully presented, and securely delivered.
                </p>
                
                <button 
                    onClick={() => {
                        document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95 border border-orange-100"
                >
                    Explore Gift Boxes
                </button>
            </div>
        </section>
    );
}
