import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { fallbackRecipes } from '@/lib/mockRecipes';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const difficulty = searchParams.get('difficulty');
        const category = searchParams.get('category');
        const prepTime = searchParams.get('prepTime');
        const q = searchParams.get('q');

        const supabase = createServerSupabaseClient();
        let query = supabase.from('recipes').select('*').eq('is_published', true).order('created_at', { ascending: false });

        if (difficulty) query = query.eq('difficulty', difficulty);
        if (category) query = query.eq('category', category);
        if (prepTime) {
            if (prepTime === 'Under 30 min') query = query.lt('prep_time_minutes', 30);
            else if (prepTime === '30-60 min') query = query.gte('prep_time_minutes', 30).lte('prep_time_minutes', 60);
            else if (prepTime === 'Over 1 hour') query = query.gt('prep_time_minutes', 60);
        }
        if (q) {
            query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
        }

        const { data: recipes, error } = await query;

        if (error) throw error;
        return NextResponse.json(recipes);
    } catch (error: any) {
        console.warn('API Error, falling back to mock data due to:', error.message);
        
        const { searchParams } = new URL(req.url);
        const difficulty = searchParams.get('difficulty');
        const category = searchParams.get('category');
        const prepTime = searchParams.get('prepTime');
        const q = searchParams.get('q')?.toLowerCase();

        let filtered = [...fallbackRecipes];

        if (difficulty) filtered = filtered.filter(r => r.difficulty === difficulty);
        if (category) filtered = filtered.filter(r => r.category === category);
        if (prepTime) {
            if (prepTime === 'Under 30 min') filtered = filtered.filter(r => r.prep_time_minutes < 30);
            else if (prepTime === '30-60 min') filtered = filtered.filter(r => r.prep_time_minutes >= 30 && r.prep_time_minutes <= 60);
            else if (prepTime === 'Over 1 hour') filtered = filtered.filter(r => r.prep_time_minutes > 60);
        }
        if (q) {
            filtered = filtered.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
        }

        return NextResponse.json(filtered);
    }
}
