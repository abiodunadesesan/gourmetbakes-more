import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import { MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
    const bizPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+905338585872";

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-orange-50 text-orange-600 rounded-full font-black text-xs uppercase tracking-widest mb-4">
                            Connect with us
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">Get in Touch</h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                            Have a question, feedback, or a special request? We're here to help you experience the best of Nigerian artisanal baking.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                        {/* Quick Contact Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-orange-200 transition-all">
                                <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <MessageCircle size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">WhatsApp Chat</h3>
                                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                    The quickest way to get an answer. Chat with us directly for orders or inquiries.
                                </p>
                                <WhatsAppButton
                                    phoneNumber={bizPhone}
                                    buttonText="Chat Now"
                                    className="w-full"
                                />
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-6">
                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Call Us</h3>
                                    <p className="text-slate-500 text-sm">{bizPhone}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Mon-Sat, 8am-6pm</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-6">
                                <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Email Us</h3>
                                    <p className="text-slate-500 text-sm">victoryailele14@gmail.com</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Response within 24h</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-6">
                                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Visit Us</h3>
                                    <p className="text-slate-500 text-sm">123 Baker Street, Victoria Island, Lagos</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Main Bakery & Pickup Point</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <ContactForm />
                        </div>
                    </div>

                    {/* Specialized Inquiry Section */}
                    <div className="bg-slate-900 rounded-[3rem] p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
                        <div className="relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
                            <div className="max-w-xl">
                                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Special Events & Partnerships</h2>
                                <p className="text-slate-400 text-lg font-medium">
                                    Planning a celebration or looking to stock our artisanal bakes in your cafe? We have dedicated services for catering and wholesale.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                <a
                                    href="/contact/catering"
                                    className="px-8 py-5 bg-white text-slate-900 rounded-2xl font-black text-center transition-all hover:bg-orange-500 hover:text-white"
                                >
                                    Catering Inquiry
                                </a>
                                <a
                                    href="/contact/bulk-order"
                                    className="px-8 py-5 bg-transparent text-white border-2 border-slate-800 rounded-2xl font-black text-center transition-all hover:border-white"
                                >
                                    Bulk & Wholesale
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
</div>
    );
}
