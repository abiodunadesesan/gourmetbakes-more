import { createClient } from '@supabase/supabase-js'

// ── Browser (public) client ──────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Server-side (privileged) client ──────────────────────────────────
// Use this in API routes and server components for admin operations.
export function createServerSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    return createClient(url, serviceKey)
}
