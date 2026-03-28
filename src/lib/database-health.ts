import { createServerSupabaseClient } from "@/lib/supabase";

export type DatabaseConnectivityResult =
  | { database: "connected"; productCount: number }
  | { database: "disconnected"; error: string; statusCode: 503 | 500 };

/**
 * Direct Supabase connectivity check (same query as /api/health).
 * Use this from server components instead of HTTP-fetching your own /api/health,
 * which breaks when NEXT_PUBLIC_SITE_URL is unset or points at localhost.
 */
export async function getDatabaseConnectivity(): Promise<DatabaseConnectivityResult> {
  try {
    const supabase = createServerSupabaseClient();
    const { count, error } = await supabase
      .from("products")
      .select("product_id", { count: "exact", head: true });

    if (error) {
      return {
        database: "disconnected",
        error: "Unable to connect to database",
        statusCode: 503,
      };
    }

    return {
      database: "connected",
      productCount: count ?? 0,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return {
      database: "disconnected",
      error: message,
      statusCode: 500,
    };
  }
}
