'use client';

import React, { useState } from 'react';
import { Sparkles, Check, X, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface AISummaryModalProps {
  isOpen: boolean;
  defaultRole?: string;
  defaultSkills?: string;
  existingSummary?: string;
  onApplySummary: (summary: string) => void;
  onClose: () => void;
}

export function AISummaryModal({
  isOpen,
  defaultRole = '',
  defaultSkills = '',
  existingSummary = '',
  onApplySummary,
  onClose,
}: AISummaryModalProps) {
  const [desiredRole, setDesiredRole] = useState(defaultRole);
  const [experienceLevel, setExperienceLevel] = useState('Mid-Senior (4-8 years)');
  const [preferredTone, setPreferredTone] = useState('Executive & Impactful');
  const [keySkills, setKeySkills] = useState(defaultSkills);
  const [targetIndustry, setTargetIndustry] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    setGeneratedSummary('');
    onClose();
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desiredRole,
          experienceLevel,
          preferredTone,
          keySkills,
          targetIndustry,
          existingSummary,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to craft summary');
      }

      if (data.summary) {
        setGeneratedSummary(data.summary);
        toast.success('Professional summary crafted!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error crafting summary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Summary Writing Assistant</h3>
              <p className="text-xs text-slate-500">Configure parameters to generate a targeted executive summary</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target / Desired Role</label>
              <input
                type="text"
                value={desiredRole}
                onChange={(e) => setDesiredRole(e.target.value)}
                placeholder="e.g. Staff Software Engineer / Engineering Manager"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Industry / Domain</label>
              <input
                type="text"
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
                placeholder="e.g. Cloud Infrastructure, FinTech, Healthcare"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500 bg-white"
              >
                <option value="Entry-Level (0-2 years)">Entry-Level (0-2 years)</option>
                <option value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</option>
                <option value="Senior (5-8 years)">Senior (5-8 years)</option>
                <option value="Lead / Principal (8+ years)">Lead / Principal (8+ years)</option>
                <option value="Director / Executive (10+ years)">Director / Executive (10+ years)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Tone</label>
              <select
                value={preferredTone}
                onChange={(e) => setPreferredTone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500 bg-white"
              >
                <option value="Executive & Impactful">Executive & Impactful</option>
                <option value="Technical & Analytical">Technical & Analytical</option>
                <option value="Concise & Results-Focused">Concise & Results-Focused</option>
                <option value="Modern & Collaborative">Modern & Collaborative</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Key Skills or Specialties to Highlight
            </label>
            <input
              type="text"
              value={keySkills}
              onChange={(e) => setKeySkills(e.target.value)}
              placeholder="e.g. Distributed Systems, React, High-Throughput Architectures, Mentorship"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
          </div>

          {generatedSummary && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Generated Summary (Editable)
                </span>
              </div>
              <textarea
                rows={4}
                value={generatedSummary}
                onChange={(e) => setGeneratedSummary(e.target.value)}
                className="w-full p-3.5 bg-indigo-50/30 border border-indigo-200 rounded-lg text-sm text-slate-900 leading-relaxed focus:outline-indigo-500 resize-y"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Crafting...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  {generatedSummary ? 'Regenerate' : 'Craft Summary'}
                </>
              )}
            </button>

            {generatedSummary && (
              <button
                type="button"
                onClick={() => {
                  onApplySummary(generatedSummary);
                  toast.success('Applied professional summary to resume');
                  handleResetAndClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Apply to Resume
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
