'use client';

import { useState, useEffect } from 'react';
import { PieChart, Users, Calendar, MapPin, ClipboardList, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn, textareaFitClasses } from '@/lib/utils';
import { Product } from '@/types';

export default function CateringForm() {
    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState({
        eventName: '',
        eventDate: '',
        guestCount: '',
        eventType: '',
        selectedProducts: [] as string[],
        dietaryRequirements: '',
        specialRequests: '',
        name: '',
        phone: '',
        email: '',
        deliveryAddress: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingProducts, setFetchingProducts] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products?limit=100');
                const data = await res.json();
                setProducts(data.products || []);
            } catch (err) {
                console.error('Failed to fetch products');
            } finally {
                setFetchingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    const toggleProduct = (productName: string) => {
        const current = formData.selectedProducts;
        if (current.includes(productName)) {
            setFormData({ ...formData, selectedProducts: current.filter(p => p !== productName) });
        } else {
            setFormData({ ...formData, selectedProducts: [...current, productName] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.selectedProducts.length === 0) {
            setError('Please select at least one product for your catering.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/catering/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    products: formData.selectedProducts
                })
            });

            if (res.ok) {
                setSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const data = await res.json();
                setError(data.error || 'Submission failed. Please try again.');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-slate-100 text-center space-y-6">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-4xl font-serif font-bold text-slate-900">Inquiry Received!</h2>
                <p className="text-slate-500 max-w-md mx-auto text-lg">
                    Thank you for considering GourmetBakes for your event. We've received your request for <strong>{formData.eventName}</strong> and our team will get back to you with a custom quote via WhatsApp or email.
                </p>
                <button 
                    onClick={() => window.location.href = '/'}
                    className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {/* Event Details Section */}
            <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                        <Calendar size={24} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900">Event Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Event Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Wedding Reception"
                            value={formData.eventName}
                            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 outline-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Event Date *</label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.eventDate}
                            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 outline-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Guest Count *</label>
                        <input
                            type="number"
                            required
                            min="10"
                            placeholder="Min 10 guests"
                            value={formData.guestCount}
                            onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 outline-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Event Type *</label>
                        <select
                            required
                            value={formData.eventType}
                            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 outline-none font-bold bg-white"
                        >
                            <option value="">Select event type</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Corporate">Corporate Event</option>
                            <option value="Birthday">Birthday Party</option>
                            <option value="Religious">Religious Gathering</option>
                            <option value="Other">Other Celebration</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Menu Selection Section */}
            <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500">
                        <PieChart size={24} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900">Requested Items</h2>
                </div>

                <p className="text-slate-500 mb-6 font-medium">Select the products you're interested in for your event:</p>

                {fetchingProducts ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin text-slate-300" size={32} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {products.map(product => (
                            <button
                                key={product.product_id}
                                type="button"
                                onClick={() => toggleProduct(product.name)}
                                className={cn(
                                    "p-4 rounded-2xl border-2 transition-all text-left",
                                    formData.selectedProducts.includes(product.name)
                                        ? "border-orange-500 bg-orange-50 text-orange-900 ring-4 ring-orange-50"
                                        : "border-slate-50 bg-slate-50/50 text-slate-600 hover:border-slate-200"
                                )}
                            >
                                <span className="block font-bold text-sm leading-tight">{product.name}</span>
                                <span className="text-[10px] uppercase font-black opacity-50">{product.category}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-8 grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Dietary Requirements</label>
                        <input
                            type="text"
                            placeholder="e.g. Nut-free, Vegetarian, No pork"
                            value={formData.dietaryRequirements}
                            onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 outline-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Special Requests / Notes</label>
                        <textarea
                            rows={3}
                            placeholder="Any additional information we should know?"
                            value={formData.specialRequests}
                            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                            className={cn(
                                "w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 outline-none font-medium min-h-[5.5rem]",
                                textareaFitClasses
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                        <Users size={24} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 outline-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number *</label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 outline-none font-bold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address *</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 outline-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Event/Delivery Address *</label>
                        <textarea
                            required
                            rows={2}
                            value={formData.deliveryAddress}
                            onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                            className={cn(
                                "w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 outline-none font-medium min-h-[4.5rem]",
                                textareaFitClasses
                            )}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-6 bg-red-50 text-red-600 rounded-2xl flex items-center gap-4 font-bold">
                    <AlertCircle size={24} />
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl shadow-slate-100 hover:bg-orange-500 transition-all active:scale-[0.98] disabled:grayscale flex items-center justify-center gap-3"
            >
                {loading ? (
                    <>
                        <Loader2 size={24} className="animate-spin" />
                        <span>Sending Request...</span>
                    </>
                ) : (
                    <>
                        <ClipboardList size={24} />
                        <span>Submit Catering Inquiry</span>
                    </>
                )}
            </button>
        </form>
    );
}
