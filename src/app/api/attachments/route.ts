import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Verify ownership through gem → role
  const { data: gem } = await supabase
    .from("experience_gems")
    .select("role_id")
    .eq("gem_id", body.gem_id)
    .single();

  if (!gem) return NextResponse.json({ error: "Gem not found" }, { status: 404 });

  const { data: role } = await supabase
    .from("job_roles")
    .select("user_id")
    .eq("role_id", gem.role_id)
    .single();

  if (!role || role.user_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("gem_attachments")
    .insert({
      gem_id: body.gem_id,
      attach_name: body.attach_name,
      attach_type: body.attach_type,
      attach_url: body.attach_url,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
