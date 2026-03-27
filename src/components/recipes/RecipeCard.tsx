import React from 'react';
import Link from 'next/link';
import { Clock, ChefHat, Users } from 'lucide-react';

interface RecipeCardProps {
    recipe: {
        recipe_id: string;
        title: string;
        description: string;
        difficulty: string;
        prep_time_minutes: number;
        cook_time_minutes: number;
        servings: number;
        featured_image_url: string;
        category: string;
    }
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

    return (
        <Link href={`/recipes/${recipe.recipe_id}`} className="group h-full">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 h-full flex flex-col group-hover:-translate-y-1">
                <div className="relative h-56 overflow-hidden">
                    {/* Fallback image if empty */}
                    <img 
                        src={recipe.featured_image_url || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800'} 
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-orange-600 shadow-sm">
                        {recipe.category}
                    </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {recipe.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
                        {recipe.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span>{totalTime}m</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <ChefHat className="w-4 h-4 text-orange-500" />
                            <span>{recipe.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-orange-500" />
                            <span>{recipe.servings} Servings</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
