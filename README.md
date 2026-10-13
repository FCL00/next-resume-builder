# ResumAI — AI Resume Builder SaaS

> A modern, production-ready AI Resume Builder SaaS web application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase PostgreSQL**.

ResumAI gives job seekers complete control over their resume. Users can create, customize, and export professional ATS-friendly resumes manually from scratch or leverage an **optional, user-initiated AI writing assistant** powered by server-side Gemini models to polish descriptions, generate bullet points, and craft executive summaries—without unrequested overwrites or invented metrics.

---

## ✨ Features

- **5 Recruiter-Approved ATS Templates**:
  - `Modern Clean`: Sleek header, badge tags, and contemporary aesthetics.
  - `Classic Executive`: Timeless serif typography, formal centered header, and traditional dividers.
  - `Minimal Swiss`: Clean typographic restraint and generous whitespace.
  - `Corporate Pro`: Structured dual-column executive layout.
  - `Technical Architect`: Developer-centric layout with prominent skills matrices and project stacks.
- **Three-Panel Live Editor**:
  - **Left Panel**: Section navigation, item counters, and eye toggles to hide/show sections without deleting data.
  - **Center Panel**: Form fields with inline, non-intrusive AI assistance buttons.
  - **Right Panel**: Real-time synchronized A4 document preview with zoom controls (50% to 120%).
- **Optional & Non-Destructive AI Assistant**:
  - **Improve Descriptions**: Phrasing enhancements with side-by-side review (Replace, Append, or Cancel).
  - **Bullet Point Generator**: Generates action-verb achievement bullets from job title and responsibilities with selectable checkboxes.
  - **Help Me Write Summary**: Crafts 3–4 sentence executive profiles tailored to desired role, experience level, and tone.
  - **Transform Rough Notes**: Converts casual jottings into crisp, professional bullets.
  - **Zero Metric Hallucinations**: Prompt guardrails ensure the AI never fabricates numbers or unstated credentials.
  - **Zero Background Calls**: If you write manually, **0 tokens** are consumed.
- **High-Fidelity PDF Export**:
  - Direct client-side PDF download via `jsPDF`.
  - Pixel-perfect, selectable-text vector PDF output via browser print with dedicated `@media print` stylesheets.
- **Autosave & Persistence**:
  - 800ms debounced autosave with live status indicator (`"Saving..."` → `"All changes saved"`).
  - Works with Supabase PostgreSQL (Row Level Security enabled) and includes seamless local storage fallback.
- **User Dashboard**:
  - Overview metrics, resume duplication, delete confirmation modals, and flexible resume creation flows (start blank, pick template, or start with sample data).

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase PostgreSQL & Supabase Auth
- **AI Model**: Google Gemini (`gemini-3.8-flash` via server-side `@google/genai` SDK)
- **Icons**: Lucide React
- **Notifications**: Sonner
- **PDF Generation**: jsPDF + Native CSS Print Engine

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/resumai.git
cd resumai
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Fill in your configuration:

```env
# Gemini API Key (Server-only secret for AI writing assistant)
GEMINI_API_KEY="your-gemini-api-key"

# Supabase Configuration (Optional: runs in persistent local mode if blank)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 3. Run Database Migrations (Supabase)

If using Supabase, execute the migration located at `supabase/migrations/20240101000000_init.sql` in your Supabase SQL Editor. This provisions:
- `profiles` table with automated profile creation trigger on signup.
- `resumes` table with JSONB document storage.
- `ai_usage` table for analytics and rate tracking.
- Strict **Row Level Security (RLS)** policies ensuring users only access their own data.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── app/
│   ├── api/ai/               # Server-side Gemini API endpoints
│   │   ├── bullet-points/    # Generates role achievement bullets
│   │   ├── expand/           # Expands rough notes
│   │   ├── improve/          # Polishes descriptions
│   │   └── summary/          # Crafts professional summary
│   ├── dashboard/            # User dashboard & resume management
│   ├── editor/[id]/          # Three-panel resume editor
│   ├── login/ & signup/      # Supabase authentication pages
│   ├── templates/            # Template gallery page
│   ├── settings/             # User settings & connection status
│   ├── globals.css           # Tailwind CSS & print styles
│   └── page.tsx              # SaaS marketing landing page
├── components/
│   ├── ai/                   # AI Review, Bullet Generator, and Summary modals
│   ├── dashboard/            # Dashboard layout, cards, and create modals
│   ├── resume/               # Editor header, sidebar, forms, and preview
│   └── templates/            # 5 ATS resume layout components & renderer
├── lib/
│   ├── auth/                 # AuthContext provider
│   ├── constants/            # Default resume data & template configurations
│   ├── export/               # PDF download and print helpers
│   ├── gemini.ts             # Server-side GoogleGenAI initialization
│   ├── storage/              # Unified resume persistence (Supabase + Local)
│   └── supabase/             # Supabase client initialization
├── supabase/
│   └── migrations/           # PostgreSQL schema, RLS, and triggers
└── types/
    └── resume.ts             # TypeScript definitions for resumes & customizations
```

---

## 🔒 Security & Privacy

- **Server-Side API Calls**: AI API keys are strictly kept server-side and never exposed to client browsers.
- **Row Level Security (RLS)**: PostgreSQL tables enforce `auth.uid() = user_id` for every query, preventing unauthorized data access.
- **Non-Destructive**: AI suggestions never silently overwrite content; changes must be explicitly reviewed and accepted.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
