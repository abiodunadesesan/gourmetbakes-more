import Navbar from "@/components/Navbar";
import CateringForm from "@/components/CateringForm";

export default function CateringPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Navbar />
            
            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-pink-50 text-pink-600 rounded-full font-black text-xs uppercase tracking-widest mb-4">
                            Catering Services
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">Crafting Memorable Moments</h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                            From intimate gatherings to grand celebrations, we bring the aroma and taste of artisanal Lagos baking to your event.
                        </p>
                    </div>

                    <CateringForm />
                </div>
            </main>
</div>
    );
}
