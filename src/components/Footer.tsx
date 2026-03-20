import Link from "next/link";
import { MessageCircle, Instagram, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="font-serif text-2xl font-bold tracking-tight inline-block">
                            <span className="text-orange-500">Gourmet</span>
                            <span className="text-white">Bakes</span>
                            <span className="text-yellow-500 text-lg ml-1">&amp; More</span>
                        </Link>
                        <p className="text-slate-400 text-base leading-relaxed max-w-xs">
                            Bringing the authentic taste of Nigeria to your table. Freshly baked, culturally inspired, and delivered with love.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 transition-all">
                                <Instagram size={18} />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 transition-all">
                                <Facebook size={18} />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 transition-all">
                                <Twitter size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Explore</h4>
                        <ul className="space-y-4">
                            <li><Link href="#menu" className="text-slate-400 hover:text-orange-500 transition-colors">View Menu</Link></li>
                            <li><Link href="/about" className="text-slate-400 hover:text-orange-500 transition-colors">Our Story</Link></li>
                            <li><Link href="/products" className="text-slate-400 hover:text-orange-500 transition-colors">All Products</Link></li>
                            <li><Link href="/bulk-orders" className="text-slate-400 hover:text-orange-500 transition-colors">Bulk Orders & Wholesale</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Customer Care</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-slate-400 hover:text-orange-500 transition-colors">Shipping Policy</Link></li>
                            <li><Link href="#" className="text-slate-400 hover:text-orange-500 transition-colors">Refunds & Returns</Link></li>
                            <li><Link href="#" className="text-slate-400 hover:text-orange-500 transition-colors">Order Tracking</Link></li>
                            <li><Link href="#" className="text-slate-400 hover:text-orange-500 transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Get in Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-slate-400">
                                <MapPin size={20} className="text-orange-500 shrink-0" />
                                <span>Lagos, Nigeria</span>
                            </li>
                            <li className="flex gap-3 text-slate-400">
                                <Phone size={20} className="text-orange-500 shrink-0" />
                                <span>+234 800 123 4567</span>
                            </li>
                            <li className="flex gap-3 text-slate-400">
                                <Mail size={20} className="text-orange-500 shrink-0" />
                                <a href="mailto:hello@gourmetbakes.ng" className="hover:text-orange-500 transition-colors">hello@gourmetbakes.ng</a>
                            </li>
                            <li className="pt-2">
                                <Link
                                    href="https://wa.me/2348001234567"
                                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                                >
                                    <MessageCircle size={18} />
                                    <span>WhatsApp Us</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} GourmetBakes &amp; More. Proudly Nigerian.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
