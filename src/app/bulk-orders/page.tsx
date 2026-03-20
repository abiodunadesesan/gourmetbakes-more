import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BulkOrderForm from "@/components/BulkOrderForm";
import { Package, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
    title: 'Bulk Orders & Wholesale | GourmetBakes & More',
    description: 'Request bulk orders for events, businesses, and wholesale. Minimum 50 units for personalized support and bulk pricing.',
};

export default function BulkOrdersPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-24 bg-gradient-to-br from-orange-400 to-amber-600 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">
                            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                                Bulk Orders for Events, Businesses & Wholesale
                            </h1>
                            <p className="text-xl md:text-2xl font-medium text-orange-50 mb-12 leading-relaxed">
                                Order 50+ units and get personalized support. Perfect for weddings, corporate gifts, and resellers seeking authentic Nigerian quality.
                            </p>
                            <button 
                                onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-12 py-5 bg-white text-orange-600 font-black rounded-2xl shadow-xl hover:bg-orange-50 transition-all active:scale-95"
                            >
                                Start Your Bulk Order
                            </button>
                        </div>
                    </div>
                </section>

                {/* Info Section */}
                <section className="py-20 -mt-10 relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
                                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Package size={32} />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Minimum 50 Units</h3>
                                <p className="text-slate-500 font-medium">Enjoy exclusive bulk pricing when ordering 50 units or more across our menu.</p>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Flexible Payments</h3>
                                <p className="text-slate-500 font-medium">Discuss negotiable payment terms, including deposits and corporate accounts.</p>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Zap size={32} />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Fast Response</h3>
                                <p className="text-slate-500 font-medium">Our team will follow up via WhatsApp and email within 24 hours of your request.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <section id="order-form" className="py-20 scroll-mt-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Submit Your Request</h2>
                            <p className="text-slate-500 font-medium">Fill out the details below and we&apos;ll prepare a customized quote for you.</p>
                        </div>
                        <BulkOrderForm />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
