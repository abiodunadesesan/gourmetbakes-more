import { NextResponse } from "next/server";
import { getDatabaseConnectivity } from "@/lib/database-health";
import type { ApiHealthResponse } from "@/types";

export async function GET() {
  const timestamp = new Date().toISOString();
  const result = await getDatabaseConnectivity();

  if (result.database === "connected") {
    const body: ApiHealthResponse = {
      status: "ok",
      timestamp,
      database: "connected",
      productCount: result.productCount,
    };
    return NextResponse.json(body, { status: 200 });
  }

  const body: ApiHealthResponse = {
    status: "error",
    timestamp,
    database: "disconnected",
    error: result.error,
  };
  return NextResponse.json(body, { status: result.statusCode });
}
