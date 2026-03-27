import Navbar from "@/components/Navbar";
import FounderSection from "@/components/FounderSection";
import MissionSection from "@/components/MissionSection";
import QualitySection from "@/components/QualitySection";
import TestimonialSection from "@/components/TestimonialSection";
import CTA from "@/components/CTA";

export const metadata = {
    title: 'Our Story | GourmetBakes & More',
    description: 'Learn about GourmetBakes & More, our founder VeeJb, and our commitment to authentic Nigerian flavors.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            <main>
                {/* Hero section */}
                <section className="pt-32 pb-24 bg-gradient-to-br from-orange-400 to-amber-600 text-white relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
                    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                        <h1 className="text-5xl md:text-8xl font-serif font-bold mb-8 animate-in slide-in-from-bottom-10 duration-700">
                            Our Story
                        </h1>
                        <p className="text-xl md:text-2xl font-medium text-orange-50 max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000">
                            Bringing authentic Nigerian flavors to your table, one bite at a time.
                        </p>
                    </div>
                </section>

                <FounderSection />
                <MissionSection />
                <QualitySection />
                <TestimonialSection />
                <CTA />
            </main>
</div>
    );
}
