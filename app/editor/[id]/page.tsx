'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EditorHeader } from '@/components/resume/EditorHeader';
import { EditorSidebar, EditorSectionKey } from '@/components/resume/EditorSidebar';
import { EditorForm } from '@/components/resume/EditorForm';
import { EditorPreview } from '@/components/resume/EditorPreview';
import { fetchResumeById, saveResumeRecord } from '@/lib/storage/resume-storage';
import { ResumeRecord, ResumeData, TemplateKey } from '@/types/resume';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ResumeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;

  const [resumeRecord, setResumeRecord] = useState<ResumeRecord | null>(null);
  const [activeSection, setActiveSection] = useState<EditorSectionKey>('personal');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [activeViewMobile, setActiveViewMobile] = useState<'edit' | 'preview'>('edit');
  const [isLoading, setIsLoading] = useState(true);

  // Debounce autosave ref
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentRecordRef = useRef<ResumeRecord | null>(null);

  useEffect(() => {
    currentRecordRef.current = resumeRecord;
  }, [resumeRecord]);

  // Load resume data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const record = await fetchResumeById(resumeId);
      if (!record) {
        toast.error('Resume not found. Returning to dashboard...');
        router.push('/dashboard');
        return;
      }
      setResumeRecord(record);
      setIsLoading(false);
    }
    loadData();
  }, [resumeId, router]);

  // Debounced auto-save function
  const triggerAutoSave = useCallback((updatedRecord: ResumeRecord) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveResumeRecord(updatedRecord);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to autosave:', err);
        setSaveStatus('error');
      }
    }, 800);
  }, []);

  // Update resume data from editor
  const handleDataChange = (newData: ResumeData) => {
    if (!resumeRecord) return;
    const updated = {
      ...resumeRecord,
      data: newData,
      updated_at: new Date().toISOString(),
    };
    setResumeRecord(updated);
    triggerAutoSave(updated);
  };

  // Update title
  const handleTitleChange = (newTitle: string) => {
    if (!resumeRecord) return;
    const updated = {
      ...resumeRecord,
      title: newTitle,
      updated_at: new Date().toISOString(),
    };
    setResumeRecord(updated);
    triggerAutoSave(updated);
    toast.success('Title updated');
  };

  // Switch template
  const handleTemplateChange = (templateId: TemplateKey) => {
    if (!resumeRecord) return;
    const updated = {
      ...resumeRecord,
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
    if (!resumeRecord) return;
    const current = resumeRecord.data.sectionVisibility[sectionKey];
    const updated = {
      ...resumeRecord,
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
    if (!resumeRecord) return;
    setSaveStatus('saving');
    try {
      await saveResumeRecord(resumeRecord);
      setSaveStatus('saved');
      toast.success('Saved to database');
    } catch (e) {
      setSaveStatus('error');
      toast.error('Save failed');
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current && currentRecordRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveResumeRecord(currentRecordRef.current);
      }
    };
  }, []);

  if (isLoading || !resumeRecord) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="text-sm font-medium text-slate-600">Loading your resume workspace...</span>
      </div>
    );
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
        {/* Left Sidebar (Desktop always, mobile hidden if in preview) */}
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
