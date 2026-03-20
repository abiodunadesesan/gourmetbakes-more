import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShoppingCart from '@/components/ShoppingCart';

export const metadata = {
    title: 'Your Shopping Cart | GourmetBakes & More',
    description: 'Review your selected Nigerian treats before checkout.',
};

export default function CartPage() {
    return (
        <main className="min-h-screen bg-slate-50/30 flex flex-col">
            <Navbar />
            
            <div className="flex-grow pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-12 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-serif">
                            Your <span className="text-orange-500">Shopping Cart</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl">
                            Review your items and get ready for a delicious experience.
                        </p>
                    </header>

                    <ShoppingCart />
                </div>
            </div>

            <Footer />
        </main>
    );
}
