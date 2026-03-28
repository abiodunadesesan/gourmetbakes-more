import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import TrustSection from "@/components/TrustSection";
import CTA from "@/components/CTA";
import { AlertCircle } from "lucide-react";
import { getDatabaseConnectivity } from "@/lib/database-health";

export default async function Home() {
  const db = await getDatabaseConnectivity();
  const isDbError = db.database !== "connected";

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <Hero />

      {/* Database Warning Banner (Only visible if DB is disconnected) */}
      {isDbError && (
        <div className="bg-orange-50 border-b border-orange-100 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-orange-700 text-sm font-medium">
            <AlertCircle size={16} />
            <span>
              Database not connected. Showing demonstration data. Check Supabase
              credentials in Vercel env or .env.local for local development.
            </span>
          </div>
        </div>
      )}

      {/* Product Showcase Section */}
      <FeaturedProducts />

      {/* Trust & Social Proof Section */}
      <TrustSection />

      {/* Call to Action Section */}
      <CTA />
    </div>
  );
}