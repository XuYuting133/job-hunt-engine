# Changelog

## 2026-07-27 — MVP Initial Build

### Architecture & Setup
- Scaffolded Next.js 14 (App Router) + TypeScript + Tailwind CSS project
- Configured ShadCN UI component library with mobile-first adjustments (44px touch targets)
- Set up Supabase client/server/middleware for auth and PostgreSQL

### Authentication
- Email login/signup via Supabase Auth
- Next.js middleware for route protection and session refresh
- Zustand auth store with initialize/login/signup/logout

### Layout (Mobile-First)
- Bottom tab navigation: Home, Campaigns, Generate, Experience, Templates
- Slide-up Sheet panels for all create/edit forms
- Mobile header with back button, title, and action slot
- Safe area padding for notched devices (iOS/Android)
- Fixed button bars in all panels — sticky bottom, content scrolls independently

### Campaign Management (P0)
- Full CRUD for job hunt campaigns
- Campaign detail page with nested JDs and resume versions
- Inline JD form with AI parse trigger

### Experience Gems Repository (P0)
- Two-tier hierarchy: Job Roles → Experience Gems
- Gem features: title, description, quantified achievements, skill tags, category (project/milestone/award/optimization)
- Multi-attachment support per gem (URL-based for MVP)
- Expandable gem cards with edit/delete

### Resume Templates (P0)
- Markdown template CRUD with placeholder markers (`<!-- SUMMARY -->`, `<!-- EXPERIENCE -->`)
- Live character count, monospace editor

### Resume Generation (P0)
- Multi-step wizard: pick campaign → JD → template → generate
- Mock AI: JD parsing (keyword extraction) and resume generation (template filling + gem matching)
- Edit generated markdown inline, save to campaign, export to PDF via jsPDF
- AI mode toggle: stub (default) / live (future OpenAI/Claude)

### Database
- Full Supabase PostgreSQL schema: 11 tables with RLS policies
- Indexed common query paths (user_id, campaign_id, role_id, skill_tags GIN)
- `updated_at` auto-trigger on job_roles, experience_gems, resume_templates

### Tech Stack Decisions
- Database: Supabase Free Tier (PostgreSQL)
- Backend compute: Next.js API routes (migratable to Azure Functions)
- File storage: Azure Blob Storage (URL-based attachment for MVP)
- AI: Stub mode with keyword matching; swappable to live OpenAI/Claude via `NEXT_PUBLIC_AI_MODE`
