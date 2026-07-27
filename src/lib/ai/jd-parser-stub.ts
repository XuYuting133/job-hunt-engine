import { simulateDelay } from "./stub-registry";
import type { ParsedJDResult } from "@/types";

const SKILL_KEYWORDS = [
  "React", "TypeScript", "JavaScript", "Node.js", "Python", "SQL", "PostgreSQL",
  "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
  "GraphQL", "REST", "CI/CD", "Git", "Linux", "Agile", "Scrum",
  "Java", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin",
  "Machine Learning", "Data Analysis", "TensorFlow", "PyTorch",
  "Microservices", "System Design", "DevOps", "Terraform",
  "Communication", "Leadership", "Problem Solving", "Team Management",
];

const RESPONSIBILITY_TEMPLATES = [
  "Design and architect scalable systems",
  "Develop and implement new features",
  "Collaborate with cross-functional teams",
  "Write clean, maintainable, and tested code",
  "Lead technical design discussions",
  "Mentor junior engineers",
  "Optimize application performance",
  "Manage project timelines and deliverables",
  "Conduct code reviews",
  "Troubleshoot and debug production issues",
  "Define engineering best practices",
  "Drive technical roadmap planning",
];

export async function parseJDStub(jdText: string): Promise<ParsedJDResult> {
  await simulateDelay();

  const lower = jdText.toLowerCase();

  const skills = SKILL_KEYWORDS.filter((skill) =>
    lower.includes(skill.toLowerCase())
  );

  const responsibilities = RESPONSIBILITY_TEMPLATES.filter((tmpl) =>
    tmpl.split(" ").some((word) => lower.includes(word.toLowerCase()))
  );

  return {
    skills: skills.length > 0 ? skills : ["JavaScript", "Problem Solving", "Communication"],
    responsibilities:
      responsibilities.length > 0
        ? responsibilities
        : ["Develop features", "Collaborate with team", "Write clean code"],
  };
}
