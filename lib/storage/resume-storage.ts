import { ResumeRecord, ResumeData, TemplateKey } from '@/types/resume';
import { DEFAULT_RESUME_DATA, BLANK_RESUME_DATA } from '@/lib/constants/default-resume';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const LOCAL_STORAGE_KEY = 'resumai_saved_resumes_v1';

export const INITIAL_DEMO_RESUME: ResumeRecord = {
  id: 'demo-resume-1',
  user_id: 'user-demo-1',
  title: 'Full Stack Engineer - 2025',
  data: DEFAULT_RESUME_DATA,
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
};

function getLocalResumes(): ResumeRecord[] {
  if (typeof window === 'undefined') return [INITIAL_DEMO_RESUME];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([INITIAL_DEMO_RESUME]));
      return [INITIAL_DEMO_RESUME];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([INITIAL_DEMO_RESUME]));
      return [INITIAL_DEMO_RESUME];
    }
    return parsed;
  } catch (err) {
    console.error('Error reading resumes from local storage:', err);
    return [INITIAL_DEMO_RESUME];
  }
}

function setLocalResumes(resumes: ResumeRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumes));
  } catch (err) {
    console.error('Error saving resumes to local storage:', err);
  }
}

export async function fetchAllResumes(userId: string): Promise<ResumeRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        return data as ResumeRecord[];
      }
      console.warn('Supabase fetch failed, falling back to local storage:', error?.message);
    } catch (e) {
      console.warn('Supabase error, using local storage fallback:', e);
    }
  }

  // Local storage fallback
  const resumes = getLocalResumes();
  return resumes.filter((r) => r.user_id === userId || userId === 'user-demo-1');
}

export async function fetchResumeById(id: string): Promise<ResumeRecord | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as ResumeRecord;
      }
    } catch (e) {
      console.warn('Supabase fetchById error:', e);
    }
  }

  const resumes = getLocalResumes();
  const match = resumes.find((r) => r.id === id);
  return match || null;
}

export async function saveResumeRecord(resume: ResumeRecord): Promise<ResumeRecord> {
  const updatedRecord = {
    ...resume,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .upsert({
          id: updatedRecord.id,
          user_id: updatedRecord.user_id,
          title: updatedRecord.title,
          template_id: updatedRecord.data.customization.templateId,
          data: updatedRecord.data,
          updated_at: updatedRecord.updated_at,
        })
        .select()
        .single();

      if (!error && data) {
        return data as ResumeRecord;
      }
      console.warn('Supabase save error, persisting locally:', error?.message);
    } catch (e) {
      console.warn('Supabase save failed:', e);
    }
  }

  // Local storage
  const resumes = getLocalResumes();
  const existingIdx = resumes.findIndex((r) => r.id === resume.id);
  if (existingIdx >= 0) {
    resumes[existingIdx] = updatedRecord;
  } else {
    resumes.unshift(updatedRecord);
  }
  setLocalResumes(resumes);
  return updatedRecord;
}

export async function createNewResume({
  userId,
  title,
  templateId = 'modern',
  initialData,
}: {
  userId: string;
  title: string;
  templateId?: TemplateKey;
  initialData?: ResumeData;
}): Promise<ResumeRecord> {
  const baseData = initialData ? JSON.parse(JSON.stringify(initialData)) : JSON.parse(JSON.stringify(DEFAULT_RESUME_DATA));
  baseData.customization.templateId = templateId;

  const newResume: ResumeRecord = {
    id: `resume-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    title: title.trim() || 'Untitled Resume',
    data: baseData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return await saveResumeRecord(newResume);
}

export async function duplicateResumeRecord(resume: ResumeRecord, userId: string): Promise<ResumeRecord> {
  const duplicated: ResumeRecord = {
    id: `resume-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    title: `${resume.title} (Copy)`,
    data: JSON.parse(JSON.stringify(resume.data)),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return await saveResumeRecord(duplicated);
}

export async function deleteResumeRecord(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('resumes').delete().eq('id', id);
      if (error) console.warn('Supabase delete error:', error.message);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  const resumes = getLocalResumes();
  const filtered = resumes.filter((r) => r.id !== id);
  setLocalResumes(filtered);
  return true;
}
