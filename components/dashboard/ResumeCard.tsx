'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ResumeRecord } from '@/types/resume';
import {
  FileText,
  Clock,
  MoreVertical,
  Copy,
  Trash2,
  Download,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { TEMPLATES_CONFIG } from '@/lib/constants/default-resume';
import { downloadResumeAsPdf } from '@/lib/export/pdf-export';

interface ResumeCardProps {
  resume: ResumeRecord;
  onDuplicate: (resume: ResumeRecord) => void;
  onDelete: (id: string) => void;
}

export function ResumeCard({ resume, onDuplicate, onDelete }: ResumeCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const templateInfo = TEMPLATES_CONFIG.find(
    (t) => t.id === resume.data.customization.templateId
  ) || TEMPLATES_CONFIG[0];

  const dateFormatted = new Date(resume.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Top Visual Mini-Preview */}
      <Link
        href={`/editor/${resume.id}`}
        className={`h-40 ${templateInfo.thumbnail} p-4 flex flex-col justify-between border-b border-slate-100 relative overflow-hidden`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-slate-700 shadow-2xs backdrop-blur-xs">
            {templateInfo.name}
          </span>
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: resume.data.customization.accentColor || '#3b82f6' }}
            title="Accent Color"
          />
        </div>

        {/* Realistic mini mock text */}
        <div className="bg-white/95 rounded p-2.5 shadow-xs text-left pointer-events-none transform group-hover:-translate-y-0.5 transition-transform">
          <div className="h-2 w-20 bg-slate-800 rounded mb-1" />
          <div className="h-1.5 w-28 bg-slate-300 rounded mb-2" />
          <div className="space-y-1">
            <div className="h-1 w-full bg-slate-200 rounded" />
            <div className="h-1 w-5/6 bg-slate-200 rounded" />
          </div>
        </div>

        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-indigo-600 text-xs font-semibold rounded-lg shadow-sm transition-all transform scale-95 group-hover:scale-100">
            <Edit3 className="w-3.5 h-3.5" />
            Open Editor
          </span>
        </div>
      </Link>

      {/* Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/editor/${resume.id}`}
              className="font-semibold text-slate-900 text-sm hover:text-indigo-600 transition-colors line-clamp-1"
            >
              {resume.title}
            </Link>

            {/* Overflow Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-40 py-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onDuplicate(resume);
                      }}
                      className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
            <Clock className="w-3 h-3" />
            <span>Updated {dateFormatted}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link
            href={`/editor/${resume.id}`}
            className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
          >
            Edit Resume
          </Link>

          <button
            type="button"
            onClick={() => onDuplicate(resume)}
            className="text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-50"
            title="Duplicate Resume"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-5 max-w-sm w-full space-y-4">
            <h4 className="text-sm font-semibold text-slate-900">Delete Resume?</h4>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete <strong className="text-slate-800">&ldquo;{resume.title}&rdquo;</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDelete(resume.id);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
