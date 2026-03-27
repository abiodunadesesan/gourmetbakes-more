'use client';

import React from 'react';
import GiftHeroSection from '@/components/gifts/GiftHeroSection';
import GiftBoxShowcase from '@/components/gifts/GiftBoxShowcase';
import WhyChooseUsSection from '@/components/gifts/WhyChooseUsSection';
import CustomGiftForm from '@/components/gifts/CustomGiftForm';
import GiftFAQ from '@/components/gifts/GiftFAQ';
import GiftCTASection from '@/components/gifts/GiftCTASection';

export default function GiftConciergePage() {
    
    const scrollToCustomForm = () => {
        document.getElementById('custom-gift-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main className="min-h-screen bg-white">
            <GiftHeroSection />
            <WhyChooseUsSection />
            <GiftBoxShowcase onRequestCustom={scrollToCustomForm} />
            
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <CustomGiftForm />
                </div>
            </section>

            <GiftFAQ />
            <GiftCTASection />
        </main>
    );
}
