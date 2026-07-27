-- ============================================================================
-- Job Hunt Engine MVP — Initial Database Schema
-- Environment: Supabase Free Tier (PostgreSQL 15+)
-- ============================================================================

-- 1. Enable Core Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 2. Core Database Tables
-- ============================================================================

-- 2.1 job_hunt_campaigns (Top-level Campaign Container)
CREATE TABLE public.job_hunt_campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_name TEXT NOT NULL,
    target_job_title TEXT NOT NULL,
    prep_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 job_roles (Parent Job Role Container)
CREATE TABLE public.job_roles (
    role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    overall_job_scope TEXT,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 experience_gems (Fine-grained Achievement Gems Core Table)
CREATE TABLE public.experience_gems (
    gem_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES public.job_roles(role_id) ON DELETE CASCADE,
    gem_title TEXT NOT NULL,
    gem_description TEXT NOT NULL,
    quantified_achievements TEXT,
    skill_tags TEXT[] DEFAULT '{}'::TEXT[],
    gem_category TEXT CHECK (gem_category IN ('project', 'milestone', 'award', 'optimization')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 gem_attachments (Multi-Attachment per Gem, Azure Blob Storage Only)
CREATE TABLE public.gem_attachments (
    attach_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gem_id UUID NOT NULL REFERENCES public.experience_gems(gem_id) ON DELETE CASCADE,
    attach_name TEXT NOT NULL,
    attach_type TEXT NOT NULL,
    attach_url TEXT NOT NULL, -- Stores Azure Blob Storage full URL exclusively
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 job_jds (Campaign-bound JD Records)
CREATE TABLE public.job_jds (
    jd_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES public.job_hunt_campaigns(campaign_id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    jd_raw_content TEXT NOT NULL,
    parsed_skills JSONB DEFAULT '{}'::JSONB,
    parsed_responsibilities JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 resume_templates (User Markdown Resume Templates)
CREATE TABLE public.resume_templates (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_name TEXT NOT NULL,
    markdown_content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.7 resume_versions (Generated Resume History Versions)
CREATE TABLE public.resume_versions (
    resume_version_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES public.job_hunt_campaigns(campaign_id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES public.resume_templates(template_id) ON DELETE CASCADE,
    jd_id UUID NOT NULL REFERENCES public.job_jds(jd_id) ON DELETE CASCADE,
    matched_gem_ids UUID[] DEFAULT '{}'::UUID[],
    final_markdown_content TEXT NOT NULL,
    pdf_url TEXT, -- Azure Blob Storage PDF file URL
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.8 interview_question_pools (Campaign Exclusive Question Pool) — P1
CREATE TABLE public.interview_question_pools (
    pool_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.job_hunt_campaigns(campaign_id) ON DELETE CASCADE,
    question_type TEXT NOT NULL CHECK (question_type IN ('gem_experience', 'skill_based')),
    question_content TEXT NOT NULL,
    related_gem_ids UUID[] DEFAULT '{}'::UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.9 interview_practices (Interview Q&A & AI Review Records) — P1
CREATE TABLE public.interview_practices (
    practice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_id UUID NOT NULL REFERENCES public.interview_question_pools(pool_id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES public.job_hunt_campaigns(campaign_id) ON DELETE CASCADE,
    user_answer TEXT,
    ai_score INT CHECK (ai_score BETWEEN 0 AND 100),
    ai_review TEXT,
    is_weak_point BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.10 skill_gap_reports (Campaign Skill Gap Analysis) — P2
CREATE TABLE public.skill_gap_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.job_hunt_campaigns(campaign_id) ON DELETE CASCADE,
    jd_id UUID NOT NULL REFERENCES public.job_jds(jd_id) ON DELETE CASCADE,
    user_existing_skills TEXT[] DEFAULT '{}'::TEXT[],
    gap_skills JSONB DEFAULT '{}'::JSONB,
    improve_suggestions JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.11 learning_plans (Phased Learning Plans) — P2
CREATE TABLE public.learning_plans (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.skill_gap_reports(report_id) ON DELETE CASCADE,
    plan_content JSONB DEFAULT '{}'::JSONB,
    plan_status TEXT DEFAULT 'ongoing' CHECK (plan_status IN ('ongoing', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. Supabase RLS (Row Level Security) Enablement
-- ============================================================================

ALTER TABLE public.job_hunt_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_gems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gem_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_jds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_question_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gap_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY user_self_campaigns ON public.job_hunt_campaigns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_self_roles ON public.job_roles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_self_gems ON public.experience_gems FOR ALL
    USING (auth.uid() = (SELECT user_id FROM public.job_roles WHERE role_id = experience_gems.role_id));

CREATE POLICY user_self_attachments ON public.gem_attachments FOR ALL
    USING (auth.uid() = (SELECT user_id FROM public.job_roles WHERE role_id = (SELECT role_id FROM public.experience_gems WHERE gem_id = gem_attachments.gem_id)));

CREATE POLICY user_self_jds ON public.job_jds FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_self_resume_tpl ON public.resume_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_self_resume_ver ON public.resume_versions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_self_question_pools ON public.interview_question_pools FOR ALL
    USING (auth.uid() = (SELECT user_id FROM public.job_hunt_campaigns WHERE campaign_id = interview_question_pools.campaign_id));

CREATE POLICY user_self_interview_practice ON public.interview_practices FOR ALL
    USING (auth.uid() = (SELECT user_id FROM public.job_hunt_campaigns WHERE campaign_id = interview_practices.campaign_id));

CREATE POLICY user_self_skill_report ON public.skill_gap_reports FOR ALL
    USING (auth.uid() = (SELECT user_id FROM public.job_hunt_campaigns WHERE campaign_id = skill_gap_reports.campaign_id));

CREATE POLICY user_self_learning_plan ON public.learning_plans FOR ALL
    USING (auth.uid() = (SELECT user_id FROM public.job_hunt_campaigns WHERE campaign_id = (SELECT campaign_id FROM public.skill_gap_reports WHERE report_id = learning_plans.report_id)));

-- ============================================================================
-- 4. Helper Trigger: Auto Update updated_at Timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_roles_modtime BEFORE UPDATE ON public.job_roles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_experience_gems_modtime BEFORE UPDATE ON public.experience_gems
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resume_templates_modtime BEFORE UPDATE ON public.resume_templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 5. Indexes for Common Queries
-- ============================================================================

CREATE INDEX idx_campaigns_user_id ON public.job_hunt_campaigns(user_id);
CREATE INDEX idx_roles_user_id ON public.job_roles(user_id);
CREATE INDEX idx_gems_role_id ON public.experience_gems(role_id);
CREATE INDEX idx_gems_skill_tags ON public.experience_gems USING GIN(skill_tags);
CREATE INDEX idx_attachments_gem_id ON public.gem_attachments(gem_id);
CREATE INDEX idx_jds_campaign_id ON public.job_jds(campaign_id);
CREATE INDEX idx_jds_user_id ON public.job_jds(user_id);
CREATE INDEX idx_templates_user_id ON public.resume_templates(user_id);
CREATE INDEX idx_resume_versions_campaign_id ON public.resume_versions(campaign_id);
CREATE INDEX idx_resume_versions_user_id ON public.resume_versions(user_id);
