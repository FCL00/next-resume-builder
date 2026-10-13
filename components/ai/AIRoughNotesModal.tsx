'use client';

import React, { useState } from 'react';
import { Sparkles, Check, X, Loader2, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AIRoughNotesModalProps {
  isOpen: boolean;
  roleTitle?: string;
  onAddBullets: (bullets: string[]) => void;
  onClose: () => void;
}

export function AIRoughNotesModal({
  isOpen,
  roleTitle = '',
  onAddBullets,
  onClose,
}: AIRoughNotesModalProps) {
  const [roughNotes, setRoughNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bullets, setBullets] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    setRoughNotes('');
    setBullets([]);
    onClose();
  };

  const handleExpand = async () => {
    if (!roughNotes.trim()) {
      toast.error('Please enter your rough notes first.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roughNotes,
          roleTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to expand notes');
      }

      if (data.bullets && data.bullets.length > 0) {
        setBullets(data.bullets);
        toast.success(`Turned notes into ${data.bullets.length} professional points!`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error processing rough notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (bullets.length === 0) return;
    onAddBullets(bullets);
    toast.success('Added points to section');
    handleResetAndClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Transform Rough Notes</h3>
              <p className="text-xs text-slate-500">Quickly turn informal thoughts or bullets into polished resume lines</p>
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
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Your Quick Notes or Jotting {roleTitle ? `(for ${roleTitle})` : ''}
            </label>
            <textarea
              rows={4}
              value={roughNotes}
              onChange={(e) => setRoughNotes(e.target.value)}
              placeholder="e.g. Built ecommerce website using React. Worked on checkout and product pages. Fixed slow database queries."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500 resize-y"
            />
          </div>

          {bullets.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Refined Resume Points
              </span>
              <div className="space-y-2 bg-indigo-50/30 p-3 rounded-lg border border-indigo-100">
                {bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                    <span className="text-indigo-500 font-bold">•</span>
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const next = [...bullets];
                        next[idx] = e.target.value;
                        setBullets(next);
                      }}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs text-slate-800"
                    />
                  </div>
                ))}
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExpand}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Transforming...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  {bullets.length > 0 ? 'Regenerate' : 'Transform Notes'}
                </>
              )}
            </button>

            {bullets.length > 0 && (
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to Experience
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
