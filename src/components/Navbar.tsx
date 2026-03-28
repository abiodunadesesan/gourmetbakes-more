'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, MessageCircle, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const { totalItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!isMenuOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isMenuOpen]);

    return (
        <nav
            className={cn(
                "fixed top-0 w-full transition-all duration-500 border-b",
                isMenuOpen ? "z-[100]" : "z-50",
                isMenuOpen
                    ? "bg-white border-slate-200 py-3 shadow-lg shadow-slate-900/10"
                    : isScrolled
                      ? "bg-white/95 backdrop-blur-md border-slate-200 py-3 shadow-lg shadow-slate-900/5"
                      : "bg-white/20 backdrop-blur-sm border-white/20 py-4"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                        <div className="relative shrink-0">
                            <div className="absolute -inset-1 bg-orange-500/10 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300" />
                            <img
                                src="/logo.png"
                                alt=""
                                className="relative h-12 sm:h-14 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="hidden min-[400px]:flex flex-col leading-none text-left">
                            <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-slate-900">
                                GOURMET
                            </span>
                            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.14em] text-slate-800 mt-0.5">
                                BAKES &amp; MORE
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {[
                            { href: '/menu', label: 'Menu' },
                            { href: '/about', label: 'About' },
                            { href: '/bulk-orders', label: 'Bulk Orders' },
                            { href: '/recipes', label: 'Recipes' },
                            { href: '/gifts', label: 'Gifting', badge: 'New' },
                            { href: '/contact', label: 'Contact' },
                        ].map(({ href, label, badge }) => (
                            <Link
                                key={href}
                                href={href}
                                className="relative text-sm font-semibold text-slate-800 hover:text-orange-500 transition-colors tracking-wide flex items-center gap-1.5 group"
                            >
                                {label}
                                {badge && (
                                    <span className="bg-orange-500 text-white text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full">{badge}</span>
                                )}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300 rounded-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-5">
                        <Link
                            href="https://wa.me/905338585872"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-green-600 transition-colors bg-slate-100 p-2 rounded-full hidden sm:block"
                            title="Chat on WhatsApp"
                        >
                            <MessageCircle size={20} />
                        </Link>

                        <Link
                            href="/cart"
                            className="relative text-slate-600 hover:text-orange-500 transition-colors bg-slate-100 p-2 rounded-full"
                        >
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in-50 duration-300">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-slate-900 p-1"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <Link
                            href="#menu"
                            className="hidden md:block rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-300 active:scale-95"
                        >
                            Order Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile: full-height solid sheet + dimmer — avoids see-through over cart/pages */}
            {isMenuOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close menu"
                        className="md:hidden fixed left-0 right-0 bottom-0 top-[5.25rem] z-[60] bg-slate-900/40"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div
                        className="md:hidden fixed left-0 right-0 bottom-0 top-[5.25rem] z-[70] flex min-h-0 flex-col overflow-y-auto bg-white shadow-[0_12px_40px_-4px_rgba(15,23,42,0.18)] border-t border-slate-100"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Main menu"
                    >
                        <div className="px-4 py-6 pb-10 space-y-4 flex flex-col items-center">
                            <Link
                                href="#menu"
                                className="text-sm font-bold uppercase tracking-widest text-slate-800 py-1"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Menu
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm font-bold uppercase tracking-widest text-slate-800 py-1"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About Us
                            </Link>
                            <Link
                                href="/bulk-orders"
                                className="text-sm font-bold uppercase tracking-widest text-slate-800 py-1"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Bulk Orders
                            </Link>
                            <Link
                                href="/recipes"
                                className="text-sm font-bold uppercase tracking-widest text-slate-800 py-1"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Recipes
                            </Link>
                            <Link
                                href="/gifts"
                                className="text-sm font-bold uppercase tracking-widest text-slate-800 flex items-center gap-2 py-1"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Gifting
                                <span className="bg-orange-100 text-orange-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">New</span>
                            </Link>
                            <Link
                                href="/contact"
                                className="text-sm font-bold uppercase tracking-widest text-slate-800 py-1"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            <Link
                                href="#menu"
                                className="w-full max-w-xs text-center rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md mt-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}
