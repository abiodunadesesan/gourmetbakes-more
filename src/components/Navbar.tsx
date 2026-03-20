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

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b",
                isScrolled
                    ? "bg-white/90 backdrop-blur-md border-orange-100 py-3 shadow-sm"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-serif text-2xl font-bold tracking-tight group"
                    >
                        <span className="text-orange-500 group-hover:text-orange-600 transition-colors">Gourmet</span>
                        <span className="text-slate-900">Bakes</span>
                        <span className="text-yellow-600 text-lg ml-1">&amp; More</span>
                    </Link>

                    {/* Desktop Nav links */}
                    <div className="hidden md:flex items-center space-x-10">
                        <Link
                            href="#menu"
                            className="text-sm uppercase tracking-widest text-slate-600 hover:text-orange-500 transition-colors font-semibold"
                        >
                            Menu
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm uppercase tracking-widest text-slate-600 hover:text-orange-500 transition-colors font-semibold"
                        >
                            About
                        </Link>
                        <Link
                            href="/bulk-orders"
                            className="text-sm uppercase tracking-widest text-slate-600 hover:text-orange-500 transition-colors font-semibold"
                        >
                            Bulk Orders
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm uppercase tracking-widest text-slate-600 hover:text-orange-500 transition-colors font-semibold"
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-5">
                        <Link
                            href="https://wa.me/2348001234567"
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

            {/* Mobile Menu */}
            <div
                className={cn(
                    "md:hidden absolute top-full left-0 w-full bg-white border-b border-orange-100 overflow-hidden transition-all duration-300",
                    isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-4 py-6 space-y-4 flex flex-col items-center">
                    <Link
                        href="#menu"
                        className="text-sm font-bold uppercase tracking-widest text-slate-800"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Menu
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-bold uppercase tracking-widest text-slate-800"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About Us
                    </Link>
                    <Link
                        href="/bulk-orders"
                        className="text-sm font-bold uppercase tracking-widest text-slate-800"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Bulk Orders
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-bold uppercase tracking-widest text-slate-800"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Contact
                    </Link>
                    <Link
                        href="#menu"
                        className="w-full text-center rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        </nav>
    );
}
