'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';
import { Terminal, Code, Cpu, Globe, Github, Mail, Phone, ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  scale?: number;
}

export function TechnicalTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    sectionVisibility,
    customization,
  } = data;

  const accentColor = customization.accentColor || '#059669';

  return (
    <div className="p-8 bg-white text-slate-800 space-y-4 text-xs font-sans">
      {/* Header */}
      <header className="border-b-2 border-slate-800 pb-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {personalInfo.fullName}
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mt-0.5">
              {personalInfo.jobTitle}
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-600 font-mono space-y-0.5">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {(personalInfo.city || personalInfo.country) && (
              <div>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</div>
            )}
          </div>
        </div>

        {/* Links bar */}
        <div className="flex flex-wrap gap-4 mt-2 text-[11px] text-slate-600 font-mono">
          {personalInfo.github && (
            <span className="inline-flex items-center gap-1">
              <Github className="w-3 h-3 text-slate-700" />
              {personalInfo.github.replace(/^https?:\/\//, '')}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-700" />
              {personalInfo.portfolio.replace(/^https?:\/\//, '')}
            </span>
          )}
          {personalInfo.linkedIn && (
            <span className="inline-flex items-center gap-1">
              {personalInfo.linkedIn.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/')}
            </span>
          )}
        </div>
      </header>

      {/* Technical Skills Matrix - Top priority in technical resumes */}
      {sectionVisibility.skills && (
        <section className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5 font-mono text-[11px]">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {'// Core Technical Stack'}
          </div>
          {skills.technical.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="font-semibold text-slate-800">Languages & Frameworks:</span>
              <div className="flex flex-wrap gap-1">
                {skills.technical.map((s, idx) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded text-[10px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {skills.soft.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="font-semibold text-slate-800">Practices & Leadership:</span>
              <span className="text-slate-600">{skills.soft.join(', ')}</span>
            </div>
          )}
          {skills.other && skills.other.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="font-semibold text-slate-800">Tools & Infrastructure:</span>
              <span className="text-slate-600">{skills.other.join(', ')}</span>
            </div>
          )}
        </section>
      )}

      {/* Summary */}
      {sectionVisibility.summary && summary && (
        <section>
          <p className="text-slate-700 leading-relaxed text-[12px]">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {sectionVisibility.experience && experience.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-600" />
            Engineering Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-slate-900 text-xs">
                    {item.jobTitle} <span className="text-emerald-700 font-normal">@ {item.company}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {item.startDate} — {item.isCurrent ? 'Present' : item.endDate}
                  </span>
                </div>
                {item.location && <div className="text-[10px] text-slate-400 mb-1">{item.location}</div>}
                {item.description && (
                  <p className="text-[11px] text-slate-600 mb-1 leading-relaxed">{item.description}</p>
                )}
                {item.bulletPoints && item.bulletPoints.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-[11px] text-slate-700">
                    {item.bulletPoints.map((bp, i) => (
                      <li key={i}>{bp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Open Source & Technical Projects */}
      {sectionVisibility.projects && projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-emerald-600" />
            Projects & Architecture
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    {proj.name}
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-600">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="flex gap-1 font-mono text-[10px] text-slate-500">
                      {proj.technologies.slice(0, 4).join(' | ')}
                    </div>
                  )}
                </div>
                {proj.description && <p className="text-[11px] text-slate-600 mt-0.5">{proj.description}</p>}
                {proj.contributions && (
                  <ul className="list-disc list-outside pl-4 text-[11px] text-slate-700 mt-0.5">
                    {proj.contributions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sectionVisibility.education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 font-mono">
              Education
            </h2>
            <div className="space-y-1.5 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-medium text-slate-800">{edu.degree} in {edu.fieldOfStudy}</div>
                  <div className="text-[11px] text-slate-500">{edu.school} ({edu.startDate} – {edu.endDate})</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {sectionVisibility.certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 font-mono">
              Certifications
            </h2>
            <div className="space-y-1 text-xs">
              {certifications.map((c) => (
                <div key={c.id}>
                  <span className="font-medium text-slate-800">{c.name}</span>
                  <span className="text-slate-400 text-[10px]"> — {c.issuer}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
