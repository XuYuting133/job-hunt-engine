# Supabase PostgreSQL SQL Schema (Job Hunt Engine MVP)

**Environment**: Supabase Free Tier (PostgreSQL 15+)

**Storage Rule**: Structured data in Supabase DB | All file attachments stored in Azure Blob Storage (attach_url stores Blob Storage public/private links)

**Auth Note**: Uses native Supabase Auth `auth.users` UUID, no custom user table duplication

**RLS Ready**: All tables include user_id for row-level security (Supabase native permission control)

---

## 1. Enable Core Extensions (Supabase Default)

```sql
-- Enable required extensions (pre-enabled on Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

```

## 2. Core Database Tables Creation

### 2.1 job_hunt_campaigns (Top-level Campaign Container)

```sql
CREATE TABLE public.job_hunt_campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_name TEXT NOT NULL,
    target_job_title TEXT NOT NULL,
    prep_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

```

### 2.2 job_roles (Parent Job Role Container)

```sql
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

```

### 2.3 experience_gems (Fine-grained Achievement Gems Core Table)

```sql
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

```

### 2.4 gem_attachments (Multi-Attachment per Gem, Azure Blob Storage Only)

```sql
CREATE TABLE public.gem_attachments (
    attach_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gem_id UUID NOT NULL REFERENCES public.experience_gems(gem_id) ON DELETE CASCADE,
    attach_name TEXT NOT NULL,
    attach_type TEXT NOT NULL,
    attach_url TEXT NOT NULL, -- Stores Azure Blob Storage full URL exclusively
    created_at TIMESTAMPTZ DEFAULT NOW()
);

```

### 2.5 job_jds (Campaign-bound JD Records)

```sql
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

```

### 2.6 resume_templates (User Markdown Resume Templates)

```sql
CREATE TABLE public.resume_templates (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_name TEXT NOT NULL,
    markdown_content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

```

### 2.7 resume_versions (Generated Resume History Versions)

```sql
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

```

### 2.8 interview_question_pools (Campaign Exclusive Question Pool)

```sql
CREATE TABLE public.interview_question_pools (
    pool_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.job_hunt_campaigns(campaign_id) ON DELETE CASCADE,
    question_type TEXT NOT NULL CHECK (question_type IN ('gem_experience', 'skill_based')),
    question_content TEXT NOT NULL,
    related_gem_ids UUID[] DEFAULT '{}'::UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

```

### 2.9 interview_practices (Interview Q&A & AI Review Records)

```sql
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

```

### 2.10 skill_gap_reports (Campaign Skill Gap Analysis)

```sql
CREATE TABLE public.skill_gap_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.job_hunt_campaigns(campaign_id) ON DELETE CASCADE,
    jd_id UUID NOT NULL REFERENCES public.job_jds(jd_id) ON DELETE CASCADE,
    user_existing_skills TEXT[] DEFAULT '{}'::TEXT[],
    gap_skills JSONB DEFAULT '{}'::JSONB,
    improve_suggestions JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

```

### 2.11 learning_plans (Phased Learning Plans)

```sql
CREATE TABLE public.learning_plans (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.skill_gap_reports(report_id) ON DELETE CASCADE,
    plan_content JSONB DEFAULT '{}'::JSONB,
    plan_status TEXT DEFAULT 'ongoing' CHECK (plan_status IN ('ongoing', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

```

---

## 3. Supabase RLS (Row Level Security) Enablement (Critical for MVP Security)

All tables enabled with strict user isolation: users can only access their own data

```sql
-- Enable RLS on all tables
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

-- Create RLS policies (user can only select/insert/update/delete own data)
CREATE POLICY user_self_campaigns ON public.job_hunt_campaigns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_self_roles ON public.job_roles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_self_gems ON public.experience_gems FOR ALL USING (auth.uid() = (SELECT user_id FROM public.job_roles WHERE role_id = experience_gems.role_id));
CREATE POLICY user_self_attachments ON public.gem_attachments FOR ALL USING (auth.uid() = (SELECT user_id FROM public.job_roles WHERE role_id = (SELECT role_id FROM public.experience_gems WHERE gem_id = gem_attachments.gem_id)));
CREATE POLICY user_self_jds ON public.job_jds FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_self_resume_tpl ON public.resume_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_self_resume_ver ON public.resume_versions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_self_question_pools ON public.interview_question_pools FOR ALL USING (auth.uid() = (SELECT user_id FROM public.job_hunt_campaigns WHERE campaign_id = interview_question_pools.campaign_id));
CREATE POLICY user_self_interview_practice ON public.interview_practices FOR ALL USING (auth.uid() = (SELECT user_id FROM public.job_hunt_campaigns WHERE campaign_id = interview_practices.campaign_id));
CREATE POLICY user_self_skill_report ON public.skill_gap_reports FOR ALL USING (auth.uid() = (SELECT user_id FROM public.job_hunt_campaigns WHERE campaign_id = skill_gap_reports.campaign_id));
CREATE POLICY user_self_learning_plan ON public.learning_plans FOR ALL USING (auth.uid() = (SELECT user_id FROM public.job_hunt_campaigns WHERE campaign_id = (SELECT campaign_id FROM public.skill_gap_reports WHERE report_id = learning_plans.report_id)));

```

---

## 4. Helper Trigger Function: Auto Update updated_at Timestamp

```sql
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_job_roles_modtime BEFORE UPDATE ON public.job_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_experience_gems_modtime BEFORE UPDATE ON public.experience_gems FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resume_templates_modtime BEFORE UPDATE ON public.resume_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

```

---

## 5. Deployment Notes for Supabase + Azure Blob Storage

- No Supabase Storage bucket required: all binary files stored on **Azure Blob Storage**

- `attach_url` / `pdf_url` fields exclusively store Azure Blob Storage HTTP/HTTPS links

- RLS policies fully protect user private career data (compliant with MVP security requirements)

- All data types compatible with Supabase Free Tier quota and performance limits

- Uses native `auth.users` table, no duplicate user table creation

> （注：部分内容可能由 AI 生成）
