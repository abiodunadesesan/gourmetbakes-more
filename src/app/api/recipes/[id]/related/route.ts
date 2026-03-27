import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { fallbackRecipes } from '@/lib/mockRecipes';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = createServerSupabaseClient();
        
        // First get the category of the current recipe
        const { data: current, error: err1 } = await supabase
            .from('recipes')
            .select('category')
            .eq('recipe_id', id)
            .single();
            
        if (err1) throw err1;

        // Then get similar recipes in the same category (or any if few)
        const { data: related, error: err2 } = await supabase
            .from('recipes')
            .select('*')
            .eq('is_published', true)
            .neq('recipe_id', id)
            .eq('category', current.category)
            .limit(4);

        if (err2) throw err2;
        
        // If not enough related in same category, get random others
        if (related.length < 3) {
            const { data: more } = await supabase
                .from('recipes')
                .select('*')
                .eq('is_published', true)
                .neq('recipe_id', id)
                .limit(4 - related.length);
                
            if (more) {
                related.push(...more);
            }
        }

        return NextResponse.json(related);
    } catch (error: any) {
        console.warn('API Error, falling back to mock related data due to:', error.message);
        const { id } = await params;
        
        const current = fallbackRecipes.find(r => r.recipe_id === id);
        if (!current) return NextResponse.json([], { status: 404 });
        
        let related = fallbackRecipes.filter(r => r.recipe_id !== id && r.category === current.category).slice(0, 4);
        if (related.length < 3) {
            const more = fallbackRecipes.filter(r => r.recipe_id !== id && !related.find(re => re.recipe_id === r.recipe_id)).slice(0, 4 - related.length);
            related = [...related, ...more];
        }
        
        return NextResponse.json(related);
    }
}
