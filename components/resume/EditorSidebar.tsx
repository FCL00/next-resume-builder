'use client';

import React from 'react';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderGit2,
  Award,
  Globe2,
  HeartHandshake,
  Trophy,
  Palette,
  Eye,
  EyeOff,
  Plus,
} from 'lucide-react';
import { ResumeData } from '@/types/resume';

export type EditorSectionKey =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'volunteer'
  | 'awards'
  | 'custom'
  | 'design';

interface EditorSidebarProps {
  activeSection: EditorSectionKey;
  onSelectSection: (key: EditorSectionKey) => void;
  data: ResumeData;
  onToggleSectionVisibility: (section: keyof ResumeData['sectionVisibility']) => void;
}

export function EditorSidebar({
  activeSection,
  onSelectSection,
  data,
  onToggleSectionVisibility,
}: EditorSidebarProps) {
  const sections: {
    key: EditorSectionKey;
    label: string;
    icon: React.ElementType;
    visibilityKey?: keyof ResumeData['sectionVisibility'];
    count?: number;
  }[] = [
    { key: 'personal', label: 'Personal Information', icon: User },
    {
      key: 'summary',
      label: 'Professional Summary',
      icon: FileText,
      visibilityKey: 'summary',
    },
    {
      key: 'experience',
      label: 'Work Experience',
      icon: Briefcase,
      visibilityKey: 'experience',
      count: data.experience.length,
    },
    {
      key: 'education',
      label: 'Education',
      icon: GraduationCap,
      visibilityKey: 'education',
      count: data.education.length,
    },
    {
      key: 'skills',
      label: 'Skills',
      icon: Sparkles,
      visibilityKey: 'skills',
      count: data.skills.technical.length + data.skills.soft.length,
    },
    {
      key: 'projects',
      label: 'Projects',
      icon: FolderGit2,
      visibilityKey: 'projects',
      count: data.projects.length,
    },
    {
      key: 'certifications',
      label: 'Certifications',
      icon: Award,
      visibilityKey: 'certifications',
      count: data.certifications.length,
    },
    {
      key: 'languages',
      label: 'Languages',
      icon: Globe2,
      visibilityKey: 'languages',
      count: data.languages.length,
    },
    {
      key: 'volunteer',
      label: 'Volunteer Experience',
      icon: HeartHandshake,
      visibilityKey: 'volunteer',
      count: data.volunteer.length,
    },
    {
      key: 'awards',
      label: 'Awards & Honors',
      icon: Trophy,
      visibilityKey: 'awards',
      count: data.awards.length,
    },
    {
      key: 'design',
      label: 'Template & Design',
      icon: Palette,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white h-full overflow-y-auto p-3 flex flex-col shrink-0">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-2">
        Resume Sections
      </div>

      <nav className="space-y-1 flex-1">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.key;
          const isVisible = sec.visibilityKey ? data.sectionVisibility[sec.visibilityKey] : true;

          return (
            <div
              key={sec.key}
              className={`group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectSection(sec.key)}
                className="flex items-center gap-2.5 flex-1 text-left min-w-0"
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{sec.label}</span>
                {sec.count !== undefined && sec.count > 0 && (
                  <span
                    className={`ml-auto text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-indigo-200/60 text-indigo-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {sec.count}
                  </span>
                )}
              </button>

              {/* Visibility toggle for optional sections */}
              {sec.visibilityKey && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (sec.visibilityKey) onToggleSectionVisibility(sec.visibilityKey);
                  }}
                  title={isVisible ? 'Hide section from resume' : 'Show section in resume'}
                  className={`ml-1.5 p-1 rounded transition-colors ${
                    isVisible
                      ? 'text-slate-300 hover:text-slate-600'
                      : 'text-slate-400 bg-slate-100'
                  }`}
                >
                  {isVisible ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </nav>

      {/* Completion tracker footer */}
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg mt-4">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 mb-1.5">
          <span>Resume Strength</span>
          <span className="text-indigo-600 font-bold">
            {data.personalInfo.fullName && data.experience.length > 0 && data.skills.technical.length > 0
              ? '95%'
              : data.personalInfo.fullName
              ? '60%'
              : '25%'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{
              width:
                data.personalInfo.fullName && data.experience.length > 0 && data.skills.technical.length > 0
                  ? '95%'
                  : data.personalInfo.fullName
                  ? '60%'
                  : '25%',
            }}
          />
        </div>
      </div>
    </aside>
  );
}
