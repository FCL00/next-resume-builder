'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  scale?: number;
}

export function MinimalTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    sectionVisibility,
    customization,
  } = data;

  const accentColor = customization.accentColor || '#0f172a';

  return (
    <div className="p-9 bg-white text-slate-800 space-y-5 text-xs font-sans">
      {/* Minimal Header */}
      <header className="pb-2">
        <h1 className="text-2xl font-light tracking-tight text-slate-900">
          <strong className="font-semibold">{personalInfo.fullName.split(' ')[0]}</strong>{' '}
          {personalInfo.fullName.split(' ').slice(1).join(' ')}
        </h1>
        <p className="text-xs uppercase tracking-widest text-slate-500 mt-1 font-medium">
          {personalInfo.jobTitle}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-[11px] text-slate-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.city || personalInfo.country) && (
            <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
          )}
          {personalInfo.linkedIn && (
            <span>{personalInfo.linkedIn.replace(/^https?:\/\/(www\.)?/, '')}</span>
          )}
          {personalInfo.github && (
            <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {sectionVisibility.summary && summary && (
        <section className="pt-2 border-t border-slate-100">
          <p className="text-slate-600 leading-relaxed text-[12px]">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {sectionVisibility.experience && experience.length > 0 && (
        <section className="pt-2 border-t border-slate-100">
          <h2 className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((item) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="text-[11px] text-slate-400 sm:col-span-1">
                  {item.startDate} — {item.isCurrent ? 'Present' : item.endDate}
                </div>
                <div className="sm:col-span-3 space-y-1">
                  <div className="font-medium text-slate-900 text-xs">
                    {item.jobTitle} <span className="text-slate-400 font-normal">at</span> {item.company}
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-slate-600 leading-relaxed">{item.description}</p>
                  )}
                  {item.bulletPoints && item.bulletPoints.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-slate-600">
                      {item.bulletPoints.map((bp, i) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {sectionVisibility.projects && projects.length > 0 && (
        <section className="pt-2 border-t border-slate-100">
          <h2 className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
            Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="text-[11px] text-slate-400 sm:col-span-1 font-mono">
                  {proj.technologies?.slice(0, 2).join(', ')}
                </div>
                <div className="sm:col-span-3">
                  <div className="font-medium text-slate-900 text-xs">{proj.name}</div>
                  {proj.description && (
                    <p className="text-[11px] text-slate-600 mt-0.5">{proj.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {sectionVisibility.education && education.length > 0 && (
        <section className="pt-2 border-t border-slate-100">
          <h2 className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="text-[11px] text-slate-400 sm:col-span-1">
                  {edu.startDate} — {edu.endDate}
                </div>
                <div className="sm:col-span-3">
                  <div className="font-medium text-slate-900">
                    {edu.degree} in {edu.fieldOfStudy}
                  </div>
                  <div className="text-[11px] text-slate-500">{edu.school}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {sectionVisibility.skills && (skills.technical.length > 0 || skills.soft.length > 0) && (
        <section className="pt-2 border-t border-slate-100">
          <h2 className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">
            Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="text-[11px] text-slate-400 sm:col-span-1">Expertise</div>
            <div className="sm:col-span-3 text-[11px] text-slate-700 leading-relaxed">
              {[...skills.technical, ...skills.soft].join(' / ')}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
