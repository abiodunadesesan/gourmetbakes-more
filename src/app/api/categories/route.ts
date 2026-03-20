import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
    try {
        const supabase = createServerSupabaseClient();

        // 1. Try to get categories from Supabase
        const { data, error } = await supabase
            .from('products')
            .select('category');

        if (error || !data || data.length === 0) {
            // Fallback to static counts from MOCK_PRODUCTS logic
            const categories = [
                { name: 'Cakes', count: 1 },
                { name: 'Meat Pies', count: 1 },
                { name: 'Fish Pies', count: 1 },
                { name: 'Agege Bread', count: 1 },
                { name: 'Snacks', count: 2 }
            ];
            return NextResponse.json(categories);
        }

        // 2. Process Supabase data to get unique categories with counts
        const categoryCounts: Record<string, number> = {};
        data.forEach((item: { category: string }) => {
            categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        });

        const result = Object.entries(categoryCounts).map(([name, count]) => ({
            name,
            count
        }));

        return NextResponse.json(result);
    } catch (err) {
        console.error('Categories API error:', err);
        return NextResponse.json([
            { name: 'Cakes', count: 0 },
            { name: 'Meat Pies', count: 0 },
            { name: 'Snacks', count: 0 }
        ]);
    }
}
