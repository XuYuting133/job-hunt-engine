import { simulateDelay } from "./stub-registry";
import type { GenerateResumeParams, GenerateResumeResult } from "@/types";

const DEFAULT_SUMMARY = `Experienced professional with a proven track record of delivering high-impact results. Combines deep technical expertise with strong communication and collaboration skills. Passionate about building scalable solutions and driving team success.`;

function buildGemSection(gems: GenerateResumeParams["matchedGems"]): string {
  if (!gems.length) return "No experience gems selected.";

  return gems
    .map(
      (gem) => `### ${gem.gem_title}
${gem.gem_description}

${gem.quantified_achievements ? `**Key Achievement:** ${gem.quantified_achievements}` : ""}
**Skills:** ${(gem.skill_tags || []).join(", ") || "General"}`
    )
    .join("\n\n");
}

export async function generateResumeStub(
  params: GenerateResumeParams
): Promise<GenerateResumeResult> {
  await simulateDelay(2000);

  const { templateMarkdown, jdTitle, matchedGems } = params;

  let result = templateMarkdown;

  // Replace SUMMARY placeholder
  if (result.includes("<!-- SUMMARY -->")) {
    result = result.replace(
      "<!-- SUMMARY -->",
      `## Professional Summary\n\n${DEFAULT_SUMMARY} Targeting **${jdTitle}** roles.`
    );
  } else {
    result = `## Professional Summary\n\n${DEFAULT_SUMMARY}\n\n---\n\n${result}`;
  }

  // Replace EXPERIENCE placeholder
  const gemSection = buildGemSection(matchedGems);
  if (result.includes("<!-- EXPERIENCE -->")) {
    result = result.replace("<!-- EXPERIENCE -->", `## Experience\n\n${gemSection}`);
  } else {
    result += `\n\n## Experience\n\n${gemSection}`;
  }

  return {
    markdown_content: result,
    matched_gem_ids: matchedGems.map((g) => g.gem_id),
  };
}
