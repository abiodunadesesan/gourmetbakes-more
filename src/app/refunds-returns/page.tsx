export const metadata = {
    title: 'Refunds & Returns | Gourmet Bakes & More',
    description: 'Our policy on refunds, replacements, and returns for baked goods and gifts.',
};

export default function RefundsReturnsPage() {
    return (
        <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Refunds &amp; Returns</h1>
                <p className="text-slate-600 mb-10">Last updated March 2026</p>

                <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">Perishable products</h2>
                        <p>
                            Because our products are fresh and made to order, we cannot accept returns of opened
                            or consumed items. If something arrives damaged, incorrect, or below our quality
                            standard, contact us within 24 hours with your order number and a photo where helpful;
                            we will arrange a replacement or refund at our discretion.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">Cancellations</h2>
                        <p>
                            Orders cancelled before production begins may receive a full refund. Once baking or
                            customization has started, cancellation may only be partial or unavailable—our team
                            will advise case by case.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">How to request help</h2>
                        <p>
                            Email{' '}
                            <a href="mailto:victoryailele14@gmail.com" className="text-orange-600 font-semibold hover:underline">
                                victoryailele14@gmail.com
                            </a>{' '}
                            or message us on WhatsApp with your order details. We aim to respond within one business
                            day.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
