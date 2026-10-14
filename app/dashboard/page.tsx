'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ResumeCard } from '@/components/dashboard/ResumeCard';
import { CreateResumeModal } from '@/components/dashboard/CreateResumeModal';
import { useAuth } from '@/lib/auth/auth-context';
import {
  fetchAllResumes,
  createNewResume,
  duplicateResumeRecord,
  deleteResumeRecord,
} from '@/lib/storage/resume-storage';
import { ResumeRecord, TemplateKey } from '@/types/resume';
import { BLANK_RESUME_DATA, DEFAULT_RESUME_DATA } from '@/lib/constants/default-resume';
import { Plus, Sparkles, FileText, CheckCircle2, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      if (isAuthLoading) return;

      if (!user) {
        setIsLoadingResumes(false);
        setResumes([]);
        return;
      }

      setIsLoadingResumes(true);
      setFetchError(null);

      try {
        const data = await fetchAllResumes(user.id);
        if (isCurrent) {
          setResumes(data);
        }
      } catch (err: any) {
        if (isCurrent) {
          console.error('Failed to load resumes:', err);
          setFetchError(err.message || 'We could not load your resumes. Please try again.');
          toast.error(err.message || 'We could not load your resumes.');
          setResumes([]);
        }
      } finally {
        if (isCurrent) {
          setIsLoadingResumes(false);
        }
      }
    }

    load();

    return () => {
      isCurrent = false;
    };
  }, [user, isAuthLoading]);

  const handleCreate = async ({
    title,
    templateId,
    mode,
  }: {
    title: string;
    templateId: TemplateKey;
    mode: 'scratch' | 'template' | 'sample';
  }) => {
    if (!user) {
      toast.error('Please sign in to create a resume.');
      router.push('/login');
      return;
    }

    setIsCreateModalOpen(false);
    toast.loading('Creating resume...');

    const initialData =
      mode === 'scratch'
        ? JSON.parse(JSON.stringify(BLANK_RESUME_DATA))
        : JSON.parse(JSON.stringify(DEFAULT_RESUME_DATA));

    // Personalize initial resume data to the current authenticated user
    if (user.fullName && user.fullName !== 'User') {
      initialData.personalInfo.fullName = user.fullName;
    }
    if (user.email) {
      initialData.personalInfo.email = user.email;
    }

    try {
      const newResume = await createNewResume({
        userId: user.id,
        title,
        templateId,
        initialData,
      });

      toast.dismiss();
      toast.success('Resume created successfully!');
      router.push(`/editor/${newResume.id}`);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || 'Failed to create resume.');
    }
  };

  const handleDuplicate = async (resume: ResumeRecord) => {
    if (!user) {
      toast.error('Please sign in to duplicate resumes.');
      return;
    }

    toast.loading('Duplicating resume...');
    try {
      const copy = await duplicateResumeRecord(resume, user.id);
      setResumes((prev) => [copy, ...prev]);
      toast.dismiss();
      toast.success('Resume duplicated successfully!');
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || 'Failed to duplicate resume.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      toast.error('Please sign in to delete resumes.');
      return;
    }

    try {
      await deleteResumeRecord(id, user.id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success('Resume deleted.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete resume.');
    }
  };

  // Automatically redirect unauthenticated users to the login route
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [user, isAuthLoading, router]);

  // Auth Loading state & Redirecting state
  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          {isAuthLoading ? 'Loading your account...' : 'Redirecting to sign in...'}
        </p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user.fullName} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your resumes, customize layouts, or craft a new role-targeted version.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs hover:shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">My Resumes</div>
              <div className="text-xl font-bold text-slate-900">{resumes.length}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Account Status</div>
              <div className="text-sm font-semibold text-emerald-700">Authenticated</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">AI Writing Assist</div>
              <div className="text-sm font-semibold text-slate-900">On-Demand</div>
            </div>
          </div>
        </div>

        {/* Resumes Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">My Resumes</h2>
            <span className="text-xs text-slate-400">
              {resumes.length} document{resumes.length !== 1 ? 's' : ''}
            </span>
          </div>

          {fetchError ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between">
              <span>{fetchError}</span>
              <button
                type="button"
                onClick={() => fetchAllResumes(user.id).then(setResumes).catch(() => {})}
                className="font-semibold underline hover:text-rose-900"
              >
                Retry
              </button>
            </div>
          ) : isLoadingResumes ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 rounded-xl bg-slate-200/60 animate-pulse" />
              ))}
            </div>
          ) : resumes.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">No resumes yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  You haven&apos;t created any resumes under this account yet. Click below to start your first one!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Create First Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateResumeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </DashboardLayout>
  );
}
