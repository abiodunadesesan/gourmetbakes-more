import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { ApiHealthResponse } from '@/types'

export async function GET() {
    const timestamp = new Date().toISOString()

    try {
        const supabase = createServerSupabaseClient()

        // Lightweight connectivity check + product count
        const { count, error } = await supabase
            .from('products')
            .select('product_id', { count: 'exact', head: true })

        if (error) {
            const body: ApiHealthResponse = {
                status: 'error',
                timestamp,
                database: 'disconnected',
                error: 'Unable to connect to database',
            }
            return NextResponse.json(body, { status: 503 })
        }

        const body: ApiHealthResponse = {
            status: 'ok',
            timestamp,
            database: 'connected',
            productCount: count ?? 0,
        }
        return NextResponse.json(body, { status: 200 })
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : 'Internal server error'
        const body: ApiHealthResponse = {
            status: 'error',
            timestamp,
            error: message,
            database: 'disconnected',
        }
        return NextResponse.json(body, { status: 500 })
    }
}
