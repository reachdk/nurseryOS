import { NextResponse } from "next/server";
import { createClient } from "@/server/db/client.server";
import { isSupabaseConfigured } from "@/server/db/env";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        app: "nurseryosv2",
        supabase: "not_configured",
        message: "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env",
      },
      { status: 503 }
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          app: "nurseryosv2",
          supabase: "error",
          message: error.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      app: "nurseryosv2",
      supabase: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        ok: false,
        app: "nurseryosv2",
        supabase: "error",
        message,
      },
      { status: 503 }
    );
  }
}
