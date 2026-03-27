import Navbar from "@/components/Navbar";
import BulkOrderForm from "@/components/BulkOrderForm";

export default function BulkOrderPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Navbar />
            
            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-black text-xs uppercase tracking-widest mb-4">
                            Bulk & Wholesale
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">Partner With Us</h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                            Stock our premium artisanal bakes in your cafe, office, or store. Enjoy volume discounts and dedicated account management.
                        </p>
                    </div>

                    <BulkOrderForm />
                </div>
            </main>
</div>
    );
}
