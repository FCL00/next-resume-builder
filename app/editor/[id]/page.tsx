'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EditorHeader } from '@/components/resume/EditorHeader';
import { EditorSidebar, EditorSectionKey } from '@/components/resume/EditorSidebar';
import { EditorForm } from '@/components/resume/EditorForm';
import { EditorPreview } from '@/components/resume/EditorPreview';
import { fetchResumeById, saveResumeRecord } from '@/lib/storage/resume-storage';
import { ResumeRecord, ResumeData, TemplateKey } from '@/types/resume';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from 'sonner';
import { Loader2, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResumeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;
  const { user, isLoading: isAuthLoading } = useAuth();

  const [resumeRecord, setResumeRecord] = useState<ResumeRecord | null>(null);
  const [activeSection, setActiveSection] = useState<EditorSectionKey>('personal');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [activeViewMobile, setActiveViewMobile] = useState<'edit' | 'preview'>('edit');
  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Debounce autosave ref
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentRecordRef = useRef<ResumeRecord | null>(null);

  useEffect(() => {
    currentRecordRef.current = resumeRecord;
  }, [resumeRecord]);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/editor/${resumeId}`)}`);
    }
  }, [user, isAuthLoading, resumeId, router]);

  // Load resume data once user is authenticated
  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      if (isAuthLoading) return;

      if (!user) {
        setIsLoadingResume(false);
        return;
      }

      setIsLoadingResume(true);
      setLoadError(null);

      try {
        const record = await fetchResumeById(resumeId, user.id);
        if (!isCurrent) return;

        if (!record) {
          setLoadError('Resume not found or you do not have permission to access it.');
          toast.error('Resume not found or access denied.');
          return;
        }

        setResumeRecord(record);
      } catch (err: any) {
        if (!isCurrent) return;
        console.error('Failed to load resume:', err);
        setLoadError(err.message || 'Failed to load resume.');
        toast.error(err.message || 'Failed to load resume.');
      } finally {
        if (isCurrent) {
          setIsLoadingResume(false);
        }
      }
    }

    loadData();

    return () => {
      isCurrent = false;
    };
  }, [resumeId, user, isAuthLoading]);

  // Debounced auto-save function
  const triggerAutoSave = useCallback((updatedRecord: ResumeRecord) => {
    if (!user) return;
    setSaveStatus('saving');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveResumeRecord(updatedRecord, user.id);
        setSaveStatus('saved');
      } catch (err: any) {
        console.error('Failed to autosave:', err);
        setSaveStatus('error');
        toast.error(err.message || 'Failed to save resume.');
      }
    }, 800);
  }, [user]);

  // Update resume data from editor
  const handleDataChange = (newData: ResumeData) => {
    if (!resumeRecord || !user) return;
    const updated: ResumeRecord = {
      ...resumeRecord,
      user_id: user.id, // Strictly preserve user ownership
      data: newData,
      updated_at: new Date().toISOString(),
    };
    setResumeRecord(updated);
    triggerAutoSave(updated);
  };

  // Update title
  const handleTitleChange = (newTitle: string) => {
    if (!resumeRecord || !user) return;
    const updated: ResumeRecord = {
      ...resumeRecord,
      user_id: user.id,
      title: newTitle,
      updated_at: new Date().toISOString(),
    };
    setResumeRecord(updated);
    triggerAutoSave(updated);
    toast.success('Title updated');
  };

  // Switch template
  const handleTemplateChange = (templateId: TemplateKey) => {
    if (!resumeRecord || !user) return;
    const updated: ResumeRecord = {
      ...resumeRecord,
      user_id: user.id,
      data: {
        ...resumeRecord.data,
        customization: {
          ...resumeRecord.data.customization,
          templateId,
        },
      },
    };
    setResumeRecord(updated);
    triggerAutoSave(updated);
    toast.success(`Switched to ${templateId} template`);
  };

  // Toggle section visibility
  const handleToggleSectionVisibility = (sectionKey: keyof ResumeData['sectionVisibility']) => {
    if (!resumeRecord || !user) return;
    const current = resumeRecord.data.sectionVisibility[sectionKey];
    const updated: ResumeRecord = {
      ...resumeRecord,
      user_id: user.id,
      data: {
        ...resumeRecord.data,
        sectionVisibility: {
          ...resumeRecord.data.sectionVisibility,
          [sectionKey]: !current,
        },
      },
    };
    setResumeRecord(updated);
    triggerAutoSave(updated);
    toast.info(`${!current ? 'Showing' : 'Hiding'} ${sectionKey} on resume`);
  };

  // Manual save
  const handleManualSave = async () => {
    if (!resumeRecord || !user) {
      toast.error('Authentication required to save resume.');
      return;
    }
    setSaveStatus('saving');
    try {
      await saveResumeRecord(resumeRecord, user.id);
      setSaveStatus('saved');
      toast.success('Saved to database');
    } catch (e: any) {
      setSaveStatus('error');
      toast.error(e.message || 'Save failed');
    }
  };

  // Cleanup timeout on unmount and flush pending save
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current && currentRecordRef.current && user) {
        clearTimeout(saveTimeoutRef.current);
        saveResumeRecord(currentRecordRef.current, user.id).catch(() => {});
      }
    };
  }, [user]);

  if (isAuthLoading || isLoadingResume) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="text-sm font-medium text-slate-600">Loading your resume workspace...</span>
      </div>
    );
  }

  // Not authenticated or permission error
  if (!user || loadError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full shadow-xs space-y-5">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {loadError || 'You must be signed in to view or edit this resume.'}
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            {!user ? (
              <Link
                href="/login"
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
              >
                Sign In
              </Link>
            ) : null}
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!resumeRecord) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* Top Header */}
      <EditorHeader
        title={resumeRecord.title}
        onTitleChange={handleTitleChange}
        saveStatus={saveStatus}
        templateId={resumeRecord.data.customization.templateId}
        onTemplateChange={handleTemplateChange}
        onManualSave={handleManualSave}
        activeViewMobile={activeViewMobile}
        setActiveViewMobile={setActiveViewMobile}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={`hidden md:block shrink-0 ${activeViewMobile === 'preview' ? 'hidden' : ''}`}>
          <EditorSidebar
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            data={resumeRecord.data}
            onToggleSectionVisibility={handleToggleSectionVisibility}
          />
        </div>

        {/* Center Panel: Editable Forms */}
        <div
          className={`w-full md:w-[480px] lg:w-[540px] xl:w-[600px] shrink-0 border-r border-slate-200 bg-white h-full overflow-y-auto p-6 md:p-8 ${
            activeViewMobile === 'preview' ? 'hidden md:block' : 'block'
          }`}
        >
          {/* Mobile section pills */}
          <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-4 mb-4 border-b border-slate-100 no-scrollbar">
            {(
              [
                ['personal', 'Personal'],
                ['summary', 'Summary'],
                ['experience', 'Experience'],
                ['education', 'Education'],
                ['skills', 'Skills'],
                ['projects', 'Projects'],
                ['design', 'Design'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSection(key as EditorSectionKey)}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap font-medium transition-colors ${
                  activeSection === key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <EditorForm
            activeSection={activeSection}
            data={resumeRecord.data}
            onChange={handleDataChange}
          />
        </div>

        {/* Right Panel: Live Resume Preview */}
        <div
          className={`flex-1 h-full min-w-0 ${
            activeViewMobile === 'edit' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <EditorPreview data={resumeRecord.data} title={resumeRecord.title} />
        </div>
      </div>
    </div>
  );
}
