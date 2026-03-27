import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { fallbackGifts } from '@/lib/mockGifts';

export async function GET(req: Request) {
    try {
        const supabase = createServerSupabaseClient();
        const { data, error } = await supabase
            .from('gift_boxes')
            .select('*')
            .eq('is_available', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.warn('API Error fetching gift boxes, falling back to mock...:', error.message);
        return NextResponse.json(fallbackGifts);
    }
}
