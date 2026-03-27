import Navbar from '@/components/Navbar';
import OrderStatusView from '@/components/OrderStatusView';

export const metadata = {
    title: 'Order Tracking | GourmetBakes & More',
    description: 'Track your delicious treats in real-time as they are prepared and delivered to you.',
};

export default async function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <main className="min-h-screen bg-slate-50/30 flex flex-col">
            <Navbar />
            
            <div className="flex-grow pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <OrderStatusView orderId={id} />
                </div>
            </div>
</main>
    );
}
