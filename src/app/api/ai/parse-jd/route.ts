import { createServerSupabase } from "@/lib/supabase/server";
import { parseJDStub } from "@/lib/ai/jd-parser-stub";
import { AI_CONFIG } from "@/lib/ai/stub-registry";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jd_text } = await request.json();

  if (!jd_text || typeof jd_text !== "string") {
    return NextResponse.json({ error: "jd_text is required" }, { status: 400 });
  }

  if (AI_CONFIG.mode === "stub") {
    const result = await parseJDStub(jd_text);
    return NextResponse.json({ data: result });
  }

  // Future: call real OpenAI/Claude API
  return NextResponse.json({ error: "Live AI not configured" }, { status: 501 });
}
