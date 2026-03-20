import Image from 'next/image';
import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Check, Star, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
    onViewDetails?: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Don't trigger onViewDetails
        addToCart(product, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const increment = (e: React.MouseEvent) => {
        e.stopPropagation();
        setQuantity(q => q + 1);
    };

    const decrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        setQuantity(q => Math.max(1, q - 1));
    };

    return (
        <div
            onClick={() => onViewDetails?.(product)}
            className="group bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-2 flex flex-col h-full cursor-pointer active:scale-[0.98]"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ShoppingCart size={48} strokeWidth={1} />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border border-orange-50">
                        {product.category}
                    </span>
                    {product.stock_quantity === 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                            Out of Stock
                        </span>
                    )}
                </div>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-4 bg-white rounded-full text-slate-900 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye size={20} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow gap-4">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                            {product.name}
                        </h3>
                        {product.average_rating !== undefined || product.rating !== undefined ? (
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star 
                                            key={s} 
                                            size={10} 
                                            className={cn(
                                                "transition-colors",
                                                (product.average_rating || product.rating || 0) >= s 
                                                    ? "fill-orange-400 text-orange-400" 
                                                    : "text-slate-200"
                                            )} 
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    {(product.average_rating || product.rating || 0).toFixed(1)} ({product.review_count || 0})
                                </span>
                            </div>
                        ) : (
                            <p className="text-[10px] font-bold text-slate-300 italic mt-1 uppercase tracking-tight">No reviews yet</p>
                        )}
                    </div>
                    <span className="text-xl font-black text-orange-500">
                        {formatCurrency(product.price)}
                    </span>
                </div>

                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed flex-grow">
                    {product.short_description || product.description}
                </p>

                {/* Actions */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-1 border border-slate-100">
                        <button
                            onClick={decrement}
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
                            aria-label="Decrease quantity"
                        >
                            <Minus size={18} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-slate-700">
                            {quantity}
                        </span>
                        <button
                            onClick={increment}
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
                            aria-label="Increase quantity"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded || product.stock_quantity === 0}
                        className={cn(
                            "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg",
                            isAdded
                                ? "bg-green-500 text-white shadow-green-100"
                                : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-100 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0"
                        )}
                    >
                        {isAdded ? (
                            <>
                                <Check size={20} />
                                <span>Added!</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={20} />
                                <span>{product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
