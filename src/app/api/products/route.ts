import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { MOCK_PRODUCTS } from '@/lib/mockProducts';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // Parse REQ-3 filters
    const category = searchParams.get('category');
    const categories = searchParams.get('categories')?.split(',');
    const featured = searchParams.get('featured');
    const q = searchParams.get('q')?.toLowerCase();
    const minPrice = searchParams.get('min_price') ? Number(searchParams.get('min_price')) : null;
    const maxPrice = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : null;
    const inStock = searchParams.get('in_stock') === 'true';
    const sort = searchParams.get('sort') || 'newest';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;

    try {
        const supabase = createServerSupabaseClient();

        // 1. Build Supabase Query (Real World)
        let query = supabase.from('products').select('*', { count: 'exact' });

        if (category && category !== 'all') query = query.eq('category', category);
        if (categories && categories.length > 0) query = query.in('category', categories);
        if (featured === 'true') query = query.eq('is_featured', true);
        if (q) query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
        if (minPrice !== null) query = query.gte('price', minPrice);
        if (maxPrice !== null) query = query.lte('price', maxPrice);
        if (inStock) query = query.gt('stock_quantity', 0).eq('is_available', true);

        // Sorting
        switch (sort) {
            case 'price_asc': query = query.order('price', { ascending: true }); break;
            case 'price_desc': query = query.order('price', { ascending: false }); break;
            case 'best_rated': query = query.order('rating', { ascending: false }); break;
            case 'most_popular': query = query.order('review_count', { ascending: false }); break;
            case 'newest': default: query = query.order('created_at', { ascending: false }); break;
        }

        // Pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        // 2. Handle Data / Fallback to Mock
        if (error || !data || data.length === 0) {
            // Apply similar logic to Mock Data
            let results = [...MOCK_PRODUCTS];

            if (category && category !== 'all') results = results.filter(p => p.category === category);
            if (categories && categories.length > 0) results = results.filter(p => categories.includes(p.category));
            if (featured === 'true') results = results.filter(p => p.is_featured);
            if (q) results = results.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q)
            );
            if (minPrice !== null) results = results.filter(p => p.price >= minPrice);
            if (maxPrice !== null) results = results.filter(p => p.price <= maxPrice);
            if (inStock) results = results.filter(p => p.stock_quantity > 0 && p.is_available);

            // Mock Sorting
            switch (sort) {
                case 'price_asc': results.sort((a, b) => a.price - b.price); break;
                case 'price_desc': results.sort((a, b) => b.price - a.price); break;
                case 'best_rated': results.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
                case 'most_popular': results.sort((a, b) => (b.review_count || 0) - (a.review_count || 0)); break;
                case 'newest': default: results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
            }

            const total = results.length;
            const paginated = results.slice(from, from + limit);

            return NextResponse.json({
                products: paginated,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        }

        return NextResponse.json({
            products: data,
            meta: {
                total: count || data.length,
                page,
                limit,
                totalPages: Math.ceil((count || data.length) / limit)
            }
        });
    } catch (err) {
        console.error('Internal server error:', err);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
