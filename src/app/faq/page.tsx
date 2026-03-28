export const metadata = {
    title: 'FAQs | Gourmet Bakes & More',
    description: 'Frequently asked questions about ordering, delivery, and our Nigerian delicacies.',
};

const faqs = [
    {
        q: 'How do I place an order?',
        a: 'Browse the menu, add items to your cart, and proceed to checkout with your delivery details. You can also reach us on WhatsApp for large or custom orders.',
    },
    {
        q: 'Do you offer cash on delivery?',
        a: 'Yes. You can select cash on delivery at checkout where available. Payment options may be confirmed when your order is accepted.',
    },
    {
        q: 'How fresh are the products?',
        a: 'We bake in small batches and aim to deliver items as fresh as possible. Storage guidance is provided with your order.',
    },
    {
        q: 'Can I track my order?',
        a: 'Yes. Use the Order Tracking page with your order number, or follow the link sent by email or WhatsApp when your order ships.',
    },
    {
        q: 'Do you cater events and bulk orders?',
        a: 'We offer bulk and catering options. Visit Bulk Orders or contact us with your event date, guest count, and product preferences.',
    },
];

export default function FaqPage() {
    return (
        <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Frequently asked questions</h1>
                <p className="text-slate-600 mb-12">
                    Quick answers about ordering from Gourmet Bakes &amp; More. Still stuck?{' '}
                    <a href="/contact" className="text-orange-600 font-semibold hover:underline">
                        Contact us
                    </a>
                    .
                </p>

                <ul className="space-y-10">
                    {faqs.map((item) => (
                        <li key={item.q}>
                            <h2 className="text-lg font-bold text-slate-900 mb-2">{item.q}</h2>
                            <p className="text-slate-600 leading-relaxed">{item.a}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
