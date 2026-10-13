'use client';

import React from 'react';
import Image from 'next/image';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  scale?: number;
}

export function ProfessionalTemplate({ data }: TemplateProps) {
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

  const accentColor = customization.accentColor || '#1e40af';
  const showPhoto = customization.showPhoto && personalInfo.photoUrl;

  return (
    <div className="bg-white text-slate-800 text-xs">
      {/* Top Banner Header */}
      <div className="p-7 text-white" style={{ backgroundColor: accentColor }}>
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
              {personalInfo.fullName}
            </h1>
            <p className="text-sm font-medium tracking-wide text-blue-100 mt-0.5">
              {personalInfo.jobTitle}
            </p>
          </div>
          {showPhoto && personalInfo.photoUrl && (
            <div className="shrink-0 relative w-16 h-16">
              <Image
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                width={64}
                height={64}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-white/60 shadow-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-12 min-h-[700px]">
        {/* Left Column (Sidebar - 4 cols) */}
        <aside className="col-span-4 bg-slate-50/80 p-6 border-r border-slate-200 space-y-5">
          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Contact
            </h3>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              {personalInfo.email && (
                <div className="flex items-center gap-1.5 break-all">
                  <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 shrink-0 text-slate-400" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {(personalInfo.city || personalInfo.country) && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                  <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {personalInfo.linkedIn && (
                <div className="flex items-center gap-1.5 break-all">
                  <Linkedin className="w-3 h-3 shrink-0 text-slate-400" />
                  <span>{personalInfo.linkedIn.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </div>
              )}
              {personalInfo.portfolio && (
                <div className="flex items-center gap-1.5 break-all">
                  <Globe className="w-3 h-3 shrink-0 text-slate-400" />
                  <span>{personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          {sectionVisibility.education && education.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Education
              </h3>
              <div className="space-y-2.5 text-[11px]">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-semibold text-slate-800">{edu.degree}</div>
                    <div className="text-slate-600">{edu.fieldOfStudy}</div>
                    <div className="text-slate-500 text-[10px]">{edu.school}</div>
                    <div className="text-slate-400 text-[10px]">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {sectionVisibility.skills && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Expertise
              </h3>
              <div className="space-y-2 text-[11px]">
                {skills.technical.length > 0 && (
                  <div>
                    <span className="font-medium text-slate-700 block mb-1">Technical:</span>
                    <div className="flex flex-wrap gap-1">
                      {skills.technical.map((s, i) => (
                        <span key={i} className="bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills.soft.length > 0 && (
                  <div>
                    <span className="font-medium text-slate-700 block mb-1">Leadership:</span>
                    <div className="flex flex-wrap gap-1">
                      {skills.soft.map((s, i) => (
                        <span key={i} className="bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {sectionVisibility.languages && languages.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Languages
              </h3>
              <div className="space-y-1 text-[11px]">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="text-slate-700 font-medium">{l.language}</span>
                    <span className="text-slate-500 text-[10px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {sectionVisibility.certifications && certifications.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Certifications
              </h3>
              <div className="space-y-1.5 text-[10px] text-slate-700">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <div className="font-medium text-slate-800">{c.name}</div>
                    <div className="text-slate-500">{c.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Main Column (8 cols) */}
        <main className="col-span-8 p-6 space-y-4">
          {/* Summary */}
          {sectionVisibility.summary && summary && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1.5" style={{ color: accentColor }}>
                Executive Profile
              </h2>
              <p className="text-slate-700 leading-relaxed text-[12px]">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {sectionVisibility.experience && experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-1 mb-2.5" style={{ color: accentColor }}>
                Work History
              </h2>
              <div className="space-y-3.5">
                {experience.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-slate-900 text-xs">{item.jobTitle}</h4>
                      <span className="text-[10px] font-medium text-slate-500">
                        {item.startDate} — {item.isCurrent ? 'Present' : item.endDate}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium mb-1">
                      {item.company} {item.location && <span>• {item.location}</span>}
                    </div>
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

          {/* Projects */}
          {sectionVisibility.projects && projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-1 mb-2" style={{ color: accentColor }}>
                Key Initiatives & Projects
              </h2>
              <div className="space-y-2 text-xs">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-slate-900">{proj.name}</span>
                      {proj.technologies && (
                        <span className="text-[10px] text-slate-500">
                          {proj.technologies.join(', ')}
                        </span>
                      )}
                    </div>
                    {proj.description && <p className="text-[11px] text-slate-600 mt-0.5">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Awards */}
          {sectionVisibility.awards && awards.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5" style={{ color: accentColor }}>
                Honors & Recognition
              </h2>
              <div className="space-y-1 text-[11px]">
                {awards.map((a) => (
                  <div key={a.id} className="flex justify-between">
                    <span className="text-slate-800 font-medium">{a.title} ({a.issuer})</span>
                    <span className="text-slate-500 text-[10px]">{a.date}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
