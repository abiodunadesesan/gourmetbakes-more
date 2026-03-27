import Navbar from '@/components/Navbar';
import OrderLookup from '@/components/OrderLookup';

export const metadata = {
    title: 'Track Your Order | GourmetBakes & More',
    description: 'Enter your order number to track your delicious treats in real-time.',
};

export default function TrackOrderPage() {
    return (
        <main className="min-h-screen bg-slate-50/30 flex flex-col">
            <Navbar />
            
            <div className="flex-grow pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-16 text-center max-w-2xl mx-auto">
                        <span className="bg-orange-100 text-orange-600 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-6 inline-block">
                            Stay Updated
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 font-serif">
                            Track Your <span className="text-orange-500 uppercase italic">Treats</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">
                            Waiting is the hardest part. Enter your details below to see exactly where your order is in our kitchen or on the road.
                        </p>
                    </header>

                    <OrderLookup />
                </div>
            </div>
</main>
    );
}
