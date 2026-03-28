'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import FormField from './FormField';
import { ShoppingBag, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import Image from 'next/image';

interface FormData {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    notes: string;
}

interface FormErrors {
    [key: string]: string;
}

export default function CheckoutForm() {
    const router = useRouter();
    const { cart, subtotal, deliveryFee, totalPrice, clearCart } = useCart();
    
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        notes: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSummaryMobile, setShowSummaryMobile] = useState(false);

    // Pre-fill phone if logged in
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await (await import('@/lib/supabase')).supabase.auth.getUser();
            if (user?.phone) {
                setFormData(prev => ({ ...prev, phone: user.phone || '' }));
            }
        };
        fetchUser();
    }, []);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full Name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Name must be at least 2 characters';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone Number is required';
        } else {
            // Simple Nigerian phone validation: +234 or 0 followed by digits, 10-14 total length
            const phoneRegex = /^(?:\+234|0)[7-9][01]\d{8}$/;
            const strippedPhone = formData.phone.replace(/\s/g, '');
            if (!phoneRegex.test(strippedPhone)) {
                newErrors.phone = 'Phone number must be valid Nigerian format';
            }
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Street Address is required';
        } else if (formData.address.trim().length < 5) {
            newErrors.address = 'Address must be at least 5 characters';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City/Area is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        
        try {
            // 0. Validate Cart Items Stock
            const validateRes = await fetch('/api/cart/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity
                    }))
                }),
            });

            const validateData = await validateRes.json().catch(() => ({}));

            if (!validateRes.ok) {
                alert(
                    validateData?.error
                        ? `We could not verify your cart: ${validateData.error}`
                        : 'We could not verify your cart. Please try again in a moment.'
                );
                setIsSubmitting(false);
                return;
            }

            if (!validateData.valid) {
                const unavailable = Array.isArray(validateData.unavailable_items)
                    ? validateData.unavailable_items
                    : [];
                const message =
                    unavailable.length > 0
                        ? unavailable.map((item: { name: string; reason: string }) => `${item.name}: ${item.reason}`).join('\n')
                        : 'One or more items are no longer available.';
                alert(`Some items in your cart are no longer available:\n\n${message}`);
                setIsSubmitting(false);
                return;
            }

            // 1. Create Order via API
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        unit_price: item.price
                    })),
                    customer_info: {
                        name: formData.fullName,
                        phone: formData.phone,
                        email: formData.email,
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        notes: formData.notes
                    },
                    subtotal,
                    deliveryFee,
                    totalAmount: totalPrice
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const order = await response.json();

            // 2. Send WhatsApp (Async - don't wait for response)
            fetch('/api/whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: order.order_id }),
            }).catch(err => console.error('WhatsApp failed', err));

            // 3. Clear cart and redirect
            clearCart();
            router.push(`/checkout/confirmation?order_id=${order.order_id}`);
        } catch (err) {
            console.error(err);
            alert('Unable to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Section: Delivery Info */}
            <div className="lg:col-span-3 space-y-8">
                {/* Mobile: Collapsible Summary */}
                <div className="lg:hidden">
                    <button
                        type="button"
                        onClick={() => setShowSummaryMobile(!showSummaryMobile)}
                        className="w-full flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-2xl text-orange-900 font-bold"
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingBag size={20} />
                            <span>{showSummaryMobile ? 'Hide' : 'Show'} Order Summary</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>{formatCurrency(totalPrice)}</span>
                            {showSummaryMobile ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </button>
                    
                    {showSummaryMobile && (
                        <div className="mt-4 p-4 border border-orange-100 rounded-2xl space-y-4 bg-white shadow-sm">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="relative w-12 h-12 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0">
                                        {item.image_url ? (
                                            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center p-2"><ShoppingBag size={16} /></div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Delivery Information Section */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 font-serif flex items-center gap-2">
                        <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                        Delivery Information
                    </h2>
                    
                    <div className="space-y-6">
                        <FormField
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                            placeholder="Enter your full name"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                placeholder="+234 XXX XXX XXXX"
                                required
                            />
                            <FormField
                                label="Email Address (Optional)"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="your@email.com"
                            />
                        </div>

                        <FormField
                            label="Street Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            error={errors.address}
                            placeholder="123 Main Street"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="City / Area"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={errors.city}
                                placeholder="Lagos"
                                required
                            />
                            <FormField
                                label="Postal Code (Optional)"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                placeholder="100001"
                            />
                        </div>

                        <FormField
                            label="Delivery Instructions (Optional)"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            isTextArea
                            placeholder="E.g., gate code, apartment number, preferred delivery time"
                        />
                    </div>
                </div>

                {/* Payment Method Section */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 font-serif flex items-center gap-2">
                        <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                        Payment Method
                    </h2>
                    
                    <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <input
                                    type="radio"
                                    checked
                                    readOnly
                                    className="w-5 h-5 accent-orange-500"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Cash on Delivery</p>
                                <p className="text-sm text-slate-600 mt-1">
                                    Pay securely at your doorstep when your order arrives. No online payment required.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Order Total & Summary */}
            <div className="lg:col-span-2">
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 sticky top-24 shadow-2xl overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-10 rounded-full blur-3xl -mr-10 -mt-10" />
                    
                    <h2 className="text-xl font-bold mb-6 font-serif">Order Summary</h2>
                    
                    <div className="space-y-4 mb-8">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-slate-300 text-sm">
                                <span className="line-clamp-1 mr-4">{item.name} x {item.quantity}</span>
                                <span className="font-bold text-white flex-shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        
                        <div className="h-px bg-slate-800 my-4" />
                        
                        <div className="flex justify-between items-center text-slate-300">
                            <span>Subtotal</span>
                            <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                            <span>Delivery Fee</span>
                            <span className="font-bold text-white">{formatCurrency(deliveryFee)}</span>
                        </div>
                        
                        <div className="h-px bg-slate-800 my-4" />
                        
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-2xl font-black text-orange-500">
                                {formatCurrency(totalPrice)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-orange-500 text-white py-5 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:active:scale-100 flex items-center justify-center gap-2 text-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={22} />
                                    <span>Place Order</span>
                                </>
                            )}
                        </button>
                        
                        <p className="flex items-center justify-center gap-2 text-xs text-slate-400">
                            <Lock size={12} />
                            <span>Encrypted & secure checkout</span>
                        </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-800">
                        <Link
                            href="/cart"
                            className="text-orange-400 hover:text-orange-300 font-bold transition-colors flex items-center gap-2 text-sm"
                        >
                            <ArrowLeft size={16} />
                            Change Cart Items
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}

// Minimal ArrowLeft icon needed here
function ArrowLeft({ size = 20, className = "" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    );
}
