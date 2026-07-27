import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Verify ownership through attachment → gem → role
  const { data: att } = await supabase
    .from("gem_attachments")
    .select("gem_id")
    .eq("attach_id", id)
    .single();

  if (!att) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: gem } = await supabase
    .from("experience_gems")
    .select("role_id")
    .eq("gem_id", att.gem_id)
    .single();

  if (!gem) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: role } = await supabase
    .from("job_roles")
    .select("user_id")
    .eq("role_id", gem.role_id)
    .single();

  if (!role || role.user_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("gem_attachments")
    .delete()
    .eq("attach_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
