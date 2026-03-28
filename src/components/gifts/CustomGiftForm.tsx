'use client';

import React, { useState } from 'react';
import { Calendar, Send, Sparkles } from 'lucide-react';
import { cn, textareaFitClasses } from '@/lib/utils';

export default function CustomGiftForm() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    
    // Form State
    const [formData, setFormData] = useState({
        recipient_name: '',
        occasion: '',
        budget_range: '',
        preferred_items: [] as string[],
        special_requests: '',
        delivery_date: '',
        sender_name: '',
        sender_email: '',
        sender_phone: ''
    });

    const itemsOptions = ['Cakes', 'Meat Pies', 'Fish Pies', 'Agege Bread', 'Snacks', 'Other'];

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 2);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        try {
            const res = await fetch('/api/gift-inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (res.ok) {
                setStatus('success');
                // Clear form
                setFormData({
                    recipient_name: '', occasion: '', budget_range: '', 
                    preferred_items: [], special_requests: '', 
                    delivery_date: '', sender_name: '', sender_email: '', sender_phone: ''
                });
            } else {
                setStatus('error');
                setErrorMessage(data.error || 'Failed to submit inquiry.');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Network error. Please try again.');
        }
    };

    const handleCheckbox = (item: string) => {
        setFormData(prev => ({
            ...prev,
            preferred_items: prev.preferred_items.includes(item) 
                ? prev.preferred_items.filter(i => i !== item)
                : [...prev.preferred_items, item]
        }));
    };

    if (status === 'success') {
        return (
            <div className="bg-green-50/80 border border-green-200 rounded-3xl p-10 text-center max-w-2xl mx-auto shadow-sm animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={32} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Thank you!</h3>
                <p className="text-lg text-slate-600 mb-8">
                    Your custom gift inquiry has been received. We'll contact you within 24 hours to confirm the details and arrangement for your perfect gift!
                </p>
                <button 
                    onClick={() => setStatus('idle')}
                    className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors shadow-md shadow-green-200"
                >
                    Submit Another Request
                </button>
            </div>
        );
    }

    return (
        <div id="custom-gift-form" className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden max-w-5xl mx-auto">
            <div className="bg-slate-900 p-8 sm:p-10 text-center relative overflow-hidden">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 font-serif relative z-10">Don't see what you're looking for?</h2>
                <p className="text-slate-300 text-lg sm:text-xl relative z-10">Tell us about your perfect gift, and we'll create it for you.</p>
                
                {/* Decorative background blob */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-10 lg:p-12">
                
                {status === 'error' && (
                    <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3">
                        <span className="font-bold">Error:</span> {errorMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                    
                    {/* Left Column */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6 uppercase tracking-wider text-sm">Recipient Details</h3>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Recipient Name *</label>
                            <input required type="text" value={formData.recipient_name} onChange={e => setFormData({...formData, recipient_name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g. Grandma Rose"/>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Occasion *</label>
                            <select required value={formData.occasion} onChange={e => setFormData({...formData, occasion: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                <option value="" disabled>Select occasion...</option>
                                <option value="Birthday">Birthday</option>
                                <option value="Anniversary">Anniversary</option>
                                <option value="Homecoming">Homecoming</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Budget Range *</label>
                            <select required value={formData.budget_range} onChange={e => setFormData({...formData, budget_range: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                <option value="" disabled>Select budget...</option>
                                <option value="₦2000-₦5000">₦2,000–₦5,000</option>
                                <option value="₦5000-₦10000">₦5,000–₦10,000</option>
                                <option value="₦10000+">₦10,000+</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6 uppercase tracking-wider text-sm">Sender Details</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Name *</label>
                                    <input required type="text" value={formData.sender_name} onChange={e => setFormData({...formData, sender_name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                                        <input required type="email" value={formData.sender_email} onChange={e => setFormData({...formData, sender_email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Phone Phone *</label>
                                        <input required type="tel" value={formData.sender_phone} onChange={e => setFormData({...formData, sender_phone: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6 uppercase tracking-wider text-sm">Gift Preferences</h3>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Preferred Items (Select any)</label>
                            <div className="grid grid-cols-2 gap-3">
                                {itemsOptions.map(item => (
                                    <label key={item} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-orange-50 hover:border-orange-200 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.preferred_items.includes(item)}
                                            onChange={() => handleCheckbox(item)}
                                            className="w-5 h-5 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                                        />
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                                <span>Special Requests</span>
                                <span className="text-slate-400 font-normal">{formData.special_requests.length}/500</span>
                            </label>
                            <textarea 
                                value={formData.special_requests} 
                                onChange={e => setFormData({...formData, special_requests: e.target.value})} 
                                maxLength={500} 
                                rows={4} 
                                className={cn(
                                    "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all min-h-[6rem]",
                                    textareaFitClasses
                                )}
                                placeholder="Any allergies? Preferred themes? Specific messages to include?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Date *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                                <input 
                                    required
                                    type="date" 
                                    min={minDate.toISOString().split('T')[0]}
                                    value={formData.delivery_date}
                                    onChange={e => setFormData({...formData, delivery_date: e.target.value})}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-700" 
                                />
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-end items-center">
                    <button 
                        type="button" 
                        onClick={() => setFormData({
                            recipient_name: '', occasion: '', budget_range: '', 
                            preferred_items: [], special_requests: '', 
                            delivery_date: '', sender_name: '', sender_email: '', sender_phone: ''
                        })}
                        className="w-full sm:w-auto px-6 py-3 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        Clear
                    </button>
                    <button 
                        type="submit" 
                        disabled={status === 'submitting'}
                        className="w-full sm:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-200 disabled:opacity-70"
                    >
                        {status === 'submitting' ? 'Submitting...' : <><Send size={18} /> Submit Request</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
