'use client';

import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, RotateCw, X, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface AIReviewModalProps {
  isOpen: boolean;
  title?: string;
  fieldLabel: string;
  originalText: string;
  suggestedText: string;
  isLoading?: boolean;
  onApplyReplace: (text: string) => void;
  onApplyInsertBelow?: (text: string) => void;
  onTryAgain?: () => void;
  onClose: () => void;
}

export function AIReviewModal({
  isOpen,
  title = 'AI Writing Improvement',
  fieldLabel,
  originalText,
  suggestedText,
  isLoading = false,
  onApplyReplace,
  onApplyInsertBelow,
  onTryAgain,
  onClose,
}: AIReviewModalProps) {
  const [editedText, setEditedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const displayText = editedText !== null ? editedText : suggestedText;

  const handleClose = () => {
    setEditedText(null);
    onClose();
  };

  const handleApply = (mode: 'replace' | 'insert') => {
    if (mode === 'insert' && onApplyInsertBelow) {
      onApplyInsertBelow(displayText);
    } else {
      onApplyReplace(displayText);
    }
    setEditedText(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">
                Review and accept changes for <span className="font-medium text-slate-700">{fieldLabel}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Original Text */}
          {originalText && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Original Draft</span>
                <span className="text-xs text-slate-400">{originalText.length} characters</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 leading-relaxed max-h-36 overflow-y-auto font-normal">
                {originalText}
              </div>
            </div>
          )}

          {/* AI Suggestion */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Suggested Version (Editable)
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(displayText);
                  toast.success('Copied suggestion to clipboard');
                }}
                className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>
            <textarea
              rows={5}
              value={displayText}
              onChange={(e) => setEditedText(e.target.value)}
              placeholder="Suggested text will appear here..."
              className="w-full p-3.5 bg-indigo-50/30 border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg text-sm text-slate-900 leading-relaxed font-normal transition-all resize-y"
            />
            <p className="text-xs text-slate-500 mt-1">
              You can fine-tune or edit this text directly before applying.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onTryAgain && (
              <button
                type="button"
                onClick={() => {
                  setEditedText(null);
                  onTryAgain();
                }}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Generating...' : 'Try Again'}
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onApplyInsertBelow && originalText && (
              <button
                type="button"
                onClick={() => handleApply('insert')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Append Below
              </button>
            )}
            <button
              type="button"
              onClick={() => handleApply('replace')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
