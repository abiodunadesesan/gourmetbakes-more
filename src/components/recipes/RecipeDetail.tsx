'use client';

import React from 'react';
import { Clock, ChefHat, Users, ChevronLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

import IngredientsList from './IngredientsList';
import InstructionsList from './InstructionsList';
import ShareRecipe from './ShareRecipe';
import RelatedRecipes from './RelatedRecipes';
import RelatedProducts from './RelatedProducts';

interface RecipeDetailProps {
    recipe: any; // Using any for simplicity here due to deeply nested relations
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
    if (!recipe) {
        return <div className="py-24 text-center">Recipe not found.</div>;
    }

    const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

    return (
        <div className="w-full bg-slate-50 min-h-screen pb-24">
            
            {/* Hero Image Section */}
            <div className="w-full h-[40vh] md:h-[60vh] relative min-h-[300px] print:h-auto print:min-h-0 bg-slate-900">
                <img 
                    src={recipe.featured_image_url} 
                    alt={recipe.title}
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                
                <div className="absolute top-6 left-6 print:hidden">
                    <Link href="/recipes" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        <span>All Recipes</span>
                    </Link>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-10 print:mt-0 print:pt-8">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 lg:p-12 mb-12">
                    
                    {/* Header */}
                    <div className="max-w-3xl mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold tracking-wide">
                                {recipe.category}
                            </span>
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                            {recipe.title}
                        </h1>
                        
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            {recipe.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-100 text-slate-600 font-medium">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-500" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">Total Time</span>
                                    <span>{totalTime} mins</span>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                            <div className="flex items-center gap-2">
                                <ChefHat className="w-5 h-5 text-orange-500" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">Difficulty</span>
                                    <span>{recipe.difficulty}</span>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-orange-500" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">Yield</span>
                                    <span>{recipe.yield}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12">
                        <ShareRecipe title={recipe.title} />
                    </div>

                    {recipe.cultural_context && (
                        <div className="mb-12 bg-slate-50 border-l-4 border-orange-500 p-6 rounded-r-2xl">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 shrink-0 text-orange-500 mt-1" />
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-2">Cultural Context</h3>
                                    <p className="text-slate-600 leading-relaxed">{recipe.cultural_context}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Grid: Ingredients (Left) and Instructions (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        
                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-12">
                            <IngredientsList 
                                recipeId={recipe.recipe_id} 
                                baseServings={recipe.servings} 
                                ingredients={recipe.recipe_ingredients || []} 
                            />

                            <div className="hidden lg:block print:hidden">
                                <RelatedProducts recipeId={recipe.recipe_id} />
                            </div>
                        </div>
                        
                        {/* Main Stream */}
                        <div className="lg:col-span-8">
                            <InstructionsList instructions={recipe.recipe_instructions || []} />
                            
                            <div className="mt-12 lg:hidden print:hidden">
                                <RelatedProducts recipeId={recipe.recipe_id} />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Related Recipes Section */}
                <div className="mt-20 print:hidden">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-8">You Might Also Like</h2>
                    <RelatedRecipes recipeId={recipe.recipe_id} />
                </div>

            </div>
        </div>
    );
}
