'use client';

import React, { useState } from 'react';
import { Sparkles, Check, X, Plus, Trash2, ListPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AIBulletGeneratorModalProps {
  isOpen: boolean;
  defaultJobTitle?: string;
  defaultCompany?: string;
  onAddBullets: (bullets: string[]) => void;
  onClose: () => void;
}

export function AIBulletGeneratorModal({
  isOpen,
  defaultJobTitle = '',
  defaultCompany = '',
  onAddBullets,
  onClose,
}: AIBulletGeneratorModalProps) {
  const [jobTitle, setJobTitle] = useState(defaultJobTitle);
  const [company, setCompany] = useState(defaultCompany);
  const [responsibilities, setResponsibilities] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [achievements, setAchievements] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedBullets, setGeneratedBullets] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    setGeneratedBullets([]);
    setSelectedIndices(new Set());
    onClose();
  };

  const handleGenerate = async () => {
    if (!jobTitle && !responsibilities) {
      toast.error('Please enter at least a Job Title or some Responsibilities.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/bullet-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          company,
          responsibilities,
          technologies,
          achievements,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate bullet points');
      }

      if (data.bullets && data.bullets.length > 0) {
        setGeneratedBullets(data.bullets);
        // Default select all
        setSelectedIndices(new Set(data.bullets.map((_: any, idx: number) => idx)));
        toast.success(`Generated ${data.bullets.length} bullet points!`);
      } else {
        toast.info('No bullets generated. Try providing more details.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error communicating with AI service');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (index: number) => {
    const next = new Set(selectedIndices);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedIndices(next);
  };

  const handleUpdateBullet = (index: number, val: string) => {
    const updated = [...generatedBullets];
    updated[index] = val;
    setGeneratedBullets(updated);
  };

  const handleDeleteBullet = (index: number) => {
    const updated = generatedBullets.filter((_, i) => i !== index);
    setGeneratedBullets(updated);
    const next = new Set<number>();
    selectedIndices.forEach((i) => {
      if (i < index) next.add(i);
      else if (i > index) next.add(i - 1);
    });
    setSelectedIndices(next);
  };

  const handleInsert = () => {
    const chosen = generatedBullets.filter((_, idx) => selectedIndices.has(idx)).filter((b) => b.trim().length > 0);
    if (chosen.length === 0) {
      toast.error('Please select at least one bullet point to add.');
      return;
    }
    onAddBullets(chosen);
    toast.success(`Added ${chosen.length} bullet point${chosen.length > 1 ? 's' : ''}`);
    handleResetAndClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ListPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">AI Bullet Point Generator</h3>
              <p className="text-xs text-slate-500">Provide role context to generate tailored, impactful bullet points</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form & Results */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {generatedBullets.length === 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Company / Industry</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Stripe / Fintech SaaS"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Key Tasks / Responsibilities *
                </label>
                <textarea
                  rows={3}
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="e.g. Led redesign of the checkout funnel, fixed performance bottlenecks, managed junior dev onboarding..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tools / Technologies Used</label>
                  <input
                    type="text"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder="e.g. Next.js, React, GraphQL, Jest"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Known Results (Optional)
                  </label>
                  <input
                    type="text"
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    placeholder="e.g. Cut load times by 30%, shipped on time"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-800 leading-relaxed">
                <strong>Honest AI Principle:</strong> The assistant will only build on what you provide. It will not fabricate arbitrary metrics or unmentioned credentials.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Select and Edit Bullet Points
                </span>
                <button
                  type="button"
                  onClick={() => setGeneratedBullets([])}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Back to Parameters
                </button>
              </div>

              <div className="space-y-2.5">
                {generatedBullets.map((bullet, idx) => {
                  const isSelected = selectedIndices.has(idx);
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-indigo-300 bg-indigo-50/20'
                          : 'border-slate-200 bg-slate-50/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(idx)}
                          className="mt-1 h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => handleUpdateBullet(idx, e.target.value)}
                          className="flex-1 text-xs text-slate-900 bg-transparent border-none p-0 focus:ring-0 resize-y leading-relaxed"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteBullet(idx)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                          title="Remove bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
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

          {generatedBullets.length === 0 ? (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Bullet Points
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Regenerate
              </button>
              <button
                type="button"
                onClick={handleInsert}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Selected to Resume ({selectedIndices.size})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
