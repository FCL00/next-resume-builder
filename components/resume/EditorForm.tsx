'use client';

import React, { useState } from 'react';
import {
  ResumeData,
  WorkExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  VolunteerItem,
  AwardItem,
  TemplateKey,
  FontPreset,
  SpacingPreset,
} from '@/types/resume';
import { EditorSectionKey } from './EditorSidebar';
import {
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ListPlus,
  FileText,
  Loader2,
  Check,
  Eye,
  EyeOff,
  Palette,
} from 'lucide-react';
import { COLOR_PALETTES, TEMPLATES_CONFIG } from '@/lib/constants/default-resume';
import { AIReviewModal } from '@/components/ai/AIReviewModal';
import { AIBulletGeneratorModal } from '@/components/ai/AIBulletGeneratorModal';
import { AISummaryModal } from '@/components/ai/AISummaryModal';
import { AIRoughNotesModal } from '@/components/ai/AIRoughNotesModal';
import { toast } from 'sonner';

interface EditorFormProps {
  activeSection: EditorSectionKey;
  data: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export function EditorForm({ activeSection, data, onChange }: EditorFormProps) {
  // Modal states for AI assistants
  const [reviewModalState, setReviewModalState] = useState<{
    isOpen: boolean;
    fieldLabel: string;
    originalText: string;
    suggestedText: string;
    isLoading: boolean;
    onApplyReplace: (text: string) => void;
    onApplyInsertBelow?: (text: string) => void;
  }>({
    isOpen: false,
    fieldLabel: '',
    originalText: '',
    suggestedText: '',
    isLoading: false,
    onApplyReplace: () => {},
  });

  const [bulletModalState, setBulletModalState] = useState<{
    isOpen: boolean;
    defaultJobTitle: string;
    defaultCompany: string;
    onAddBullets: (bullets: string[]) => void;
  }>({
    isOpen: false,
    defaultJobTitle: '',
    defaultCompany: '',
    onAddBullets: () => {},
  });

  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [roughNotesModalState, setRoughNotesModalState] = useState<{
    isOpen: boolean;
    roleTitle: string;
    onAddBullets: (bullets: string[]) => void;
  }>({
    isOpen: false,
    roleTitle: '',
    onAddBullets: () => {},
  });

  // Call AI improve endpoint
  const handleTriggerAIImprove = async (
    textToImprove: string,
    fieldLabel: string,
    onApplyReplace: (text: string) => void,
    onApplyInsertBelow?: (text: string) => void
  ) => {
    if (!textToImprove.trim()) {
      toast.error(`Please write some draft text in ${fieldLabel} first before improving.`);
      return;
    }

    setReviewModalState({
      isOpen: true,
      fieldLabel,
      originalText: textToImprove,
      suggestedText: 'Generating high-impact phrasing with AI...',
      isLoading: true,
      onApplyReplace,
      onApplyInsertBelow,
    });

    try {
      const res = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToImprove,
          context: fieldLabel,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to improve text');
      }

      setReviewModalState((prev) => ({
        ...prev,
        suggestedText: json.improvedText,
        isLoading: false,
      }));
    } catch (err: any) {
      toast.error(err.message || 'AI assistant error');
      setReviewModalState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  // Helper updates
  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], val: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: val },
    });
  };

  // ----------------------------------------------------
  // SECTION: Personal Information
  // ----------------------------------------------------
  if (activeSection === 'personal') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
          <p className="text-xs text-slate-500">Provide your primary contact coordinates and links.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={data.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Professional Title *</label>
            <input
              type="text"
              value={data.personalInfo.jobTitle}
              onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="e.g. alex@example.com"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="e.g. +1 (555) 234-5678"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={data.personalInfo.city}
              onChange={(e) => updatePersonalInfo('city', e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Country</label>
            <input
              type="text"
              value={data.personalInfo.country}
              onChange={(e) => updatePersonalInfo('country', e.target.value)}
              placeholder="e.g. United States"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={data.personalInfo.linkedIn || ''}
              onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
              placeholder="https://linkedin.com/in/alexmorgan"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Portfolio / Website</label>
            <input
              type="url"
              value={data.personalInfo.portfolio || ''}
              onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
              placeholder="https://alexmorgan.dev"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">GitHub URL</label>
            <input
              type="url"
              value={data.personalInfo.github || ''}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
              placeholder="https://github.com/alexmorgan"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SECTION: Professional Summary
  // ----------------------------------------------------
  if (activeSection === 'summary') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Professional Summary</h2>
          <p className="text-xs text-slate-500">
            Write a 3-4 sentence elevator pitch summarizing your core value and achievements.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-700">Summary Text</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSummaryModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Help Me Write
              </button>

              <button
                type="button"
                onClick={() =>
                  handleTriggerAIImprove(data.summary, 'Professional Summary', (improved) => {
                    onChange({ ...data, summary: improved });
                  })
                }
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Improve with AI
              </button>
            </div>
          </div>

          <textarea
            rows={6}
            value={data.summary}
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            placeholder="e.g. Dedicated Full Stack Engineer with 6+ years of experience architecting resilient cloud platforms..."
            className="w-full p-3.5 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500 leading-relaxed resize-y"
          />
          <p className="text-[11px] text-slate-400">
            Tip: Keep your summary concise, impact-oriented, and tailored to your target job.
          </p>
        </div>

        <AISummaryModal
          isOpen={summaryModalOpen}
          defaultRole={data.personalInfo.jobTitle}
          defaultSkills={data.skills.technical.slice(0, 5).join(', ')}
          existingSummary={data.summary}
          onApplySummary={(sum) => onChange({ ...data, summary: sum })}
          onClose={() => setSummaryModalOpen(false)}
        />

        <AIReviewModal
          isOpen={reviewModalState.isOpen}
          fieldLabel={reviewModalState.fieldLabel}
          originalText={reviewModalState.originalText}
          suggestedText={reviewModalState.suggestedText}
          isLoading={reviewModalState.isLoading}
          onApplyReplace={reviewModalState.onApplyReplace}
          onClose={() => setReviewModalState((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    );
  }

  // ----------------------------------------------------
  // SECTION: Work Experience
  // ----------------------------------------------------
  if (activeSection === 'experience') {
    const handleAddExperience = () => {
      const newItem: WorkExperienceItem = {
        id: `exp-${Date.now()}`,
        jobTitle: '',
        company: '',
        employmentType: 'Full-time',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        bulletPoints: [],
      };
      onChange({ ...data, experience: [newItem, ...data.experience] });
    };

    const handleUpdateExp = (id: string, updates: Partial<WorkExperienceItem>) => {
      const updated = data.experience.map((item) => (item.id === id ? { ...item, ...updates } : item));
      onChange({ ...data, experience: updated });
    };

    const handleDeleteExp = (id: string) => {
      onChange({ ...data, experience: data.experience.filter((item) => item.id !== id) });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Work Experience</h2>
            <p className="text-xs text-slate-500">Add your previous roles, accomplishments, and responsibilities.</p>
          </div>
          <button
            type="button"
            onClick={handleAddExperience}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Position
          </button>
        </div>

        {data.experience.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6">
            <p className="text-xs text-slate-500 mb-3">No work experience added yet.</p>
            <button
              type="button"
              onClick={handleAddExperience}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Your First Role
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {data.experience.map((item, index) => (
              <div key={item.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-slate-900 text-xs">
                      {item.jobTitle || 'New Position'} {item.company ? `at ${item.company}` : ''}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteExp(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-50 transition-colors"
                    title="Delete position"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      value={item.jobTitle}
                      onChange={(e) => handleUpdateExp(item.id, { jobTitle: e.target.value })}
                      placeholder="e.g. Lead Software Engineer"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Company *</label>
                    <input
                      type="text"
                      value={item.company}
                      onChange={(e) => handleUpdateExp(item.id, { company: e.target.value })}
                      placeholder="e.g. TechFlow Systems"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={item.location || ''}
                      onChange={(e) => handleUpdateExp(item.id, { location: e.target.value })}
                      placeholder="e.g. San Francisco, CA (or Remote)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Employment Type</label>
                    <select
                      value={item.employmentType || 'Full-time'}
                      onChange={(e) => handleUpdateExp(item.id, { employmentType: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500 bg-white"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={item.startDate}
                      onChange={(e) => handleUpdateExp(item.id, { startDate: e.target.value })}
                      placeholder="e.g. 2022-03 or Mar 2022"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-medium text-slate-700">End Date</label>
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isCurrent}
                          onChange={(e) => handleUpdateExp(item.id, { isCurrent: e.target.checked })}
                          className="h-3 w-3 rounded text-indigo-600"
                        />
                        <span>Current Role</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      disabled={item.isCurrent}
                      value={item.isCurrent ? 'Present' : item.endDate}
                      onChange={(e) => handleUpdateExp(item.id, { endDate: e.target.value })}
                      placeholder="e.g. 2024-05 or Present"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                </div>

                {/* Role Description with AI Improve */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-medium text-slate-700">Role Overview / Summary</label>
                    <button
                      type="button"
                      onClick={() =>
                        handleTriggerAIImprove(item.description, 'Job Description', (improved) => {
                          handleUpdateExp(item.id, { description: improved });
                        })
                      }
                      className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-indigo-600"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      Improve with AI
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleUpdateExp(item.id, { description: e.target.value })}
                    placeholder="Brief description of your scope and responsibilities..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>

                {/* Bullet Points / Achievements */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <label className="block text-[11px] font-medium text-slate-700">
                      Key Accomplishments & Bullet Points ({item.bulletPoints.length})
                    </label>

                    {/* Secondary AI Assistant Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setRoughNotesModalState({
                            isOpen: true,
                            roleTitle: item.jobTitle || 'Role',
                            onAddBullets: (newBullets) => {
                              handleUpdateExp(item.id, {
                                bulletPoints: [...item.bulletPoints, ...newBullets],
                              });
                            },
                          })
                        }
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                      >
                        <FileText className="w-3 h-3 text-indigo-600" />
                        Expand Notes
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setBulletModalState({
                            isOpen: true,
                            defaultJobTitle: item.jobTitle,
                            defaultCompany: item.company,
                            onAddBullets: (newBullets) => {
                              handleUpdateExp(item.id, {
                                bulletPoints: [...item.bulletPoints, ...newBullets],
                              });
                            },
                          })
                        }
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                      >
                        <ListPlus className="w-3 h-3 text-indigo-600" />
                        Generate Bullet Points
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {item.bulletPoints.map((bp, bpIdx) => (
                      <div key={bpIdx} className="flex items-start gap-1.5">
                        <span className="text-slate-400 text-xs mt-1">•</span>
                        <textarea
                          rows={2}
                          value={bp}
                          onChange={(e) => {
                            const updatedBullets = [...item.bulletPoints];
                            updatedBullets[bpIdx] = e.target.value;
                            handleUpdateExp(item.id, { bulletPoints: updatedBullets });
                          }}
                          className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-200 focus:outline-indigo-500 resize-y"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedBullets = item.bulletPoints.filter((_, i) => i !== bpIdx);
                            handleUpdateExp(item.id, { bulletPoints: updatedBullets });
                          }}
                          className="text-slate-400 hover:text-rose-500 p-1"
                          title="Remove bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateExp(item.id, { bulletPoints: [...item.bulletPoints, ''] });
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 pt-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Bullet Manually
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AIBulletGeneratorModal
          isOpen={bulletModalState.isOpen}
          defaultJobTitle={bulletModalState.defaultJobTitle}
          defaultCompany={bulletModalState.defaultCompany}
          onAddBullets={bulletModalState.onAddBullets}
          onClose={() => setBulletModalState((prev) => ({ ...prev, isOpen: false }))}
        />

        <AIRoughNotesModal
          isOpen={roughNotesModalState.isOpen}
          roleTitle={roughNotesModalState.roleTitle}
          onAddBullets={roughNotesModalState.onAddBullets}
          onClose={() => setRoughNotesModalState((prev) => ({ ...prev, isOpen: false }))}
        />

        <AIReviewModal
          isOpen={reviewModalState.isOpen}
          fieldLabel={reviewModalState.fieldLabel}
          originalText={reviewModalState.originalText}
          suggestedText={reviewModalState.suggestedText}
          isLoading={reviewModalState.isLoading}
          onApplyReplace={reviewModalState.onApplyReplace}
          onClose={() => setReviewModalState((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    );
  }

  // ----------------------------------------------------
  // SECTION: Skills
  // ----------------------------------------------------
  if (activeSection === 'skills') {
    const handleAddSkill = (category: 'technical' | 'soft' | 'other', value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      if (data.skills[category].includes(trimmed)) return;
      onChange({
        ...data,
        skills: {
          ...data.skills,
          [category]: [...data.skills[category], trimmed],
        },
      });
    };

    const handleRemoveSkill = (category: 'technical' | 'soft' | 'other', index: number) => {
      onChange({
        ...data,
        skills: {
          ...data.skills,
          [category]: data.skills[category].filter((_, i) => i !== index),
        },
      });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Skills & Proficiencies</h2>
          <p className="text-xs text-slate-500">Categorize your technical proficiencies, tools, and interpersonal strengths.</p>
        </div>

        {/* Technical Skills */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
          <label className="block text-xs font-semibold text-slate-800">
            Technical Skills ({data.skills.technical.length})
          </label>
          <div className="flex flex-wrap gap-1.5 min-h-9 p-2 bg-slate-50 border border-slate-200 rounded-lg">
            {data.skills.technical.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill('technical', idx)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="new-tech-skill-input"
              placeholder="e.g. TypeScript, React, Docker (Press Enter to add)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill('technical', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('new-tech-skill-input') as HTMLInputElement;
                if (el) {
                  handleAddSkill('technical', el.value);
                  el.value = '';
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>

        {/* Soft Skills */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
          <label className="block text-xs font-semibold text-slate-800">
            Soft Skills & Core Competencies ({data.skills.soft.length})
          </label>
          <div className="flex flex-wrap gap-1.5 min-h-9 p-2 bg-slate-50 border border-slate-200 rounded-lg">
            {data.skills.soft.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill('soft', idx)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="new-soft-skill-input"
              placeholder="e.g. Cross-functional Leadership, Agile, Mentorship"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill('soft', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
            />
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('new-soft-skill-input') as HTMLInputElement;
                if (el) {
                  handleAddSkill('soft', el.value);
                  el.value = '';
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SECTION: Education
  // ----------------------------------------------------
  if (activeSection === 'education') {
    const handleAddEdu = () => {
      const newItem: EducationItem = {
        id: `edu-${Date.now()}`,
        school: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        gpa: '',
        details: '',
      };
      onChange({ ...data, education: [...data.education, newItem] });
    };

    const handleUpdateEdu = (id: string, updates: Partial<EducationItem>) => {
      onChange({
        ...data,
        education: data.education.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      });
    };

    const handleDeleteEdu = (id: string) => {
      onChange({ ...data, education: data.education.filter((e) => e.id !== id) });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Education</h2>
            <p className="text-xs text-slate-500">Add degrees, universities, and academic honors.</p>
          </div>
          <button
            type="button"
            onClick={handleAddEdu}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Education
          </button>
        </div>

        <div className="space-y-4">
          {data.education.map((edu, idx) => (
            <div key={edu.id} className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-800 text-xs">
                  {edu.degree || 'Degree'} {edu.school ? `• ${edu.school}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteEdu(edu.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">School / University *</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleUpdateEdu(edu.id, { school: e.target.value })}
                    placeholder="e.g. UC Berkeley"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Degree *</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleUpdateEdu(edu.id, { degree: e.target.value })}
                    placeholder="e.g. Bachelor of Science"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleUpdateEdu(edu.id, { fieldOfStudy: e.target.value })}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">GPA (Optional)</label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => handleUpdateEdu(edu.id, { gpa: e.target.value })}
                    placeholder="e.g. 3.8 / 4.0"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Start Year</label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => handleUpdateEdu(edu.id, { startDate: e.target.value })}
                    placeholder="e.g. 2015"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => handleUpdateEdu(edu.id, { endDate: e.target.value })}
                    placeholder="e.g. 2019"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SECTION: Projects
  // ----------------------------------------------------
  if (activeSection === 'projects') {
    const handleAddProject = () => {
      const newItem: ProjectItem = {
        id: `proj-${Date.now()}`,
        name: '',
        description: '',
        technologies: [],
        url: '',
        contributions: [],
      };
      onChange({ ...data, projects: [...data.projects, newItem] });
    };

    const handleUpdateProj = (id: string, updates: Partial<ProjectItem>) => {
      onChange({
        ...data,
        projects: data.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      });
    };

    const handleDeleteProj = (id: string) => {
      onChange({ ...data, projects: data.projects.filter((p) => p.id !== id) });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
            <p className="text-xs text-slate-500">Highlight portfolio apps, open-source work, and key accomplishments.</p>
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Project
          </button>
        </div>

        <div className="space-y-4">
          {data.projects.map((proj) => (
            <div key={proj.id} className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-800 text-xs">{proj.name || 'Project Name'}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteProj(proj.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => handleUpdateProj(proj.id, { name: e.target.value })}
                    placeholder="e.g. OmniDash Telemetry Platform"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Project Link / Repo</label>
                  <input
                    type="url"
                    value={proj.url || ''}
                    onChange={(e) => handleUpdateProj(proj.id, { url: e.target.value })}
                    placeholder="https://github.com/alex/omnidash"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-slate-700">Description</label>
                  <button
                    type="button"
                    onClick={() =>
                      handleTriggerAIImprove(proj.description, 'Project Description', (improved) => {
                        handleUpdateProj(proj.id, { description: improved });
                      })
                    }
                    className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-indigo-600"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    Improve with AI
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) => handleUpdateProj(proj.id, { description: e.target.value })}
                  placeholder="Describe what the project does and its architecture..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={proj.technologies.join(', ')}
                  onChange={(e) =>
                    handleUpdateProj(proj.id, {
                      technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g. Next.js, ClickHouse, Docker"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-indigo-500"
                />
              </div>
            </div>
          ))}
        </div>

        <AIReviewModal
          isOpen={reviewModalState.isOpen}
          fieldLabel={reviewModalState.fieldLabel}
          originalText={reviewModalState.originalText}
          suggestedText={reviewModalState.suggestedText}
          isLoading={reviewModalState.isLoading}
          onApplyReplace={reviewModalState.onApplyReplace}
          onClose={() => setReviewModalState((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    );
  }

  // ----------------------------------------------------
  // SECTION: Certifications, Languages, Awards
  // ----------------------------------------------------
  if (activeSection === 'certifications' || activeSection === 'languages' || activeSection === 'awards' || activeSection === 'volunteer') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 capitalize">{activeSection}</h2>
          <p className="text-xs text-slate-500">Manage entries for this section.</p>
        </div>

        {activeSection === 'certifications' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...data,
                  certifications: [
                    ...data.certifications,
                    { id: `c-${Date.now()}`, name: '', issuer: '', issueDate: '' },
                  ],
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" /> Add Certification
            </button>
            {data.certifications.map((c, i) => (
              <div key={c.id} className="p-3 border border-slate-200 rounded-lg flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Certificate Name"
                  value={c.name}
                  onChange={(e) => {
                    const next = [...data.certifications];
                    next[i].name = e.target.value;
                    onChange({ ...data, certifications: next });
                  }}
                  className="flex-2 px-2.5 py-1 text-xs border rounded"
                />
                <input
                  type="text"
                  placeholder="Issuer (e.g. AWS)"
                  value={c.issuer}
                  onChange={(e) => {
                    const next = [...data.certifications];
                    next[i].issuer = e.target.value;
                    onChange({ ...data, certifications: next });
                  }}
                  className="flex-1 px-2.5 py-1 text-xs border rounded"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={c.issueDate}
                  onChange={(e) => {
                    const next = [...data.certifications];
                    next[i].issueDate = e.target.value;
                    onChange({ ...data, certifications: next });
                  }}
                  className="w-24 px-2 py-1 text-xs border rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      certifications: data.certifications.filter((_, idx) => idx !== i),
                    })
                  }
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'languages' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...data,
                  languages: [
                    ...data.languages,
                    { id: `l-${Date.now()}`, language: '', proficiency: 'Fluent' },
                  ],
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" /> Add Language
            </button>
            {data.languages.map((l, i) => (
              <div key={l.id} className="p-3 border border-slate-200 rounded-lg flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Language (e.g. Spanish)"
                  value={l.language}
                  onChange={(e) => {
                    const next = [...data.languages];
                    next[i].language = e.target.value;
                    onChange({ ...data, languages: next });
                  }}
                  className="flex-1 px-2.5 py-1 text-xs border rounded"
                />
                <select
                  value={l.proficiency}
                  onChange={(e) => {
                    const next = [...data.languages];
                    next[i].proficiency = e.target.value as any;
                    onChange({ ...data, languages: next });
                  }}
                  className="px-2.5 py-1 text-xs border rounded bg-white"
                >
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Proficient">Proficient</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      languages: data.languages.filter((_, idx) => idx !== i),
                    })
                  }
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'awards' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...data,
                  awards: [...data.awards, { id: `a-${Date.now()}`, title: '', issuer: '', date: '' }],
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" /> Add Award
            </button>
            {data.awards.map((a, i) => (
              <div key={a.id} className="p-3 border border-slate-200 rounded-lg flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Award Title"
                  value={a.title}
                  onChange={(e) => {
                    const next = [...data.awards];
                    next[i].title = e.target.value;
                    onChange({ ...data, awards: next });
                  }}
                  className="flex-2 px-2.5 py-1 text-xs border rounded"
                />
                <input
                  type="text"
                  placeholder="Organization"
                  value={a.issuer}
                  onChange={(e) => {
                    const next = [...data.awards];
                    next[i].issuer = e.target.value;
                    onChange({ ...data, awards: next });
                  }}
                  className="flex-1 px-2.5 py-1 text-xs border rounded"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={a.date}
                  onChange={(e) => {
                    const next = [...data.awards];
                    next[i].date = e.target.value;
                    onChange({ ...data, awards: next });
                  }}
                  className="w-24 px-2 py-1 text-xs border rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      awards: data.awards.filter((_, idx) => idx !== i),
                    })
                  }
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // SECTION: Template & Design
  // ----------------------------------------------------
  if (activeSection === 'design') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Template & Styling Customization</h2>
          <p className="text-xs text-slate-500">Fine-tune the visual appearance and layout of your resume.</p>
        </div>

        {/* Template Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-800">Selected Template</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATES_CONFIG.map((t) => {
              const isSelected = data.customization.templateId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      customization: { ...data.customization, templateId: t.id },
                    })
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900 text-xs">{t.name}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{t.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Color Palette */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800">Accent Color</label>
          <div className="flex flex-wrap gap-2.5 items-center">
            {COLOR_PALETTES.map((c) => {
              const isCurrent = data.customization.accentColor === c.value;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      customization: { ...data.customization, accentColor: c.value },
                    })
                  }
                  title={c.name}
                  className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                    isCurrent ? 'scale-110 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                >
                  {isCurrent && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Preset & Spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Typography Font</label>
            <select
              value={data.customization.fontPreset}
              onChange={(e) =>
                onChange({
                  ...data,
                  customization: { ...data.customization, fontPreset: e.target.value as FontPreset },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
            >
              <option value="inter">Modern Sans-Serif (Inter)</option>
              <option value="merriweather">Editorial Serif (Merriweather)</option>
              <option value="roboto">Neutral Sans (Roboto)</option>
              <option value="fira-code">Technical Monospace</option>
              <option value="playfair">High Elegance (Playfair)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Density & Spacing</label>
            <select
              value={data.customization.spacing}
              onChange={(e) =>
                onChange({
                  ...data,
                  customization: { ...data.customization, spacing: e.target.value as SpacingPreset },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
            >
              <option value="compact">Compact (Fit more content on 1 page)</option>
              <option value="normal">Standard Balanced</option>
              <option value="relaxed">Relaxed (Spacious)</option>
            </select>
          </div>
        </div>

        {/* Profile Photo Toggle */}
        <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl bg-white">
          <div>
            <span className="text-xs font-semibold text-slate-800 block">Show Profile Picture</span>
            <span className="text-[11px] text-slate-500">
              Only displayed in templates that support photos if a URL is provided.
            </span>
          </div>
          <input
            type="checkbox"
            checked={data.customization.showPhoto}
            onChange={(e) =>
              onChange({
                ...data,
                customization: { ...data.customization, showPhoto: e.target.checked },
              })
            }
            className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-center text-slate-500 text-xs">
      Select a section from the left sidebar to edit its contents.
    </div>
  );
}
