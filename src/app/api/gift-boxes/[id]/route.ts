import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { fallbackGifts } from '@/lib/mockGifts';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = createServerSupabaseClient();
        const { data, error } = await supabase
            .from('gift_boxes')
            .select('*')
            .eq('gift_box_id', id)
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.warn('API Error fetching gift box details, falling back to mock...:', error.message);
        
        const { id } = await params;
        const box = fallbackGifts.find(g => g.gift_box_id === id);
        
        if (box) {
            return NextResponse.json(box);
        }
        
        return NextResponse.json({ error: 'Gift Box Not Found' }, { status: 404 });
    }
}
