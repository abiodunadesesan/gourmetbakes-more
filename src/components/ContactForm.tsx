'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/contact/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSuccess(true);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                setTimeout(() => setSuccess(false), 5000);
            } else {
                const data = await res.json();
                setError(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Failed to send message. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-12 shadow-sm">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8 text-center">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Your Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none font-bold text-slate-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address *</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none font-bold text-slate-900"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none font-bold text-slate-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject *</label>
                        <select
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none font-bold text-slate-900 bg-white"
                        >
                            <option value="">Select a subject</option>
                            <option value="General Question">General Question</option>
                            <option value="Product Inquiry">Product Inquiry</option>
                            <option value="Feedback">Feedback</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Your Message *</label>
                    <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none font-medium text-slate-900 resize-none"
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-50 text-green-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
                        <CheckCircle2 size={18} />
                        Thank you! We'll get back to you soon.
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-orange-600 hover:-translate-y-1 transition-all active:scale-95 disabled:grayscale flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <>
                            <Loader2 size={24} className="animate-spin" />
                            <span>Sending...</span>
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            <span>Send Message</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
