import Link from "next/link";
import { MessageCircle, Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";

function TikTokIcon({ size = 18 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="shrink-0"
            aria-hidden
        >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
}

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 sm:gap-4 group w-fit">
                            <img
                                src="/logo.png"
                                alt=""
                                className="h-16 sm:h-20 w-auto object-contain shrink-0 group-hover:opacity-90 transition-opacity"
                            />
                            <div className="flex flex-col leading-none text-left">
                                <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-white">
                                    GOURMET
                                </span>
                                <span className="text-xs sm:text-sm font-semibold tracking-[0.14em] text-slate-400 mt-1">
                                    BAKES &amp; MORE
                                </span>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-base leading-relaxed max-w-xs">
                            Bringing the authentic taste of Nigeria to your table. Freshly baked, culturally inspired, and delivered with love.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.instagram.com/veejb_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 transition-all text-white"
                                aria-label="Gourmet Bakes on Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="https://www.facebook.com/oriakhi.victory"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 transition-all text-white"
                                aria-label="Gourmet Bakes on Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="https://www.tiktok.com/@big_veejb?is_from_webapp=1&sender_device=pc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 transition-all text-white"
                                aria-label="Gourmet Bakes on TikTok"
                            >
                                <TikTokIcon size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Explore</h4>
                        <ul className="space-y-4">
                            <li><Link href="/#menu" className="text-slate-400 hover:text-orange-500 transition-colors">View Menu</Link></li>
                            <li><Link href="/about" className="text-slate-400 hover:text-orange-500 transition-colors">Our Story</Link></li>
                            <li><Link href="/menu" className="text-slate-400 hover:text-orange-500 transition-colors">All Products</Link></li>
                            <li><Link href="/bulk-orders" className="text-slate-400 hover:text-orange-500 transition-colors">Bulk Orders & Wholesale</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Customer Care</h4>
                        <ul className="space-y-4">
                            <li><Link href="/shipping-policy" className="text-slate-400 hover:text-orange-500 transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/refunds-returns" className="text-slate-400 hover:text-orange-500 transition-colors">Refunds & Returns</Link></li>
                            <li><Link href="/track-order" className="text-slate-400 hover:text-orange-500 transition-colors">Order Tracking</Link></li>
                            <li><Link href="/faq" className="text-slate-400 hover:text-orange-500 transition-colors">FAQs</Link></li>
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
                                <span>+90 533 858 5872</span>
                            </li>
                            <li className="flex gap-3 text-slate-400">
                                <Mail size={20} className="text-orange-500 shrink-0" />
                                <a href="mailto:victoryailele14@gmail.com" className="hover:text-orange-500 transition-colors">victoryailele14@gmail.com</a>
                            </li>
                            <li className="pt-2">
                                <Link
                                    href="https://wa.me/905338585872"
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
                    <p>&copy; {new Date().getFullYear()} Gourmet Bakes &amp; More. Proudly Nigerian.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
