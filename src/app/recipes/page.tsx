import React from 'react';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import Navbar from '@/components/Navbar';

export const metadata = {
    title: 'Recipes & Cooking Guide | GourmetBakes & More',
    description: 'Discover authentic Nigerian baking recipes, tips, and step-by-step guides from GourmetBakes & More.',
};

export default function RecipesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            
            <main className="flex-grow">
                {/* Hero Section */}
                <div className="bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2000" 
                        alt="Baking ingredients" 
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                    
                    <div className="relative max-w-7xl mx-auto text-center z-10">
                        <span className="text-orange-400 font-bold tracking-wider uppercase text-sm mb-4 block">Cooking Guide</span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
                            Bake Like a <span className="text-orange-500">Pro</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
                            Authentic recipes, step-by-step instructions, and expert tips from our kitchen to yours. Recreate the magic of GourmetBakes at home.
                        </p>
                    </div>
                </div>

                {/* Recipe Grid Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
                    <RecipeGrid />
                </div>
            </main>
</div>
    );
}
