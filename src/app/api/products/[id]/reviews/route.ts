import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { ReviewSortOption } from '@/types';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const sort = (searchParams.get('sort') as ReviewSortOption) || 'recent';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '5');
        const starFilter = searchParams.get('star');

        const supabase = createServerSupabaseClient();
        const offset = (page - 1) * limit;

        // 1. Fetch Reviews with Sort and Filter
        let query = supabase
            .from('reviews')
            .select('*', { count: 'exact' })
            .eq('product_id', id);

        if (starFilter) {
            query = query.eq('rating', parseInt(starFilter));
        }

        // Apply Sorting
        switch (sort) {
            case 'highest':
                query = query.order('rating', { ascending: false }).order('created_at', { ascending: false });
                break;
            case 'lowest':
                query = query.order('rating', { ascending: true }).order('created_at', { ascending: false });
                break;
            case 'helpful':
                query = query.order('helpful_count', { ascending: false }).order('created_at', { ascending: false });
                break;
            case 'recent':
            default:
                query = query.order('created_at', { ascending: false });
                break;
        }

        const { data: reviews, count, error } = await query
            .range(offset, offset + limit - 1);

        if (error) throw error;

        // 2. Fetch Aggregate Data (Average, Distribution)
        const { data: allRatings } = await supabase
            .from('reviews')
            .select('rating')
            .eq('product_id', id);

        const totalCount = allRatings?.length || 0;
        const averageRating = totalCount > 0 
            ? parseFloat((allRatings!.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1))
            : 0;

        const starDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        allRatings?.forEach(r => {
            starDistribution[r.rating] = (starDistribution[r.rating] || 0) + 1;
        });

        // Convert distribution to percentages
        const starDistributionPercent: Record<number, number> = {};
        for (let i = 1; i <= 5; i++) {
            starDistributionPercent[i] = totalCount > 0 
                ? Math.round((starDistribution[i] / totalCount) * 100) 
                : 0;
        }

        return NextResponse.json({
            reviews,
            total_count: count,
            average_rating: averageRating,
            review_count: totalCount,
            star_distribution: starDistributionPercent
        });
    } catch (error: any) {
        console.error('API Product Reviews Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
