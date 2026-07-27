import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get("role_id");
  if (!roleId) return NextResponse.json({ error: "role_id required" }, { status: 400 });

  // Verify ownership through role
  const { data: role } = await supabase
    .from("job_roles")
    .select("user_id")
    .eq("role_id", roleId)
    .single();

  if (!role || role.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("experience_gems")
    .select("*")
    .eq("role_id", roleId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Verify role ownership
  const { data: role } = await supabase
    .from("job_roles")
    .select("user_id")
    .eq("role_id", body.role_id)
    .single();

  if (!role || role.user_id !== user.id) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("experience_gems")
    .insert({
      role_id: body.role_id,
      gem_title: body.gem_title,
      gem_description: body.gem_description,
      quantified_achievements: body.quantified_achievements,
      skill_tags: body.skill_tags || [],
      gem_category: body.gem_category || "project",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
