"use client";

import { useState, useEffect } from "react";
import { X, ShoppingBag, Star, Plus, Minus, ShieldCheck, Truck, UtensilsCrossed, Share2, Check } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import ReviewForm from "../ReviewForm";
import ReviewList from "../ReviewList";

interface ProductDetailModalProps {
    product: Product | null;
    onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState("");
    const [added, setAdded] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { addToCart } = useCart();

    useEffect(() => {
        if (product) {
            setMainImage(product.image_url || "");
            setQuantity(1);
            setAdded(false);
            // Lock body scroll
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [product]);

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const gallery = [product.image_url, ...(product.image_gallery || [])].filter(Boolean);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-all animate-in fade-in duration-300">
            {/* Close on Backdrop */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 transition-all hover:scale-110 active:scale-95"
                >
                    <X size={20} />
                </button>

                {/* Left: Image Gallery */}
                <div className="w-full md:w-1/2 bg-slate-50 relative flex flex-col">
                    <div className="flex-1 relative aspect-square md:aspect-auto overflow-hidden">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover transition-all duration-500"
                        />
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-orange-600 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm border border-orange-100">
                                {product.category}
                            </span>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    {gallery.length > 1 && (
                        <div className="p-4 flex gap-3 overflow-x-auto no-scrollbar bg-white border-t border-slate-100">
                            {gallery.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setMainImage(img!)}
                                    className={cn(
                                        "w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all border-2",
                                        mainImage === img
                                            ? "border-orange-500 ring-2 ring-orange-100 scale-95"
                                            : "border-transparent hover:border-orange-200"
                                    )}
                                >
                                    <img src={img!} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Info */}
                <div className="w-full md:w-1/2 p-6 sm:p-10 overflow-y-auto no-scrollbar bg-white flex flex-col">
                    <div className="flex-1 space-y-8">
                        {/* Header */}
                        <div className="space-y-4">
                            <button 
                                onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="flex items-center gap-2 text-yellow-500 hover:opacity-80 transition-opacity"
                            >
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star 
                                            key={s} 
                                            size={16} 
                                            className={cn(
                                                "transition-colors",
                                                (product.average_rating || product.rating || 0) >= s 
                                                    ? "fill-orange-400 text-orange-400" 
                                                    : "text-slate-200"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                    {(product.average_rating || product.rating || 0).toFixed(1)} ({product.review_count || 0})
                                </span>
                            </button>
                            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">{product.name}</h2>
                            <p className="text-3xl font-bold text-orange-600">{formatCurrency(product.price)}</p>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">About this delicacy</h4>
                            <p className="text-slate-600 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100">
                            {product.ingredients && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-900">
                                        <UtensilsCrossed size={16} className="text-orange-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Ingredients</span>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-6 leading-relaxed">{product.ingredients}</p>
                                </div>
                            )}
                            {product.shelf_life && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-900">
                                        <ShieldCheck size={16} className="text-orange-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Shelf Life</span>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-6 leading-relaxed">{product.shelf_life}</p>
                                </div>
                            )}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-slate-900">
                                    <Truck size={16} className="text-orange-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Availability</span>
                                </div>
                                <p className={cn(
                                    "text-xs pl-6 font-bold",
                                    product.stock_quantity > 0 ? "text-green-600" : "text-red-500"
                                )}>
                                    {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                                </p>
                            </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center bg-slate-100 rounded-2xl p-1 w-full sm:w-auto">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock_quantity === 0 || added}
                                    className={cn(
                                        "flex-1 w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl",
                                        added
                                            ? "bg-green-500 text-white shadow-green-100"
                                            : "bg-orange-500 text-white shadow-orange-100 hover:bg-orange-600 hover:-translate-y-1 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0"
                                    )}
                                >
                                    {added ? <Check size={20} /> : <ShoppingBag size={20} />}
                                    <span>{added ? "Added to Cart" : product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}</span>
                                </button>
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">
                                <Share2 size={16} />
                                Share this delicacy
                            </button>
                        </div>

                        {/* Reviews Section */}
                        <div id="reviews-section" className="pt-12 border-t border-slate-100 space-y-12">
                            <div className="space-y-12">
                                <ReviewForm 
                                    productId={product.product_id} 
                                    onSuccess={() => setRefreshTrigger(prev => prev + 1)} 
                                />
                                <ReviewList 
                                    productId={product.product_id} 
                                    refreshTrigger={refreshTrigger} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
