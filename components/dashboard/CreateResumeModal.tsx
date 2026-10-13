'use client';

import React, { useState } from 'react';
import { X, Sparkles, FileText, Copy, LayoutTemplate, ArrowRight } from 'lucide-react';
import { TemplateKey, ResumeData } from '@/types/resume';
import { TEMPLATES_CONFIG, DEFAULT_RESUME_DATA, BLANK_RESUME_DATA } from '@/lib/constants/default-resume';

interface CreateResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (options: {
    title: string;
    templateId: TemplateKey;
    mode: 'scratch' | 'template' | 'sample';
  }) => void;
}

export function CreateResumeModal({
  isOpen,
  onClose,
  onCreate,
}: CreateResumeModalProps) {
  const [title, setTitle] = useState('My New Resume');
  const [templateId, setTemplateId] = useState<TemplateKey>('modern');
  const [mode, setMode] = useState<'scratch' | 'template' | 'sample'>('sample');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      title: title.trim() || 'Untitled Resume',
      templateId,
      mode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Create New Resume</h3>
            <p className="text-xs text-slate-500">Choose a starting mode, template, and resume title</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Resume Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Resume Name / Target Role
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer - Google"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
          </div>

          {/* Starting Strategy Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Starting Point
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setMode('sample')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'sample'
                    ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-900">With Sample Data</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Pre-populated example to edit</div>
              </button>

              <button
                type="button"
                onClick={() => setMode('scratch')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'scratch'
                    ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-2">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-900">Start from Scratch</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Clean blank slate</div>
              </button>

              <button
                type="button"
                onClick={() => setMode('template')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'template'
                    ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-900">Choose Template</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Focus on visual structure</div>
              </button>
            </div>
          </div>

          {/* Template Choices */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Select Starting Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TEMPLATES_CONFIG.map((t) => {
                const isSelected = templateId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplateId(t.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 font-semibold text-indigo-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs">{t.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{t.badge}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <span>Enter Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
