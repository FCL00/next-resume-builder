'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Download,
  Eye,
  Sliders,
  ChevronDown,
  Layers,
  Zap,
  Lock,
  Star,
  Users,
  Code2,
  Check,
} from 'lucide-react';
import { TEMPLATES_CONFIG, DEFAULT_RESUME_DATA } from '@/lib/constants/default-resume';
import { TemplateKey } from '@/types/resume';
import { ResumeRenderer } from '@/components/templates/ResumeRenderer';

export default function LandingPage() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>('modern');
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  // Preview resume data with dynamic template
  const previewResumeData = {
    ...DEFAULT_RESUME_DATA,
    customization: {
      ...DEFAULT_RESUME_DATA.customization,
      templateId: activeTemplate,
    },
  };

  const faqs = [
    {
      q: 'Is AI assistance mandatory when building my resume?',
      a: 'Absolutely not. ResumAI is designed first and foremost as a high-precision manual resume builder. Every section, field, and layout works completely independently of AI. AI features only run when you explicitly click "Improve with AI", "Generate Bullet Points", or "Help Me Write", and nothing is changed on your resume until you approve it.',
    },
    {
      q: 'Will the AI make up numbers or fake metrics I did not achieve?',
      a: 'Never. We have engineered strict verification guardrails into our Gemini models. If you write "Managed customer support queue", our AI will improve the phrasing and clarity without fabricating arbitrary statistics like "resolved 10,000 tickets" or "boosted satisfaction by 94%" unless you provided those figures.',
    },
    {
      q: 'Are the exported PDF resumes ATS-friendly?',
      a: 'Yes. All templates follow industry-standard typographic hierarchies, clean section headings, standard fonts, and vector text rendering. Applicant Tracking Systems (ATS) can effortlessly parse every word, date, and contact coordinate.',
    },
    {
      q: 'Can I switch templates without losing my entered information?',
      a: 'Yes. All templates share the same validated data foundation. You can switch between Modern, Classic, Minimal, Professional, and Technical templates in one click without losing a single character.',
    },
    {
      q: 'How does autosaving work?',
      a: 'Your changes are automatically saved with debouncing as you type. You will see a subtle "All changes saved" indicator at the top of the editor. You can also manually trigger a save or duplicate your resume anytime.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* ---------------- NAVIGATION ---------------- */}
      <nav className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              R
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">ResumAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#templates" className="hover:text-indigo-600 transition-colors">Resume Templates</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#ai-explained" className="hover:text-indigo-600 transition-colors">Optional AI</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all"
          >
            <span>Build My Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Professional Resume Builder • Optional On-Demand AI</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Build a Resume That Gets You <span className="text-indigo-600">Noticed.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Create a professional resume in minutes. Write it yourself, get optional AI assistance, and turn your experience into a resume you&apos;re proud to share.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <span>Build My Resume</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#templates"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
          >
            <span>Explore Templates</span>
          </a>
        </div>

        {/* Live Product Preview Interactive Container */}
        <div className="pt-10 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
            {/* Mock Editor Window Header */}
            <div className="h-11 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-medium text-slate-500 hidden sm:inline">
                  ResumAI Editor — Live Synchronized Preview
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 hidden sm:inline">Template:</span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                  {TEMPLATES_CONFIG.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTemplate(t.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        activeTemplate === t.id
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Split Screen Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
              {/* Left Mock Forms (5 cols) */}
              <div className="lg:col-span-5 border-r border-slate-200 p-6 text-left bg-white space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Active Section: Work Experience
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Autosaved
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Job Title</label>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
                      Lead Software Engineer
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Company</label>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-medium text-slate-700">
                      TechFlow Systems • San Francisco, CA
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-600 font-medium">Description</label>
                      <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                        <Sparkles className="w-3.5 h-3.5" /> Optional AI Ready
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed text-[11px]">
                      Oversee architectural direction and delivery for the core customer analytics SaaS dashboard.
                    </div>
                  </div>

                  {/* Highlighted AI Suggestion Banner */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50/80 to-blue-50/80 border border-indigo-200/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-indigo-900 font-semibold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Review AI Improvement (Non-Destructive)</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      &ldquo;Architected and deployed a real-time event streaming pipeline processing 12M daily events with 99.98% uptime.&rdquo;
                    </p>
                    <div className="flex gap-2 pt-1">
                      <span className="px-2.5 py-1 text-[10px] font-semibold bg-indigo-600 text-white rounded-md">
                        Apply Changes
                      </span>
                      <span className="px-2.5 py-1 text-[10px] font-medium bg-white text-slate-600 border border-slate-200 rounded-md">
                        Cancel
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Live Document Preview (7 cols) */}
              <div className="lg:col-span-7 bg-slate-100 p-6 flex items-start justify-center overflow-hidden">
                <div className="transform scale-[0.68] sm:scale-[0.78] origin-top transition-transform duration-200 shadow-xl">
                  <ResumeRenderer data={previewResumeData} scale={1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TEMPLATES GALLERY ---------------- */}
      <section id="templates" className="py-20 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Recruiter-Approved Resume Templates
            </h2>
            <p className="text-sm text-slate-600">
              Every template is built with standard ATS typography, consistent margins, and selectable text.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {TEMPLATES_CONFIG.map((t) => {
              const isSelected = activeTemplate === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTemplate(t.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-500/30 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`h-28 ${t.thumbnail} rounded-lg mb-3 p-3 flex flex-col justify-end`}>
                    <div className="bg-white/95 rounded p-1.5 shadow-2xs">
                      <div className="h-1.5 w-12 bg-slate-800 rounded mb-1" />
                      <div className="h-1 w-full bg-slate-200 rounded" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{t.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {t.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <span>Use {TEMPLATES_CONFIG.find((t) => t.id === activeTemplate)?.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES OVERVIEW ---------------- */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Designed for Speed, Integrity, and Impact
          </h2>
          <p className="text-sm text-slate-600">
            A real SaaS tool that empowers your job search without taking away your control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Optional AI Assistant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI is strictly user-initiated. Improve rough notes, craft summaries, and sharpen bullet points with complete review before anything is applied.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Zero Metric Hallucinations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our AI prompts are strictly constrained: it will never invent metrics, credentials, or employers that you did not provide.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Crisp Selectable PDF Export</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export pixel-perfect PDF resumes with selectable text, standard margins, and zero clipping or blurry rasterization.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant Style Customization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Switch color palettes, fonts (Inter, Merriweather, Fira Code), spacing density, and section ordering with immediate visual feedback.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Reliable Autosave</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never worry about losing your work. ResumAI automatically debounces and saves every keystroke with clear status indicators.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Multiple Resume Versions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Duplicate and tailor specific resumes for different job applications, industries, or seniority levels.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">How It Works</h2>
            <p className="text-sm text-slate-600">Three simple steps from draft to recruiter-ready PDF.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Fill Your Experience</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Add your roles, projects, skills, and education. Start from scratch or use our pre-seeded developer profile.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Optional AI Polish</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Click &ldquo;Improve with AI&rdquo; to convert casual descriptions into crisp action-verb bullets. You review every word before accepting.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Export & Apply</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Pick a template, choose your brand accent color, and download a crisp, ATS-certified PDF ready for any application portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- OPTIONAL AI EXPLAINED ---------------- */}
      <section id="ai-explained" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/80 border border-indigo-700 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ethical, User-First AI Guarantee</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            AI Assistance on Your Terms — Never Forced.
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            Most &ldquo;AI resume builders&rdquo; hijack your writing process and produce generic hallucinations. ResumAI does the exact opposite:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="text-xs font-semibold text-indigo-300">✓ 100% User-Initiated</div>
              <p className="text-[11px] text-slate-400">
                Buttons only appear as secondary helpers. If you never click them, AI will never run.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="text-xs font-semibold text-indigo-300">✓ Non-Destructive Review</div>
              <p className="text-[11px] text-slate-400">
                You review the proposed changes side-by-side with your draft. You can replace, append, or cancel.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="text-xs font-semibold text-indigo-300">✓ Grounded in Your Facts</div>
              <p className="text-[11px] text-slate-400">
                The model is explicitly forbidden from inventing unstated metrics, tools, or awards.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="text-xs font-semibold text-indigo-300">✓ Works Without Secrets</div>
              <p className="text-[11px] text-slate-400">
                If the server AI key is not configured, the entire resume editor continues functioning completely normally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PRICING SECTION ---------------- */}
      <section id="pricing" className="py-20 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Transparent Pricing</h2>
            <p className="text-sm text-slate-600">Start free today with no credit card required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Free Tier</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-xs text-slate-500">/ forever</span>
                </div>
                <p className="text-xs text-slate-600">
                  Ideal for crafting and downloading standard job applications.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Unlimited manual edits
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> All 5 ATS resume templates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> High-fidelity PDF exports
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Real-time debounced autosave
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Basic AI writing assistance
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Start for Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-2xl border-2 border-indigo-600 bg-indigo-50/10 shadow-lg space-y-6 flex flex-col justify-between relative">
              <div className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Pro Career Pass</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$12</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-600">
                  For active job seekers applying to multiple specialized roles.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Everything in Free
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Unlimited AI writing improvements
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Role-targeted tailored versions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Priority vector PDF rendering
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Custom branding & font presets
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
              >
                Get Started with Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ACCORDION ---------------- */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-600">Everything you need to know about ResumAI.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left font-semibold text-slate-900 text-xs sm:text-sm flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'transform rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------- CTA BANNER ---------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="bg-indigo-600 rounded-3xl p-10 sm:p-14 text-white shadow-xl space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Build Your Standout Resume?
          </h2>
          <p className="text-indigo-100 text-sm max-w-xl mx-auto">
            Take control of your career story with our clean, reliable editor and optional AI assistance.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-indigo-600 bg-white hover:bg-slate-50 rounded-xl shadow-md transition-all"
            >
              <span>Build My Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              R
            </div>
            <span className="font-bold text-slate-900 text-sm">ResumAI</span>
            <span className="text-slate-400">© {new Date().getFullYear()} ResumAI SaaS. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-slate-800 transition-colors">Features</a>
            <a href="#templates" className="hover:text-slate-800 transition-colors">Templates</a>
            <Link href="/dashboard" className="hover:text-slate-800 transition-colors">Dashboard</Link>
            <Link href="/login" className="hover:text-slate-800 transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
