import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { fallbackRecipeDetails, fallbackRecipes } from '@/lib/mockRecipes';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
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
        return NextResponse.json(recipe);
    } catch (error: any) {
        console.warn('API Error, falling back to mock data due to:', error.message);
        const { id } = await params;
        
        // Return full detail mock if available, otherwise build a basic mock from list fallback
        if (fallbackRecipeDetails[id]) {
            return NextResponse.json(fallbackRecipeDetails[id]);
        }
        
        const basicRecipe = fallbackRecipes.find(r => r.recipe_id === id);
        if (basicRecipe) {
            return NextResponse.json({
                ...basicRecipe,
                recipe_ingredients: [],
                recipe_instructions: [],
                recipe_tips: []
            });
        }

        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }
}
