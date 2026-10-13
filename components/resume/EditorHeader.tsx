'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Cloud,
  Download,
  Printer,
  Sparkles,
  Layout,
  Share2,
  Save,
  Loader2,
  Palette,
} from 'lucide-react';
import { TemplateKey } from '@/types/resume';
import { TEMPLATES_CONFIG } from '@/lib/constants/default-resume';
import { printResume, downloadResumeAsPdf } from '@/lib/export/pdf-export';
import { toast } from 'sonner';

interface EditorHeaderProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  saveStatus: 'saved' | 'saving' | 'error';
  templateId: TemplateKey;
  onTemplateChange: (t: TemplateKey) => void;
  onManualSave: () => void;
  activeViewMobile: 'edit' | 'preview';
  setActiveViewMobile: (v: 'edit' | 'preview') => void;
}

export function EditorHeader({
  title,
  onTitleChange,
  saveStatus,
  templateId,
  onTemplateChange,
  onManualSave,
  activeViewMobile,
  setActiveViewMobile,
}: EditorHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [isExporting, setIsExporting] = useState(false);

  const handleFinishTitle = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim() && tempTitle !== title) {
      onTitleChange(tempTitle.trim());
    }
  };

  const handleDownload = async () => {
    setIsExporting(true);
    await downloadResumeAsPdf(title);
    setIsExporting(false);
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        <div>
          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              autoFocus
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleFinishTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleFinishTitle()}
              className="font-semibold text-slate-900 text-sm px-2 py-0.5 border border-indigo-300 rounded focus:outline-indigo-500"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setTempTitle(title);
                setIsEditingTitle(true);
              }}
              className="text-left font-semibold text-slate-900 text-sm hover:text-indigo-600 transition-colors flex items-center gap-1.5"
              title="Click to rename"
            >
              <span className="truncate max-w-[200px] sm:max-w-xs">{title}</span>
              <span className="text-[10px] text-slate-400 font-normal border border-slate-200 rounded px-1 hidden sm:inline">
                Rename
              </span>
            </button>
          )}

          {/* Autosave status indicator */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3 h-3 text-indigo-500 animate-spin" />
                <span>Saving changes...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span>All changes saved</span>
              </>
            )}
            {saveStatus === 'error' && (
              <span className="text-rose-500">Auto-save error</span>
            )}
          </div>
        </div>
      </div>

      {/* Middle: Mobile toggle between Editor and Preview */}
      <div className="flex sm:hidden bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveViewMobile('edit')}
          className={`px-3 py-1 rounded-md transition-all ${
            activeViewMobile === 'edit'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600'
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setActiveViewMobile('preview')}
          className={`px-3 py-1 rounded-md transition-all ${
            activeViewMobile === 'preview'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600'
          }`}
        >
          Preview
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Template Quick Switcher */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
          {TEMPLATES_CONFIG.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTemplateChange(t.id)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                templateId === t.id
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Manual Save */}
        <button
          type="button"
          onClick={onManualSave}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          title="Save to database now"
        >
          <Save className="w-3.5 h-3.5 text-slate-500" />
          <span>Save</span>
        </button>

        {/* Print / Clean PDF via Browser */}
        <button
          type="button"
          onClick={printResume}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          title="Print or Save as PDF via browser print"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Print</span>
        </button>

        {/* Download PDF Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>Download PDF</span>
        </button>
      </div>
    </header>
  );
}
