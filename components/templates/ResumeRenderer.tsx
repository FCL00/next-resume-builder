'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';
import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { TechnicalTemplate } from './TechnicalTemplate';

interface ResumeRendererProps {
  data: ResumeData;
  scale?: number;
  className?: string;
  id?: string;
}

export function ResumeRenderer({
  data,
  scale = 1,
  className = '',
  id = 'resume-preview-container',
}: ResumeRendererProps) {
  const templateId = data.customization?.templateId || 'modern';
  const fontPreset = data.customization?.fontPreset || 'inter';

  const fontClass = {
    inter: 'font-sans',
    merriweather: 'font-serif',
    roboto: 'font-sans',
    'fira-code': 'font-mono',
    playfair: 'font-serif',
  }[fontPreset] || 'font-sans';

  const renderSelectedTemplate = () => {
    switch (templateId) {
      case 'classic':
        return <ClassicTemplate data={data} scale={scale} />;
      case 'minimal':
        return <MinimalTemplate data={data} scale={scale} />;
      case 'professional':
        return <ProfessionalTemplate data={data} scale={scale} />;
      case 'technical':
        return <TechnicalTemplate data={data} scale={scale} />;
      case 'modern':
      default:
        return <ModernTemplate data={data} scale={scale} />;
    }
  };

  return (
    <div
      id={id}
      className={`resume-sheet bg-white shadow-lg border border-slate-200/80 rounded-sm mx-auto overflow-hidden transition-all duration-150 ${fontClass} ${className}`}
      style={{
        width: '210mm',
        minHeight: '297mm', // A4 standard dimensions
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      {renderSelectedTemplate()}
    </div>
  );
}
