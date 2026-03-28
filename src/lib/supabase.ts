import { createClient } from '@supabase/supabase-js'

const PLACEHOLDER_HOST = 'placeholder.supabase.co'

/** True when a real project URL is set (not the template placeholder). */
export function isSupabaseUrlConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    if (!url) return false
    if (url.includes(PLACEHOLDER_HOST)) return false
    return /^https?:\/\//i.test(url)
}

/** Browser client: URL + anon key present and non-placeholder. */
export function isBrowserSupabaseConfigured(): boolean {
    if (!isSupabaseUrlConfigured()) return false
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
    return !!key && key !== 'placeholder'
}

/** Server client: URL + service role key (required for privileged API routes). */
export function isServerSupabaseConfigured(): boolean {
    if (!isSupabaseUrlConfigured()) return false
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    return !!key && key !== 'placeholder'
}

// ── Browser (public) client ──────────────────────────────────────────
const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || `https://${PLACEHOLDER_HOST}`
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Server-side (privileged) client ──────────────────────────────────
// Use this in API routes and server components for admin operations.
export function createServerSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || `https://${PLACEHOLDER_HOST}`
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || 'placeholder'
    return createClient(url, serviceKey)
}
