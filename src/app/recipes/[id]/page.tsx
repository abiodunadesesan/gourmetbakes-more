import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import RecipeDetail from '@/components/recipes/RecipeDetail';
import { createServerSupabaseClient } from '@/lib/supabase';
import { fallbackRecipeDetails, fallbackRecipes } from '@/lib/mockRecipes';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const supabase = createServerSupabaseClient();
        const { data: recipe } = await supabase
            .from('recipes')
            .select('title, description')
            .eq('recipe_id', id)
            .single();

        if (recipe) {
            return {
                title: `${recipe.title} Recipe | GourmetBakes & More`,
                description: recipe.description,
            };
        }
    } catch (e) {
        // fallback
    }

    const fallback = fallbackRecipes.find(r => r.recipe_id === id);
    if (fallback) {
        return {
            title: `${fallback.title} Recipe | GourmetBakes & More`,
            description: fallback.description,
        };
    }

    return {
        title: 'Recipe | GourmetBakes & More',
    };
}

async function getRecipe(id: string) {
    try {
        const supabase = createServerSupabaseClient();
        const { data: recipe, error } = await supabase
            .from('recipes')
            .select(`
                *,
                recipe_ingredients(*),
                recipe_instructions(*),
                recipe_tips(*)
            `)
            .eq('recipe_id', id)
            .single();

        if (error) throw error;
        return recipe;
    } catch (error) {
        if (fallbackRecipeDetails[id]) return fallbackRecipeDetails[id];
        
        const basicRecipe = fallbackRecipes.find(r => r.recipe_id === id);
        if (basicRecipe) {
            return {
                ...basicRecipe,
                recipe_ingredients: [],
                recipe_instructions: [],
                recipe_tips: []
            };
        }
        return null;
    }
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const recipe = await getRecipe(id);

    if (!recipe) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="print:hidden">
                <Navbar />
            </div>
            
            <main className="flex-grow">
                <RecipeDetail recipe={recipe} />
            </main>

            <div className="print:hidden">
</div>
        </div>
    );
}
