'use client';

import { useState } from 'react';
import { Truck, Loader2, Building2, Package, User, Clock, CreditCard, AlertCircle } from 'lucide-react';
import ProductPicker from './ProductPicker';
import BulkOrderConfirmation from './BulkOrderConfirmation';
import BulkOrderError from './BulkOrderError';
import { cn, textareaFitClasses } from '@/lib/utils';

export default function BulkOrderForm() {
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        custom_products_description: '',
        delivery_address: '',
        preferred_delivery_date: '',
        delivery_time_window: '',
        delivery_instructions: '',
        purpose: '',
        estimated_budget: '',
        payment_terms: '',
        full_name: '',
        email: '',
        phone: '',
        whatsapp_number: '',
        company_name: '',
        additional_notes: ''
    });

    const totalUnits = selectedProducts.reduce((acc, p) => acc + p.quantity, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (selectedProducts.length === 0 && !formData.custom_products_description) {
            setErrorMessage('Please select at least one product or describe your needs.');
            setStatus('error');
            return;
        }

        if (totalUnits > 0 && totalUnits < 50) {
            setErrorMessage('Minimum order for bulk pricing is 50 units.');
            setStatus('error');
            return;
        }

        const leadTimeDate = new Date();
        leadTimeDate.setDate(leadTimeDate.getDate() + 3);
        if (new Date(formData.preferred_delivery_date) < leadTimeDate) {
            setErrorMessage('Preferred delivery date must be at least 3 days from today.');
            setStatus('error');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('/api/bulk-order/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    products: selectedProducts,
                    total_units: totalUnits || 50 // Default to 50 if only free text 
                })
            });

            const result = await response.json();
            if (result.success) {
                setStatus('success');
            } else {
                setErrorMessage(result.error || 'Submission failed');
                setStatus('error');
            }
        } catch (err) {
            setErrorMessage('A network error occurred. Please try again.');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return <BulkOrderConfirmation orderData={{ ...formData, total_units: totalUnits }} />;
    }

    if (status === 'error' && errorMessage && !errorMessage.includes('Minimum') && !errorMessage.includes('select at least')) {
        return <BulkOrderError error={errorMessage} onRetry={() => setStatus('idle')} />;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-12">
            {/* Section 1: Product Selection */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold">
                        <Package size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900">What products do you need?</h2>
                        <p className="text-sm text-slate-400 font-bold">Minimum order 50 units total</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <ProductPicker onProductsChange={setSelectedProducts} />
                    
                    <div className="relative pt-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-xs font-black uppercase tracking-widest text-slate-300">Or Describe Your Needs</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <textarea
                            placeholder="E.g., 100 meat pies with custom filling, 50 agege bread loaves, custom packaging for corporate event"
                            maxLength={300}
                            value={formData.custom_products_description}
                            onChange={(e) => setFormData({ ...formData, custom_products_description: e.target.value })}
                            className={cn(
                                "w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 outline-none font-medium min-h-[8rem] transition-all",
                                textareaFitClasses
                            )}
                        />
                        <div className="flex justify-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                {formData.custom_products_description.length}/300
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Delivery Details */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                        <Truck size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900">Delivery Details</h2>
                        <p className="text-sm text-slate-400 font-bold">Where and when do you need it?</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Delivery Address *</label>
                        <input
                            type="text"
                            required
                            placeholder="Full address including street, area, city"
                            value={formData.delivery_address}
                            onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-blue-500 outline-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Preferred Delivery Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.preferred_delivery_date}
                            onChange={(e) => setFormData({ ...formData, preferred_delivery_date: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-blue-500 outline-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Time Window *</label>
                        <select
                            required
                            value={formData.delivery_time_window}
                            onChange={(e) => setFormData({ ...formData, delivery_time_window: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-blue-500 outline-none font-bold bg-white"
                        >
                            <option value="">Select time window</option>
                            <option value="Morning (8am-12pm)">Morning (8am-12pm)</option>
                            <option value="Afternoon (12pm-4pm)">Afternoon (12pm-4pm)</option>
                            <option value="Evening (4pm-8pm)">Evening (4pm-8pm)</option>
                            <option value="Flexible">Flexible</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Special Delivery Instructions</label>
                        <textarea
                            placeholder="E.g., deliver to back entrance, contact me 1 hour before arrival"
                            value={formData.delivery_instructions}
                            onChange={(e) => setFormData({ ...formData, delivery_instructions: e.target.value })}
                            className={cn(
                                "w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-blue-500 outline-none font-medium min-h-[6rem]",
                                textareaFitClasses
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Section 3: Business Context */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-bold">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900">Tell us about your order</h2>
                        <p className="text-sm text-slate-400 font-bold">Help us tailor our service to your needs</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Purpose *</label>
                        <select
                            required
                            value={formData.purpose}
                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-purple-500 outline-none font-bold bg-white"
                        >
                            <option value="">Select purpose</option>
                            <option value="Corporate Event">Corporate Event</option>
                            <option value="Wedding/Celebration">Wedding/Celebration</option>
                            <option value="Resale/Wholesale">Resale/Wholesale</option>
                            <option value="Catering Business">Catering Business</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Estimated Budget</label>
                        <input
                            type="text"
                            placeholder="E.g., ₦500,000"
                            value={formData.estimated_budget}
                            onChange={(e) => setFormData({ ...formData, estimated_budget: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-purple-500 outline-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Preferred Payment Terms *</label>
                        <select
                            required
                            value={formData.payment_terms}
                            onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-purple-500 outline-none font-bold bg-white"
                        >
                            <option value="">Select payment terms</option>
                            <option value="Cash on Delivery">Cash on Delivery</option>
                            <option value="Bank Transfer (50% deposit)">Bank Transfer (50% deposit)</option>
                            <option value="Bank Transfer (Full payment)">Bank Transfer (Full payment)</option>
                            <option value="Flexible/Discuss">Flexible/Discuss</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Total Units Expected *</label>
                        <input
                            type="number"
                            required
                            min={50}
                            placeholder="Min 50"
                            value={totalUnits || ""}
                            readOnly
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 outline-none font-bold bg-slate-50 text-slate-400 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {/* Section 4: Contact Information */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center font-bold">
                        <User size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900">How can we reach you?</h2>
                        <p className="text-sm text-slate-400 font-bold">Your contact details</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-green-500 outline-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address *</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-green-500 outline-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number *</label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-green-500 outline-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Company Name</label>
                        <input
                            type="text"
                            placeholder="Optional"
                            value={formData.company_name}
                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-green-500 outline-none font-bold"
                        />
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {status === 'error' && errorMessage && (
                <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 font-bold flex items-center gap-4 animate-in shake duration-500">
                    <AlertCircle size={24} />
                    {errorMessage}
                </div>
            )}

            {/* Submit Button */}
            <div className="sticky bottom-8 z-10 w-full flex justify-center">
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full max-w-lg px-12 py-6 bg-orange-500 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-orange-200 hover:bg-orange-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:grayscale disabled:pointer-events-none"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="animate-spin" size={24} />
                            <span>Processing Request...</span>
                        </>
                    ) : (
                        <>
                            <span>Submit Bulk Order Request</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
