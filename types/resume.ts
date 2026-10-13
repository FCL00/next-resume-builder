export type TemplateKey = 'modern' | 'classic' | 'minimal' | 'professional' | 'technical';

export type FontPreset = 'inter' | 'merriweather' | 'roboto' | 'fira-code' | 'playfair';

export type SpacingPreset = 'compact' | 'normal' | 'relaxed';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedIn?: string;
  portfolio?: string;
  github?: string;
  photoUrl?: string;
}

export interface WorkExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  bulletPoints: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  details?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  contributions: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  url?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Proficient' | 'Intermediate' | 'Basic';
}

export interface VolunteerItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeCustomization {
  templateId: TemplateKey;
  accentColor: string;
  fontPreset: FontPreset;
  spacing: SpacingPreset;
  showPhoto: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperienceItem[];
  education: EducationItem[];
  skills: {
    technical: string[];
    soft: string[];
    other: string[];
  };
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  volunteer: VolunteerItem[];
  awards: AwardItem[];
  customSections: CustomSection[];
  sectionVisibility: {
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    certifications: boolean;
    languages: boolean;
    volunteer: boolean;
    awards: boolean;
    customSections: boolean;
  };
  sectionOrder: string[];
  customization: ResumeCustomization;
}

export interface ResumeRecord {
  id: string;
  user_id: string;
  title: string;
  data: ResumeData;
  created_at: string;
  updated_at: string;
}

export interface AIReviewPayload {
  originalText: string;
  improvedText: string;
  fieldLabel: string;
  context?: string;
  onApply: (mode: 'replace' | 'insert') => void;
}
