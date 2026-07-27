# PRD: Job Hunt Engine (End-to-End Job Hunting Preparation Platform)

## 1. Product Overview

### 1.1 Product Definition

Job Hunt Engine is an all-in-one end-to-end job hunting preparation SaaS product designed for job seekers. It centralizes hierarchical personal career experience gem management, JD & template-driven resume customization, campaign-based intelligent interview preparation, and personalized skill gap analysis & learning planning. The product solves the core pain points of scattered career experience records, inefficient resume tailoring, blind interview preparation, and unclear skill improvement paths in the job hunting process.

### 1.2 Core Value Proposition

- **Fine-grained Experience Asset Precipitation**: Build a permanent, lightweight career gem repository (job role + multiple small, clean incremental achievement gems) to continuously accumulate job-hunting core materials.

- **Template + JD Dual-driven Customization**: Generate standardized, structured markdown resumes/profiles based on user templates and target JD matching to improve resume targeting and pass rate.

- **Campaign-based Systematic Interview Training**: Bind all interview practice, question pools and job prep records to a specific job hunt campaign for unified management and targeted training.

- **Data-driven Skill Growth**: Accurately locate skill gaps for target positions and generate actionable learning plans to support long-term career competitiveness improvement.

### 1.3 Target Users

- Primary users: Workplace switchers, fresh graduates, and job seekers with formal job hunting needs.

- Secondary users: Professionals who need regular career sorting and resume optimization for future job hunting reserves.

## 2. Product Functional Requirements (Core Modules)

### Module 1: Career Experience Gems Repository

#### 2.1.1 Functional Objectives

Establish a two-tier hierarchical, fine-grained personal career asset library: parent job role containers + multiple lightweight, editable child experience gems. Support continuous incremental addition of small achievements and milestones, with tagging and multi-attachment capability, providing standardized structured data for resume generation and personalized interview question generation.

#### 2.1.2 Core Features (Revised & Gap Fixed)

- **Two-Tier Role-Gem Hierarchical Structure (Core)**: Users create fixed parent job role information (company, tenure, overall scope). Under each role, users can add unlimited **small, clean, lightweight experience gems** for every independent milestone, mini-project, and achievement. Gems support free editing and iteration, no bloated single-role write-up limitation.

- **Gem Tagging & Category Classification**: Each independent gem supports multiple custom skill tags and business category labels (technical skill, business operation, project delivery, cross-team collaboration, leadership) for precise JD matching and targeted interview question generation.

- **Multi-Attachment Support per Gem**: Single experience gem can bind multiple supporting resources simultaneously, including certificates, demo links, case files, performance reports and award screenshots; support online preview and quick retrieval.

- **Lightweight Gem Editing Logic**: Gems are designed to be kept small, modular and clean. Support swift editing, updating and rewriting;**no version history tracking** for MVP to keep logic simple.

- **Soft Archive Management**: Support role-level and gem-level soft archive, allowing users to hide irrelevant historical achievements for different job hunt scenarios.

#### 2.1.3 User Flow

User enters repository page → creates/edits base job role → continuously adds lightweight fine-grained experience gems under the role → tags and categorizes each gem → binds multiple attachments/links per gem → saves cloud synchronization.

### Module 2: JD + Template Driven Custom Resume/Profile Generator

#### 2.2.1 Functional Objectives

Based on user-defined markdown resume templates + target JD parsing + personal gem repository data, intelligently match and assemble personalized resumes with customized professional summaries, support resume version preservation and historical record query.

#### 2.2.2 Core Features (Revised & Gap Fixed)

- **Markdown Resume Template Management**: Users can create, edit and save multiple custom markdown resume templates. Templates support fixed layout logic, reserved summary blocks and experience display rules, serving as the fixed skeleton for all auto-generated resumes.

- **JD Parsing & Requirement Extraction**: Support pasting JD text; intelligently extract core hard/soft skills, job responsibilities and competency requirements.

- **Dual-Driven Resume Generation Logic**: Every resume generation task requires two inputs: **one selected markdown template + one target JD**. The system matches high-relevance experience gems, fills and optimizes content into the template skeleton, and generates a JD-targeted resume with auto-tailored professional summary.

- **Historical Resume Version Persistence**: Automatically save all generated resume versions, bind them to the corresponding job hunt campaign, template and JD, support historical preview and repeated export.

- **Manual Fine-tuning & PDF Export**: Allow manual content adjustment and real-time preview; support one-click PDF export of markdown resumes.

#### 2.2.3 User Flow

User selects markdown resume template → selects/imports target JD → system parses JD & screens matching experience gems → auto-generates tailored resume with professional summary → user fine-tunes manually → save version & export PDF.

### Module 3: Campaign-Based Intelligent Interview Preparation System

#### 2.3.1 Functional Objectives

Centered on independent job hunt campaigns, generate personalized question pools based on user-defined question volume, target JD requirements and user’s own experience gems, support targeted Q&A practice and AI answer review.

#### 2.3.2 Core Features (Revised & Gap Fixed)

- **Job Hunt Campaign Binding**: All interview preparation data (question pool, practice records, weak questions) is tied to a specific job hunt campaign to realize scenario-based unified management.

- **Custom Question Volume & Preparation Cycle**: Users freely define preparation duration and total number of interview questions; the system dynamically allocates question quantity by type.

- **Dual-Type Personalized Question Pool**: Auto-generate two core question types aligned with target position:
1. **Gem/Experience-based questions**: Generated directly based on user’s stored experience gems, forcing user to review personal project/achievement details;
        
2. **Skill-based questions**: Generated from JD required hard/soft skills to make up for professional competency verification.


- **Independent Campaign Question Pool**: Each job hunt campaign owns an independent exclusive question pool, supporting repeated practice and weak question collection within the campaign scope.

- **Simulation Q&A & AI Review**: Support text answer practice, AI multi-dimensional scoring and targeted optimization suggestions, and weak question collection.

#### 2.3.3 User Flow

User enters a specific job hunt campaign → sets prep cycle & total question count → system generates exclusive gem-based + skill-based question pool → user practices Q&A → AI reviews answers → system collects weak questions under the campaign.

### Module 4: Skill Gap Analysis &amp; Personalized Learning Plan

#### 2.4.1 Functional Objectives

Based on the gap between target JD competency requirements and user’s existing gem-based skill system, identify skill deficiencies and generate basic phased learning plans (retained simple MVP logic, no advanced iteration for now).

#### 2.4.2 Core Features

- **Skill Dimension Matching**: Extract JD required skills, match against user gem skill tags to form gap analysis report.

- **Gap Priority Classification**: Classify missing/insufficient skills by improvement priority.

- **Basic Improvement Suggestions**: Provide directional skill improvement tips.

- **Simple Phased Learning Plan Generation**: Generate basic daily/weekly learning tasks on user request.

#### 2.4.3 User Flow

System completes JD-skill matching → generates gap report → displays improvement suggestions → user triggers learning plan generation → obtains basic phased learning plan.

## 3. New Core Entity: Job Hunt Campaign (P0 Fixed Gap)

Add top-level **Job Hunt Campaign** as the unified container for one complete target position job hunt preparation, solving the problem of isolated module data. All core behaviors are bundled under a single campaign.

### 3.1 Campaign Core Capability

One campaign = One target job position. A single campaign centrally manages: target JD file, bound resume templates & historical resume versions, exclusive interview question pool, interview practice records, skill gap report and corresponding learning plan.

### 3.2 Campaign User Flow

User creates new job hunt campaign (names target position) → imports/associates target JD → selects resume template for generation → launches interview preparation & skill analysis → all records are persisted under this independent campaign.

## 4. MVP Scope Definition

The first-stage MVP focuses on verified closed-loop core business, with cleaned streamlined logic and no redundant functions:

1. P0: Hierarchical experience gem repository (role + multi lightweight gems, tags + multi-attachment per gem)

2. P0: Job hunt campaign top-level management (unify all job hunt resources)

3. P0: Markdown template + JD dual-driven resume generation, historical version saving & PDF export

4. P1: Custom-volume interview question pool (gem-based + skill-based) + AI answer review under campaign

5. P2: Basic skill gap analysis + simple learning plan generation

6. Basic user account & cloud data synchronization

**MVP Excluded Functions**: Gem version history, advanced resume template customization, voice interview simulation, dynamic learning plan iteration, data statistics, multi-language, team collaboration.

## 5. Non-Functional Requirements

### 5.1 Performance

- JD parsing and resume generation completion time ≤ 5s

- Interview answer review and scoring completion time ≤ 3s

- Skill gap analysis report generation completion time ≤ 4s

### 5.2 Security

- Encrypt storage of user personal career data to prevent privacy leakage

- Support user independent data deletion and data export

- Prohibit unauthorized access and crawling of user experience assets

### 5.3 Usability

- All core job hunting processes are visualized, with simple operation steps

- Provide operation guidance for first-time users to reduce learning costs

## 6. MVP Recommended Tech Stack (Supabase Free Tier + Azure Cloud)

Lightweight, low-cost, fast iteration stack for MVP launch:

### 6.1 Frontend Stack

- Framework: React + Next.js

- UI Library: ShadCN UI / Ant Design

- Markdown Render/Export: react-markdown + React-PDF/jsPDF

- State Management: Zustand

### 6.2 Backend & Cloud Stack

- **Backend Database & Auth**: Supabase (Free Tier)
Database: PostgreSQL (native Supabase database, 100% compatible with existing table schema, no SQL modification needed)

- Built-in User Auth: Replace custom user account logic with Supabase native email authentication, free and ready-to-use

- Advantages: Zero backend DB deployment, free tier sufficient for MVP development & small-scale launch, built-in data row-level security (RLS) to protect user career private data

- **Backend Compute**: Azure Functions (serverless, consumption plan)
  - Lightweight API endpoints for JD parsing, resume generation, AI orchestration
  - Scales to zero when idle, pay-per-execution — ideal for MVP cost control

- **File/Object Storage**: Azure Blob Storage (replace Supabase Storage / Cloudinary / AWS S3)
  - Hot tier for gem attachments, PDF exports, and user uploads
  - Built-in CDN support via Azure CDN for fast asset delivery
  - SAS token / RBAC for fine-grained access control

- **Data & File Rule**: All structured business data (users, campaigns, gems, resumes, interview records) stored in Supabase PostgreSQL; all binary files & external resources (gem attachments, certificate files, demo attachments, PDF exports) stored exclusively on Azure Blob Storage

### 6.3 AI Capability Stack

- LLM Service: OpenAI GPT-4o / Claude 3.5 API

- Text Matching: LLM semantic matching + TF-IDF

### 6.4 Deployment & DevOps (Free Tier Focused)

- Frontend: Vercel (Free Tier, one-click Next.js deployment)

- Backend Compute: Azure Functions Consumption Plan (1M free executions/month, lightweight API hosting)

- Database & Auth: Supabase Free Tier (permanent free for MVP scale)

- File Storage: Azure Blob Storage (pay-per-use, hot tier for active assets)

- HTTPS: Automatic HTTPS for all frontend/backend/storage access

## 7. Cleaned MVP Database Design (Supabase Free Tier Compatible + Azure Blob Storage)

All legacy duplicated/flattened experience tables are completely removed. The entire schema is **100% Supabase PostgreSQL compliant**, no data type/constraint modification required. All file attachment URLs point exclusively to the user’s Azure Blob Storage instance instead of third-party cloud storage.

### 7.1 Design Principles

- Completely remove redundant legacy tables and duplicate fields

- Strict two-tier role → gem structure

- Top-level campaign-driven business association

- MVP lightweight, no redundant advanced fields, fully compatible with Supabase free-tier performance & quota limits

### 7.2 Final Standardized Database Schema

#### Table 1: users

User core account information

- user\_id (PK, UUID, Supabase native auto-generated UUID)

- email (UNIQUE, managed by Supabase Auth)

- password\_hash (Supabase native encrypted storage, no custom handling)

- full\_name

- created\_at, updated\_at (Supabase default timestamp)

- email (UNIQUE)

- password\_hash

- full\_name

- created\_at, updated\_at

#### Table 2: job\_hunt\_campaigns (New Top-Level Core Table)

Unified container for single job hunt target, bundling all preparation resources

- campaign\_id (PK, UUID)

- user\_id (FK → users.user\_id)

- campaign\_name (e.g., "2026 Backend Engineer Job Hunt")

- target\_job\_title

- prep\_deadline (user-defined preparation cycle end time)

- created\_at

#### Table 3: job\_roles (Parent Role Container)

Fixed basic information of each job role held by user

- role\_id (PK, UUID)

- user\_id (FK → users.user\_id)

- role\_title

- company\_name

- start\_date, end\_date

- overall\_job\_scope

- is\_archived (Boolean)

- created\_at, updated\_at

#### Table 4: experience\_gems (Fine-grained Achievements, Core Table)

Lightweight small achievements/milestones under each role, editable swiftly

- gem\_id (PK, UUID)

- role\_id (FK → job\_roles.role\_id)

- gem\_title

- gem\_description

- quantified\_achievements

- skill\_tags (STRING ARRAY)

- gem\_category (project / milestone / award / optimization)

- created\_at, updated\_at

#### Table 5: gem\_attachments (Multi-Attachment per Gem)

Support multiple attachments/links bound to one single gem

- attach\_id (PK, UUID)

- gem\_id (FK → experience\_gems.gem\_id)

- attach\_name

- attach\_type

- attach\_url

- created\_at

#### Table 6: job\_jds

Target JD, bound to job hunt campaign

- jd\_id (PK, UUID)

- user\_id (FK → users.user\_id)

- campaign\_id (FK → job\_hunt\_campaigns.campaign\_id)

- job\_title

- jd\_raw\_content

- parsed\_skills (JSONB)

- parsed\_responsibilities (JSONB)

- created\_at

#### Table 7: resume\_templates (Markdown Template Storage)

User-customized markdown resume skeleton templates

- template\_id (PK, UUID)

- user\_id (FK → users.user\_id)

- template\_name

- markdown\_content (core template skeleton with reserved blocks)

- created\_at, updated\_at

#### Table 8: resume\_versions (Generated Resume History)

All auto-generated resume versions, bound to campaign + template + JD

- resume\_version\_id (PK, UUID)

- user\_id (FK → users.user\_id)

- campaign\_id (FK → job\_hunt\_campaigns.campaign\_id)

- template\_id (FK → resume\_templates.template\_id)

- jd\_id (FK → job\_jds.jd\_id)

- matched\_gem\_ids (UUID ARRAY)

- final\_markdown\_content

- pdf\_url

- created\_at

#### Table 9: interview\_question\_pools (Campaign Exclusive Pool)

Independent question bank for each job hunt campaign

- pool\_id (PK, UUID)

- campaign\_id (FK → job\_hunt\_campaigns.campaign\_id)

- question\_type (gem\_experience / skill\_based)

- question\_content

- related\_gem\_ids (UUID ARRAY, for experience questions)

- created\_at

#### Table 10: interview\_practices

User interview practice & AI review records

- practice\_id (PK, UUID)

- pool\_id (FK → interview\_question\_pools.pool\_id)

- campaign\_id (FK → job\_hunt\_campaigns.campaign\_id)

- user\_answer

- ai\_score

- ai\_review

- is\_weak\_point

- created\_at

#### Table 11: skill\_gap\_reports

Campaign-based skill gap analysis result

- report\_id (PK, UUID)

- campaign\_id (FK → job\_hunt\_campaigns.campaign\_id)

- jd\_id (FK → job\_jds.jd\_id)

- user\_existing\_skills (STRING ARRAY)

- gap\_skills (JSONB)

- improve\_suggestions (JSONB)

- created\_at

#### Table 12: learning\_plans

Basic phased learning plan based on gap report

- plan\_id (PK, UUID)

- report\_id (FK → skill\_gap\_reports.report\_id)

- plan\_content (JSONB)

- plan\_status

- created\_at

### 7.3 Final Clean Data Relationship Diagram

users → 1:N job\_hunt\_campaigns

users → 1:N job\_roles / resume\_templates

job\_roles → 1:N experience\_gems → 1:N gem\_attachments

job\_hunt\_campaigns → 1:N job\_jds / resume\_versions / interview\_question\_pools / skill\_gap\_reports

interview\_question\_pools → 1:N interview\_practices

skill\_gap\_reports → 1:N learning\_plans

## 8. MVP Iteration Priority (Clean Unified Version)

**P0 (Blocking Launch)**: Job hunt campaign architecture + hierarchical gem repository + markdown template & JD dual-driven resume generation

**P1 (Core Experience)**: Campaign-based gem/skill dual-type interview question pool + AI answer review

**P2 (Auxiliary Capability)**: Skill gap analysis + basic learning plan generation

> （注：部分内容可能由 AI 生成）
