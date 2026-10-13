'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  scale?: number;
}

export function ClassicTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    awards,
    sectionVisibility,
    customization,
  } = data;

  const accentColor = customization.accentColor || '#1e293b';

  return (
    <div className="p-8 bg-white text-slate-800 space-y-4 text-xs font-serif leading-normal">
      {/* Centered Formal Header */}
      <header className="text-center border-b-2 border-slate-900 pb-3">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900 font-serif">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <p className="text-sm italic text-slate-700 mt-0.5">
          {personalInfo.jobTitle || 'Professional Title'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-600 font-sans">
          {[
            [personalInfo.city, personalInfo.country].filter(Boolean).join(', '),
            personalInfo.phone,
            personalInfo.email,
            personalInfo.linkedIn ? personalInfo.linkedIn.replace(/^https?:\/\//, '') : null,
            personalInfo.portfolio ? personalInfo.portfolio.replace(/^https?:\/\//, '') : null,
          ]
            .filter(Boolean)
            .map((item, idx, arr) => (
              <React.Fragment key={idx}>
                <span>{item}</span>
                {idx < arr.length - 1 && <span className="text-slate-300">|</span>}
              </React.Fragment>
            ))}
        </div>
      </header>

      {/* Summary */}
      {sectionVisibility.summary && summary && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 font-serif">
            Executive Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-[12px] text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {sectionVisibility.experience && experience.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-serif">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">
                    {item.company}
                    {item.location && <span className="font-normal italic text-slate-600"> — {item.location}</span>}
                  </span>
                  <span className="text-[11px] text-slate-600 italic">
                    {item.startDate} – {item.isCurrent ? 'Present' : item.endDate}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-800 italic mb-1">
                  {item.jobTitle}
                </div>
                {item.description && (
                  <p className="text-[11px] text-slate-700 mb-1">{item.description}</p>
                )}
                {item.bulletPoints && item.bulletPoints.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-[11px] text-slate-700 font-sans">
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

      {/* Education */}
      {sectionVisibility.education && education.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 font-serif">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.school}</span>
                  <div className="text-[11px] text-slate-700">
                    {edu.degree} in {edu.fieldOfStudy} {edu.gpa && <span>(GPA: {edu.gpa})</span>}
                  </div>
                  {edu.details && <div className="text-[10px] text-slate-500 italic">{edu.details}</div>}
                </div>
                <span className="text-[11px] text-slate-600 italic">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {sectionVisibility.projects && projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 font-serif">
            Notable Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{proj.name}</span>
                  {proj.technologies && (
                    <span className="text-[11px] text-slate-600 italic font-sans">
                      {proj.technologies.join(', ')}
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-[11px] text-slate-700">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {sectionVisibility.skills && (skills.technical.length > 0 || skills.soft.length > 0) && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1 font-serif">
            Skills & Qualifications
          </h2>
          <div className="text-[11px] space-y-0.5 font-sans">
            {skills.technical.length > 0 && (
              <div>
                <strong className="font-semibold text-slate-900">Technical Skills: </strong>
                <span className="text-slate-700">{skills.technical.join(', ')}</span>
              </div>
            )}
            {skills.soft.length > 0 && (
              <div>
                <strong className="font-semibold text-slate-900">Professional Competencies: </strong>
                <span className="text-slate-700">{skills.soft.join(', ')}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certifications & Awards */}
      {sectionVisibility.certifications && certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1 font-serif">
            Certifications
          </h2>
          <div className="text-[11px] space-y-0.5 font-sans">
            {certifications.map((c) => (
              <div key={c.id} className="flex justify-between">
                <span className="text-slate-800 font-medium">{c.name} — {c.issuer}</span>
                <span className="text-slate-500 italic">{c.issueDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
