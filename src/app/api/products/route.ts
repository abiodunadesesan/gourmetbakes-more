import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { Product } from '@/types';

// Enhanced Mock data for REQ-3 depth
const MOCK_PRODUCTS: Product[] = [
    {
        product_id: '1',
        name: 'Artisanal Meat Pie',
        description: 'Our signature flaky pastry filled with seasoned minced beef, potatoes, and carrots. A true taste of Lagos.',
        short_description: 'Golden flaky crust with savory beef filling.',
        price: 1500,
        category: 'Meat Pies',
        image_url: 'https://images.unsplash.com/photo-1601000223933-4df452ce644c?q=80&w=800&auto=format&fit=crop',
        image_gallery: [
            'https://images.unsplash.com/photo-1601000223933-4df452ce644c?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop'
        ],
        stock_quantity: 50,
        is_available: true,
        is_featured: true,
        rating: 4.8,
        review_count: 24,
        ingredients: 'Beef, Flour, Butter, Potatoes, Carrots, Onions, Spices',
        shelf_life: '2-3 days refrigerated',
        created_at: '2024-01-01T12:00:00Z',
        updated_at: new Date().toISOString(),
    },
    {
        product_id: '2',
        name: 'Premium Agege Bread',
        description: 'Extra soft, stretchy, and slightly sweet traditional Nigerian white bread. Baked fresh every morning.',
        short_description: 'Traditional soft & stretchy Nigerian white bread.',
        price: 800,
        category: 'Agege Bread',
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
        stock_quantity: 100,
        is_available: true,
        is_featured: true,
        rating: 4.9,
        review_count: 56,
        created_at: '2024-01-02T12:00:00Z',
        updated_at: new Date().toISOString(),
    },
    {
        product_id: '3',
        name: 'Red Velvet Celebration Cake',
        description: 'Rich cocoa-infused red velvet sponge with layers of silky cream cheese frosting.',
        short_description: 'Rich red velvet with premium cream cheese frosting.',
        price: 15000,
        category: 'Cakes',
        image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=800&auto=format&fit=crop',
        image_gallery: [
            'https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop'
        ],
        stock_quantity: 10,
        is_available: true,
        is_featured: true,
        rating: 4.7,
        review_count: 15,
        created_at: '2024-01-03T12:00:00Z',
        updated_at: new Date().toISOString(),
    },
    {
        product_id: '4',
        name: 'Spicy Fish Pie',
        description: 'Crispy pastry filled with flaked white fish, peppers, and traditional spices.',
        short_description: 'Savory fish filling with a hint of Nigerian spice.',
        price: 1200,
        category: 'Fish Pies',
        image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop',
        stock_quantity: 40,
        is_available: true,
        is_featured: true,
        rating: 4.5,
        review_count: 12,
        created_at: '2024-01-04T12:00:00Z',
        updated_at: new Date().toISOString(),
    },
    {
        product_id: '5',
        name: 'Gourmet Chin Chin',
        description: 'Crunchy, bite-sized fried dough snacks flavored with nutmeg and vanilla.',
        short_description: 'Classic crunchy Nigerian snack with nutmeg notes.',
        price: 2500,
        category: 'Snacks',
        image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop',
        stock_quantity: 30,
        is_available: true,
        is_featured: true,
        rating: 4.8,
        review_count: 31,
        created_at: '2024-01-05T12:00:00Z',
        updated_at: new Date().toISOString(),
    },
    {
        product_id: '6',
        name: 'Golden Puff Puff',
        description: 'Sweet, deep-fried dough balls. Soft, airy, and dangerously addictive.',
        short_description: 'Soft, airy fried dough balls - a street food favorite.',
        price: 1000,
        category: 'Snacks',
        image_url: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?q=80&w=800&auto=format&fit=crop',
        stock_quantity: 60,
        is_available: true,
        is_featured: false,
        rating: 4.9,
        review_count: 120,
        created_at: '2024-01-06T12:00:00Z',
        updated_at: new Date().toISOString(),
    }
];

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
