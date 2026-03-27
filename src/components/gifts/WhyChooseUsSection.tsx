import React from 'react';
import { Gift, HeartHandshake, Truck } from 'lucide-react';

export default function WhyChooseUsSection() {
    return (
        <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 border-y border-slate-100">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-16 text-center font-serif">
                    Why Choose Our Gift Concierge?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    
                    {/* Item 1 */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                        <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Gift size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Handpicked Selection</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Every item is carefully chosen to ensure premium quality, stunning presentation, and authentic Nigerian taste.
                        </p>
                    </div>

                    {/* Item 2 */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                        <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HeartHandshake size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Personalized Touch</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Customize your gifts with meaningful messages, occasion-specific packaging, and specialized delivery dates.
                        </p>
                    </div>

                    {/* Item 3 */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Truck size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Reliable Delivery</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Fast, secure, and coordinated delivery straight to the door of your loved ones or corporate clients.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
