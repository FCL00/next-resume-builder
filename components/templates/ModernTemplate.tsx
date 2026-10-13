'use client';

import React from 'react';
import Image from 'next/image';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  scale?: number;
}

export function ModernTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    volunteer,
    awards,
    customSections,
    sectionVisibility,
    customization,
  } = data;

  const accentColor = customization.accentColor || '#3b82f6';
  const showPhoto = customization.showPhoto && personalInfo.photoUrl;

  const spacingClasses = {
    compact: 'space-y-3.5 text-xs',
    normal: 'space-y-5 text-sm',
    relaxed: 'space-y-6 text-sm',
  }[customization.spacing || 'normal'];

  return (
    <div className={`p-8 bg-white text-slate-800 ${spacingClasses}`}>
      {/* Header */}
      <header className="border-b border-slate-200 pb-5">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-base font-medium mt-1" style={{ color: accentColor }}>
              {personalInfo.jobTitle || 'Professional Title'}
            </p>

            {/* Contact details */}
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 mt-3 text-xs text-slate-600">
              {personalInfo.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.phone}
                </span>
              )}
              {(personalInfo.city || personalInfo.country) && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
                </span>
              )}
              {personalInfo.linkedIn && (
                <span className="inline-flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.linkedIn.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              )}
              {personalInfo.portfolio && (
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              )}
              {personalInfo.github && (
                <span className="inline-flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              )}
            </div>
          </div>

          {showPhoto && personalInfo.photoUrl && (
            <div className="shrink-0 relative w-20 h-20">
              <Image
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                width={80}
                height={80}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shadow-xs"
              />
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {sectionVisibility.summary && summary && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b flex items-center"
            style={{ color: accentColor, borderColor: '#e2e8f0' }}
          >
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-xs sm:text-[13px]">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {sectionVisibility.experience && experience.length > 0 && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
            style={{ color: accentColor, borderColor: '#e2e8f0' }}
          >
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((item) => (
              <div key={item.id} className="relative">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 text-sm">{item.jobTitle}</h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {item.startDate} — {item.isCurrent ? 'Present' : item.endDate || 'Present'}
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium mb-1.5 flex items-center gap-2">
                  <span>{item.company}</span>
                  {item.location && <span className="text-slate-400">• {item.location}</span>}
                  {item.employmentType && <span className="text-slate-400">• {item.employmentType}</span>}
                </div>
                {item.description && (
                  <p className="text-xs text-slate-600 mb-2 leading-relaxed">{item.description}</p>
                )}
                {item.bulletPoints && item.bulletPoints.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700">
                    {item.bulletPoints.map((bp, i) => (
                      <li key={i} className="leading-relaxed">
                        {bp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {sectionVisibility.projects && projects.length > 0 && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
            style={{ color: accentColor, borderColor: '#e2e8f0' }}
          >
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">{proj.name}</h3>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 hover:text-indigo-600 inline-flex items-center gap-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.map((t, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {proj.description && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                )}
                {proj.contributions && proj.contributions.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-700 mt-1">
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

      {/* Skills */}
      {sectionVisibility.skills && (skills.technical.length > 0 || skills.soft.length > 0) && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
            style={{ color: accentColor, borderColor: '#e2e8f0' }}
          >
            Skills & Competencies
          </h2>
          <div className="space-y-1.5 text-xs">
            {skills.technical.length > 0 && (
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <span className="font-semibold text-slate-700">Technical:</span>
                <span className="text-slate-600">{skills.technical.join(' • ')}</span>
              </div>
            )}
            {skills.soft.length > 0 && (
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <span className="font-semibold text-slate-700">Core & Soft:</span>
                <span className="text-slate-600">{skills.soft.join(' • ')}</span>
              </div>
            )}
            {skills.other && skills.other.length > 0 && (
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <span className="font-semibold text-slate-700">Other:</span>
                <span className="text-slate-600">{skills.other.join(' • ')}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Education */}
      {sectionVisibility.education && education.length > 0 && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b"
            style={{ color: accentColor, borderColor: '#e2e8f0' }}
          >
            Education
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex flex-wrap justify-between items-baseline gap-2 text-xs">
                <div>
                  <div className="font-semibold text-slate-900">
                    {edu.degree} in {edu.fieldOfStudy}
                  </div>
                  <div className="text-slate-600 font-medium">
                    {edu.school} {edu.gpa && <span className="text-slate-400">| GPA: {edu.gpa}</span>}
                  </div>
                  {edu.details && <p className="text-slate-500 mt-0.5">{edu.details}</p>}
                </div>
                <div className="text-slate-500 text-xs font-medium">
                  {edu.startDate} — {edu.endDate}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sectionVisibility.certifications && certifications.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
              style={{ color: accentColor, borderColor: '#e2e8f0' }}
            >
              Certifications
            </h2>
            <div className="space-y-1.5 text-xs">
              {certifications.map((c) => (
                <div key={c.id}>
                  <div className="font-semibold text-slate-800">{c.name}</div>
                  <div className="text-slate-500 text-[11px]">{c.issuer} ({c.issueDate})</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {sectionVisibility.languages && languages.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
              style={{ color: accentColor, borderColor: '#e2e8f0' }}
            >
              Languages
            </h2>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {languages.map((l) => (
                <span key={l.id} className="text-slate-700">
                  <strong className="font-medium">{l.language}:</strong>{' '}
                  <span className="text-slate-500">{l.proficiency}</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Awards or Custom Sections */}
      {sectionVisibility.awards && awards.length > 0 && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
            style={{ color: accentColor, borderColor: '#e2e8f0' }}
          >
            Honors & Awards
          </h2>
          <div className="space-y-1.5 text-xs">
            {awards.map((a) => (
              <div key={a.id} className="flex justify-between items-baseline">
                <span className="font-medium text-slate-800">{a.title} — {a.issuer}</span>
                <span className="text-slate-500 text-[11px]">{a.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
