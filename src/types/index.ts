// Core application types for Job Hunt Engine

// ─── Campaign ───────────────────────────────────────────
export interface Campaign {
  campaign_id: string;
  user_id: string;
  campaign_name: string;
  target_job_title: string;
  prep_deadline: string | null;
  created_at: string;
}

export interface CreateCampaignInput {
  campaign_name: string;
  target_job_title: string;
  prep_deadline?: string;
}

export type UpdateCampaignInput = Partial<CreateCampaignInput>;

// ─── Job Role ───────────────────────────────────────────
export interface JobRole {
  role_id: string;
  user_id: string;
  role_title: string;
  company_name: string;
  start_date: string;
  end_date: string | null;
  overall_job_scope: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRoleInput {
  role_title: string;
  company_name: string;
  start_date: string;
  end_date?: string | null;
  overall_job_scope?: string | null;
  is_archived?: boolean;
}

export type UpdateRoleInput = Partial<CreateRoleInput>;

// ─── Experience Gem ─────────────────────────────────────
export type GemCategory = "project" | "milestone" | "award" | "optimization";

export interface ExperienceGem {
  gem_id: string;
  role_id: string;
  gem_title: string;
  gem_description: string;
  quantified_achievements: string | null;
  skill_tags: string[];
  gem_category: GemCategory;
  created_at: string;
  updated_at: string;
}

export interface CreateGemInput {
  role_id: string;
  gem_title: string;
  gem_description: string;
  quantified_achievements?: string | null;
  skill_tags?: string[];
  gem_category?: GemCategory;
}

export type UpdateGemInput = Partial<Omit<CreateGemInput, "role_id">>;

// ─── Gem Attachment ─────────────────────────────────────
export interface GemAttachment {
  attach_id: string;
  gem_id: string;
  attach_name: string;
  attach_type: string;
  attach_url: string;
  created_at: string;
}

export interface CreateAttachmentInput {
  gem_id: string;
  attach_name: string;
  attach_type: string;
  attach_url: string;
}

// ─── Job JD ─────────────────────────────────────────────
export interface JobJD {
  jd_id: string;
  user_id: string;
  campaign_id: string;
  job_title: string;
  jd_raw_content: string;
  parsed_skills: Record<string, string[]>;
  parsed_responsibilities: Record<string, string[]>;
  created_at: string;
}

export interface CreateJDInput {
  campaign_id: string;
  job_title: string;
  jd_raw_content: string;
  parsed_skills?: Record<string, string[]>;
  parsed_responsibilities?: Record<string, string[]>;
}

export type UpdateJDInput = Partial<CreateJDInput>;

// ─── Resume Template ────────────────────────────────────
export interface ResumeTemplate {
  template_id: string;
  user_id: string;
  template_name: string;
  markdown_content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateInput {
  template_name: string;
  markdown_content: string;
}

export type UpdateTemplateInput = Partial<CreateTemplateInput>;

// ─── Resume Version ─────────────────────────────────────
export interface ResumeVersion {
  resume_version_id: string;
  user_id: string;
  campaign_id: string;
  template_id: string;
  jd_id: string;
  matched_gem_ids: string[];
  final_markdown_content: string;
  pdf_url: string | null;
  created_at: string;
}

export interface GenerateResumeInput {
  campaign_id: string;
  template_id: string;
  jd_id: string;
}

export interface GenerateResumeOutput {
  markdown_content: string;
  matched_gem_ids: string[];
}

export type GenerateResumeResult = GenerateResumeOutput;

// ─── AI Types ───────────────────────────────────────────
export interface ParsedJD {
  job_title?: string;
  skills: string[];
  responsibilities: string[];
}

export type ParsedJDResult = ParsedJD;

export interface GenerateResumeParams {
  templateMarkdown: string;
  jdParsedSkills: string[];
  jdTitle: string;
  matchedGems: ExperienceGem[];
}

// ─── API Types ──────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
