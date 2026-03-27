'use client';

import React from 'react';
import Link from 'next/link';

export default function GiftCTASection() {
    return (
        <section className="bg-gradient-to-br from-orange-400 to-amber-300 text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl sm:text-5xl font-extrabold font-serif mb-6 drop-shadow-md">
                    Ready to send a gift?
                </h2>
                <p className="text-xl text-orange-50 mb-10 max-w-2xl mx-auto font-medium">
                    Make someone's day special with the authentic taste of GourmetBakes & More.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                        onClick={() => {
                            document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-orange-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                        Browse Gift Boxes
                    </button>
                    <Link
                        href="https://wa.me/905338585872"
                        target="_blank"
                        className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </section>
    );
}
