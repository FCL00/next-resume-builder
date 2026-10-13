'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { ResumeRenderer } from '@/components/templates/ResumeRenderer';
import { ZoomIn, ZoomOut, RotateCcw, Printer, Download, Eye } from 'lucide-react';
import { printResume, downloadResumeAsPdf } from '@/lib/export/pdf-export';

interface EditorPreviewProps {
  data: ResumeData;
  title: string;
}

export function EditorPreview({ data, title }: EditorPreviewProps) {
  const [scale, setScale] = useState(0.85);

  const handleZoomIn = () => setScale((s) => Math.min(1.2, +(s + 0.05).toFixed(2)));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.05).toFixed(2)));
  const handleResetZoom = () => setScale(0.85);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
      {/* Top Floating Preview Bar */}
      <div className="h-11 bg-white/90 backdrop-blur-xs border-b border-slate-200 px-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <Eye className="w-3.5 h-3.5 text-indigo-600" />
          <span>Live Document Preview (A4)</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="p-1 hover:bg-white text-slate-600 rounded disabled:opacity-40 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-1.5 min-w-[42px] text-center text-slate-700">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 1.2}
            className="p-1 hover:bg-white text-slate-600 rounded disabled:opacity-40 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1 hover:bg-white text-slate-400 hover:text-slate-700 rounded transition-colors ml-0.5"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Sheet Container with realistic scroll */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          className="transition-transform duration-100 ease-out origin-top flex justify-center"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <ResumeRenderer data={data} scale={1} />
        </div>
      </div>
    </div>
  );
}
