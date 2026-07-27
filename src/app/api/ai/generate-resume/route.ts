import { createServerSupabase } from "@/lib/supabase/server";
import { generateResumeStub } from "@/lib/ai/resume-generator-stub";
import { AI_CONFIG } from "@/lib/ai/stub-registry";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { template_id, jd_id } = await request.json();

  if (!template_id || !jd_id) {
    return NextResponse.json(
      { error: "template_id and jd_id are required" },
      { status: 400 }
    );
  }

  // Fetch template
  const { data: template, error: tplErr } = await supabase
    .from("resume_templates")
    .select("*")
    .eq("template_id", template_id)
    .eq("user_id", user.id)
    .single();

  if (tplErr || !template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  // Fetch JD
  const { data: jd, error: jdErr } = await supabase
    .from("job_jds")
    .select("*")
    .eq("jd_id", jd_id)
    .eq("user_id", user.id)
    .single();

  if (jdErr || !jd) {
    return NextResponse.json({ error: "JD not found" }, { status: 404 });
  }

  // Match gems by skill overlap with JD parsed skills
  const jdSkills: string[] = jd.parsed_skills?.skills || [];
  const { data: matchingGems } = await supabase
    .from("experience_gems")
    .select("*, job_roles!inner(*)")
    .eq("job_roles.user_id", user.id);

  // Filter gems whose skill_tags overlap with JD skills
  const filteredGems = (matchingGems || []).filter((gem) =>
    gem.skill_tags?.some((tag: string) =>
      jdSkills.some((skill) =>
        tag.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(tag.toLowerCase())
      )
    )
  );

  if (AI_CONFIG.mode === "stub") {
    const result = await generateResumeStub({
      templateMarkdown: template.markdown_content,
      jdParsedSkills: jdSkills,
      jdTitle: jd.job_title,
      matchedGems: filteredGems,
    });
    return NextResponse.json({ data: result });
  }

  return NextResponse.json({ error: "Live AI not configured" }, { status: 501 });
}
