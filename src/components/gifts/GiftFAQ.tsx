'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "How long does delivery take?",
        answer: "For pre-designed gift boxes, we require a minimum of 48 hours notice. For custom configurations or very large orders, please allow 3-5 business days for preparation and delivery coordination."
    },
    {
        question: "Can I customize a gift box?",
        answer: "Absolutely! You can use our Custom Inquiry form to select specific items, set your budget, and give us special instructions. We love creating unique gifts."
    },
    {
        question: "What if the recipient has dietary restrictions?",
        answer: "Please note any dietary restrictions in the 'Special Requests' section of the custom form, or in the order notes if purchasing a pre-designed box. We can accommodate many requests but require advance notice."
    },
    {
        question: "Do you offer corporate gifting?",
        answer: "Yes, we specialize in corporate packages. We can include your branded materials, customized messages, and handle bulk deliveries to multiple addresses."
    },
    {
        question: "Can I schedule delivery for a specific date in the future?",
        answer: "Yes! Our checkout and inquiry forms both allow you to select your preferred delivery date up to 30 days in advance so your gift arrives exactly on time."
    }
];

export default function GiftFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 font-serif">Frequently Asked Questions</h2>
                <p className="text-lg text-slate-600">Everything you need to know about our gifting process.</p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div 
                            key={index}
                            className={`border transition-colors duration-300 rounded-2xl overflow-hidden ${
                                isOpen ? 'border-orange-300 bg-orange-50/30' : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                        >
                            <button
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                            >
                                <span className={`font-bold text-lg ${isOpen ? 'text-orange-600' : 'text-slate-800'}`}>
                                    {faq.question}
                                </span>
                                <ChevronDown 
                                    className={`w-5 h-5 text-orange-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
                                />
                            </button>
                            
                            <div 
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                                    isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <p className="text-slate-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
