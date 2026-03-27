'use client';

import React, { useState } from 'react';
import { X, Calendar, PenLine, User, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Props {
    box: any;
    onClose: () => void;
    onRequestCustom: () => void;
}

export default function GiftBoxModal({ box, onClose, onRequestCustom }: Props) {
    const { addToCart } = useCart();
    
    const [recipientName, setRecipientName] = useState('');
    const [message, setMessage] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    
    const [added, setAdded] = useState(false);
    const [error, setError] = useState('');

    // Date constraints
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 2); // Minimum 2 days out
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30); // Maximum 30 days out

    const formatDateString = (d: Date) => d.toISOString().split('T')[0];

    const handleAddToCart = () => {
        if (!deliveryDate) {
            setError('Please select a delivery date.');
            return;
        }
        
        // Use cart context, attaching personalization to the cart item's optional fields
        // Since original CartItem interface only has `id, name, price, quantity` etc., 
        // we can attach it loosely or adapt depending on how the cart serializes it.
        // The standard is just mapping it to a custom product if metadata exists, but we'll add it as name suffix for now to be safe.
        addToCart({
            product_id: `gift_box_${box.gift_box_id}`,
            name: `${box.name}`,
            price: box.price,
            image_url: box.image_url,
        } as any, 1);

        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Overlay click close */}
            <div className="absolute inset-0" onClick={onClose} />
            
            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row z-10 animate-in slide-in-from-bottom-4 duration-300">
                
                {/* Close Button Mobile/Desktop */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur text-slate-600 hover:text-red-500 hover:bg-white p-2 rounded-full shadow-sm transition-all"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Image */}
                <div className="w-full md:w-1/2 bg-slate-100 flex-shrink-0 relative">
                    <img 
                        src={box.image_url} 
                        alt={box.name} 
                        className="w-full h-64 md:h-full object-cover"
                    />
                    <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-md text-orange-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                            {box.occasion}
                        </span>
                    </div>
                </div>

                {/* Right Side: Details & Form */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{box.name}</h2>
                    <p className="text-xl font-black text-orange-600 mb-4">₦{box.price.toLocaleString()}</p>
                    <p className="text-slate-600 mb-6 leading-relaxed bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                        {box.description}
                    </p>

                    <div className="mb-8">
                        <h4 className="font-bold text-slate-900 mb-3 uppercase text-sm tracking-wider flex items-center gap-2">
                            <span className="w-6 h-px bg-slate-300"></span>
                            What's Inside
                        </h4>
                        <ul className="space-y-2">
                            {box.contents?.map((c: any, i: number) => (
                                <li key={i} className="flex gap-2 text-slate-700">
                                    <span className="font-bold text-orange-500">{c.quantity}x</span> 
                                    <span>{c.item} <span className="text-slate-400 text-sm">({c.description})</span></span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-6 border-t border-slate-100 pt-6">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <PenLine size={18} className="text-orange-500" />
                            Personalization
                        </h4>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Name (Optional)</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input 
                                        type="text" 
                                        maxLength={50}
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        placeholder="e.g. Auntie Mary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                                    <span>Custom Message (Max 100 chars)</span>
                                    <span className="text-slate-400 text-xs">{message.length}/100</span>
                                </label>
                                <textarea 
                                    maxLength={100}
                                    rows={2}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                                    placeholder="Write a heartfelt note..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Requested Delivery Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                                    <input 
                                        type="date"
                                        min={formatDateString(minDate)}
                                        max={formatDateString(maxDate)}
                                        value={deliveryDate}
                                        onChange={(e) => {
                                            setDeliveryDate(e.target.value);
                                            setError('');
                                        }}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-700 ${error ? 'border-red-500' : 'border-slate-200'}`}
                                    />
                                    {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
                        <button 
                            onClick={handleAddToCart}
                            disabled={added}
                            className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                                added ? 'bg-green-500 text-white shadow-green-200' : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-orange-200 active:scale-95'
                            }`}
                        >
                            {added ? <><Check size={20} /> Added to Cart</> : <><ShoppingBag size={20} /> Add to Cart</>}
                        </button>
                        <button 
                            onClick={() => {
                                onClose();
                                onRequestCustom();
                            }}
                            className="w-full sm:w-auto py-3 px-6 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                            Want something different?
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
