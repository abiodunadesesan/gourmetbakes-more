import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata = {
    title: 'Checkout | GourmetBakes & More',
    description: 'Complete your order and enjoy delicious Nigerian delicacies.',
};

export default function CheckoutPage() {
    return (
        <main className="min-h-screen bg-slate-50/30 flex flex-col">
            <Navbar />
            
            <div className="flex-grow pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-serif text-center mx-auto">
                            Complete Your <span className="text-orange-500 uppercase italic">Order</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Almost there! Provide your delivery details below to finalize your purchase.
                        </p>
                    </header>

                    <CheckoutForm />
                </div>
            </div>

            <Footer />
        </main>
    );
}
