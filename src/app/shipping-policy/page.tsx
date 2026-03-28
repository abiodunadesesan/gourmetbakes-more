export const metadata = {
    title: 'Shipping Policy | Gourmet Bakes & More',
    description: 'Delivery areas, timeframes, and fees for Gourmet Bakes & More orders.',
};

export default function ShippingPolicyPage() {
    return (
        <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Shipping Policy</h1>
                <p className="text-slate-600 mb-10">Last updated March 2026</p>

                <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">Delivery areas</h2>
                        <p>
                            We currently deliver across Lagos and surrounding areas. Exact coverage may vary;
                            enter your address at checkout or contact us to confirm service to your location.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">Timeframes</h2>
                        <p>
                            Standard orders are typically prepared and dispatched within the window quoted at
                            checkout. Bulk, custom cakes, and peak holiday periods may require additional lead time.
                            You will receive updates by SMS or WhatsApp where you have opted in.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">Fees</h2>
                        <p>
                            Delivery fees are calculated from your address and order value and shown before you
                            pay (or confirm cash on delivery). Promotions may waive or reduce delivery on eligible
                            orders.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">Receiving your order</h2>
                        <p>
                            Please ensure someone is available at the delivery address or reachable by phone.
                            Perishable items should be refrigerated if not consumed the same day, per product labels
                            and instructions.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
