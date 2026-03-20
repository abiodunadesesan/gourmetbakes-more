'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export default function ShoppingCart() {
    const { cart, removeFromCart, updateQuantity, subtotal, deliveryFee, totalPrice } = useCart();

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="bg-orange-50 p-6 rounded-full mb-6">
                    <ShoppingBag size={48} className="text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Your cart is empty</h2>
                <p className="text-slate-500 mb-8 max-w-md">
                    Browse our menu of freshly baked Nigerian treats and add them to your cart to get started.
                </p>
                <Link
                    href="/menu"
                    className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-100 flex items-center gap-2"
                >
                    <ArrowLeft size={20} />
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center group hover:shadow-xl hover:shadow-slate-100 transition-all"
                    >
                        {/* Product Image */}
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                            {item.image_url ? (
                                <Image
                                    src={item.image_url}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ShoppingBag size={32} />
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex-grow flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                {item.name}
                            </h3>
                            <p className="text-orange-500 font-bold text-sm">
                                {formatCurrency(item.price)}
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                {/* Quantity Selector */}
                                <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                                    <button
                                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center text-sm font-bold text-slate-700">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.product_id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                    aria-label="Remove item"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right sm:pl-4 sm:border-l border-slate-100 min-w-[120px]">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Subtotal</p>
                            <p className="text-xl font-black text-slate-900">
                                {formatCurrency(item.price * item.quantity)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-6 sm:p-8 sticky top-24">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 font-serif">Order Summary</h3>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-bold">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Delivery Fee</span>
                            <span className="font-bold">{formatCurrency(deliveryFee)}</span>
                        </div>
                        <div className="h-px bg-orange-100 my-4" />
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-900">Total</span>
                            <span className="text-2xl font-black text-orange-600">
                                {formatCurrency(totalPrice)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/checkout"
                            className="block w-full text-center bg-orange-500 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 hover:-translate-y-1 active:scale-95"
                        >
                            Proceed to Checkout
                        </Link>
                        <Link
                            href="/menu"
                            className="block w-full text-center text-orange-600 font-bold hover:text-orange-700 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>

                    <div className="mt-8 p-4 bg-white border border-orange-100 rounded-2xl">
                        <p className="text-xs text-slate-500 leading-relaxed">
                            <span className="font-bold text-orange-500">Note:</span> We currently only accept Cash on Delivery. Pay at your doorstep!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
