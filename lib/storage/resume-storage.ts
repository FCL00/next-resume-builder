import { ResumeRecord, ResumeData, TemplateKey } from '@/types/resume';
import { DEFAULT_RESUME_DATA } from '@/lib/constants/default-resume';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const LOCAL_STORAGE_KEY = 'resumai_user_resumes_v2';

/**
 * Generates an RFC4122 v4 UUID compatible with PostgreSQL UUID primary keys.
 */
function generateRecordId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validates that Supabase has an active, authenticated user matching the claimed userId.
 * Uses supabase.auth.getUser() as the authoritative server-verified identity.
 */
async function getVerifiedSupabaseUser(claimedUserId?: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Authentication required: please sign in.');
  }

  if (claimedUserId && user.id !== claimedUserId) {
    throw new Error('Security violation: authenticated identity does not match requested user ID.');
  }

  return user;
}

// ---------------------------------------------------------------------------
// LocalStorage helpers (used strictly when isSupabaseConfigured is FALSE)
// ---------------------------------------------------------------------------
function getLocalResumes(): ResumeRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading local resumes:', err);
    return [];
  }
}

function setLocalResumes(resumes: ResumeRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumes));
  } catch (err) {
    console.error('Error writing local resumes:', err);
  }
}

// ---------------------------------------------------------------------------
// Resume Operations (Strictly Scoped by Authenticated User)
// ---------------------------------------------------------------------------

/**
 * Fetches all resumes belonging exclusively to the specified authenticated user.
 */
export async function fetchAllResumes(userId: string): Promise<ResumeRecord[]> {
  if (!userId) {
    throw new Error('Authentication required to fetch resumes.');
  }

  if (isSupabaseConfigured && supabase) {
    // 1. Verify user identity via supabase.auth.getUser()
    const user = await getVerifiedSupabaseUser(userId);

    // 2. Query resumes strictly filtered by the authenticated user's ID
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase fetchAllResumes error:', error.message);
      throw new Error(`Failed to load resumes: ${error.message}`);
    }

    return (data || []) as ResumeRecord[];
  }

  // Standalone local mode: strictly isolated by userId
  const resumes = getLocalResumes();
  const userResumes = resumes.filter((r) => r.user_id === userId);

  // If local demo candidate has no resumes yet, provide an initial isolated sample resume
  if (userResumes.length === 0 && (userId === 'demo-user-session' || userId.startsWith('demo-'))) {
    const initialDemoResume: ResumeRecord = {
      id: generateRecordId(),
      user_id: userId,
      title: 'Full Stack Engineer - Sample',
      data: DEFAULT_RESUME_DATA,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    resumes.push(initialDemoResume);
    setLocalResumes(resumes);
    return [initialDemoResume];
  }

  return userResumes;
}

/**
 * Fetches a single resume by ID, strictly verifying that the authenticated user owns it.
 */
export async function fetchResumeById(id: string, userId: string): Promise<ResumeRecord | null> {
  if (!id) throw new Error('Resume ID is required.');
  if (!userId) throw new Error('Authentication required.');

  if (isSupabaseConfigured && supabase) {
    const user = await getVerifiedSupabaseUser(userId);

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found or user not authorized via RLS / query filter
        return null;
      }
      console.error('Supabase fetchResumeById error:', error.message);
      throw new Error(`Failed to retrieve resume: ${error.message}`);
    }

    return (data as ResumeRecord) || null;
  }

  // Local storage: strict ownership check
  const resumes = getLocalResumes();
  const match = resumes.find((r) => r.id === id && r.user_id === userId);
  return match || null;
}

/**
 * Persists an existing resume, strictly enforcing that user_id matches the authenticated user.
 */
export async function saveResumeRecord(resume: ResumeRecord, userId: string): Promise<ResumeRecord> {
  if (!userId) {
    throw new Error('Authentication required to save resume.');
  }

  if (resume.user_id !== userId) {
    throw new Error('Ownership mismatch: cannot save a resume belonging to another account.');
  }

  const updatedRecord: ResumeRecord = {
    ...resume,
    user_id: userId,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const user = await getVerifiedSupabaseUser(userId);

    const { data, error } = await supabase
      .from('resumes')
      .update({
        title: updatedRecord.title,
        template_id: updatedRecord.data.customization.templateId,
        data: updatedRecord.data,
        updated_at: updatedRecord.updated_at,
      })
      .eq('id', updatedRecord.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase saveResumeRecord error:', error.message);
      throw new Error(`Failed to save resume: ${error.message}`);
    }

    return data as ResumeRecord;
  }

  // Local storage
  const resumes = getLocalResumes();
  const existingIdx = resumes.findIndex((r) => r.id === resume.id && r.user_id === userId);
  if (existingIdx >= 0) {
    resumes[existingIdx] = updatedRecord;
  } else {
    resumes.unshift(updatedRecord);
  }
  setLocalResumes(resumes);
  return updatedRecord;
}

/**
 * Creates a new resume explicitly owned by the authenticated user.
 * Uses a valid UUID for seamless PostgreSQL UUID primary key compatibility.
 */
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
  if (!userId) {
    throw new Error('Authentication required: please sign in to create a resume.');
  }

  const baseData = initialData
    ? JSON.parse(JSON.stringify(initialData))
    : JSON.parse(JSON.stringify(DEFAULT_RESUME_DATA));
  baseData.customization.templateId = templateId;

  const newId = generateRecordId();
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    const user = await getVerifiedSupabaseUser(userId);

    const { data, error } = await supabase
      .from('resumes')
      .insert({
        id: newId,
        user_id: user.id,
        title: title.trim() || 'Untitled Resume',
        template_id: templateId,
        data: baseData,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase createNewResume error:', error.message);
      throw new Error(`Failed to create resume: ${error.message}`);
    }

    return data as ResumeRecord;
  }

  // Standalone local mode
  const newResume: ResumeRecord = {
    id: newId,
    user_id: userId,
    title: title.trim() || 'Untitled Resume',
    data: baseData,
    created_at: now,
    updated_at: now,
  };

  const resumes = getLocalResumes();
  resumes.unshift(newResume);
  setLocalResumes(resumes);
  return newResume;
}

/**
 * Duplicates a resume owned by the user and saves the duplicate under the user's ID.
 */
export async function duplicateResumeRecord(sourceResume: ResumeRecord, userId: string): Promise<ResumeRecord> {
  if (!userId) {
    throw new Error('Authentication required to duplicate resume.');
  }

  if (sourceResume.user_id !== userId) {
    throw new Error('You do not have permission to duplicate this resume.');
  }

  const newId = generateRecordId();
  const now = new Date().toISOString();
  const duplicatedData = JSON.parse(JSON.stringify(sourceResume.data));

  if (isSupabaseConfigured && supabase) {
    const user = await getVerifiedSupabaseUser(userId);

    const { data, error } = await supabase
      .from('resumes')
      .insert({
        id: newId,
        user_id: user.id,
        title: `${sourceResume.title} (Copy)`,
        template_id: duplicatedData.customization.templateId,
        data: duplicatedData,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase duplicateResumeRecord error:', error.message);
      throw new Error(`Failed to duplicate resume: ${error.message}`);
    }

    return data as ResumeRecord;
  }

  // Standalone local mode
  const duplicated: ResumeRecord = {
    id: newId,
    user_id: userId,
    title: `${sourceResume.title} (Copy)`,
    data: duplicatedData,
    created_at: now,
    updated_at: now,
  };

  const resumes = getLocalResumes();
  resumes.unshift(duplicated);
  setLocalResumes(resumes);
  return duplicated;
}

/**
 * Deletes a resume, verifying that the current authenticated user owns it.
 */
export async function deleteResumeRecord(id: string, userId: string): Promise<boolean> {
  if (!id) throw new Error('Resume ID is required.');
  if (!userId) throw new Error('Authentication required to delete resume.');

  if (isSupabaseConfigured && supabase) {
    const user = await getVerifiedSupabaseUser(userId);

    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Supabase deleteResumeRecord error:', error.message);
      throw new Error(`Failed to delete resume: ${error.message}`);
    }

    return true;
  }

  // Local storage
  const resumes = getLocalResumes();
  const filtered = resumes.filter((r) => !(r.id === id && r.user_id === userId));
  setLocalResumes(filtered);
  return true;
}
