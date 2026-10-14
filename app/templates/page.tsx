'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TEMPLATES_CONFIG, DEFAULT_RESUME_DATA } from '@/lib/constants/default-resume';
import { TemplateKey } from '@/types/resume';
import { createNewResume } from '@/lib/storage/resume-storage';
import { useAuth } from '@/lib/auth/auth-context';
import { ArrowRight, Check, Sparkles, LayoutTemplate, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TemplatesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('modern');

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login?redirect=/templates');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          {isLoading ? 'Loading templates...' : 'Redirecting to sign in...'}
        </p>
      </div>
    );
  }

  const handleCreateWithTemplate = async (templateId: TemplateKey) => {
    if (!user) {
      toast.error('Please sign in to create a resume.');
      router.push('/login?redirect=/templates');
      return;
    }

    toast.loading('Initializing template...');
    try {
      const initialData = JSON.parse(JSON.stringify(DEFAULT_RESUME_DATA));
      if (user.fullName && user.fullName !== 'User') {
        initialData.personalInfo.fullName = user.fullName;
      }
      if (user.email) {
        initialData.personalInfo.email = user.email;
      }

      const newResume = await createNewResume({
        userId: user.id,
        title: `${TEMPLATES_CONFIG.find((t) => t.id === templateId)?.name} Resume`,
        templateId,
        initialData,
      });
      toast.dismiss();
      toast.success('Resume created!');
      router.push(`/editor/${newResume.id}`);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || 'Failed to create resume.');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resume Templates</h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose from our ATS-optimized, recruiter-tested layouts. Switch anytime without losing your content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES_CONFIG.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className={`h-48 ${t.thumbnail} p-6 flex flex-col justify-between border-b border-slate-100`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-slate-800 shadow-2xs">
                    {t.badge}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white/80 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ATS 100%
                  </div>
                </div>

                <div className="bg-white/95 rounded-lg p-3 shadow-xs">
                  <div className="h-2.5 w-28 bg-slate-800 rounded mb-1.5" />
                  <div className="h-2 w-36 bg-slate-300 rounded mb-2" />
                  <div className="h-1.5 w-full bg-slate-200 rounded mb-1" />
                  <div className="h-1.5 w-4/5 bg-slate-200 rounded" />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t.name}</h3>
                  <p className="text-xs text-indigo-600 font-medium mt-0.5">{t.tagline}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCreateWithTemplate(t.id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
