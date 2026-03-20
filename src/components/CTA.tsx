import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-24 relative overflow-hidden bg-orange-500 text-white">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
                    Ready to taste <br />
                    <span className="italic">home?</span>
                </h2>
                <p className="text-orange-50 mb-12 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                    Whether you're craving a single meat pie or planning a large celebration, we're here to bring authentic Nigerian flavor to your table.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        href="/products"
                        className="w-full sm:w-auto px-12 py-5 bg-white text-orange-600 font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-orange-50 transition-all duration-300"
                    >
                        <span>Browse Full Menu</span>
                        <ArrowRight size={20} />
                    </Link>
                    <Link
                        href="/contact"
                        className="w-full sm:w-auto px-12 py-5 border-2 border-white/30 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300"
                    >
                        <span>Contact Us</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
