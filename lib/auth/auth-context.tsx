'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { toast } from 'sonner';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password?: string) => Promise<boolean>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  isSupabaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = 'resumai_auth_user_v2';

export const DEMO_CREDENTIALS = {
  email: 'demo@resumai.com',
  password: 'DemoAccount2026!',
  fullName: 'Demo Candidate',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to extract clean full name from user metadata or email
  const resolveFullName = (
    metadata?: Record<string, any> | null,
    profileName?: string | null,
    email?: string | null
  ): string => {
    if (profileName && profileName.trim()) return profileName.trim();
    if (metadata?.full_name && typeof metadata.full_name === 'string' && metadata.full_name.trim()) {
      return metadata.full_name.trim();
    }
    if (metadata?.name && typeof metadata.name === 'string' && metadata.name.trim()) {
      return metadata.name.trim();
    }
    if (email && email.includes('@')) {
      return email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return 'User';
  };

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('Supabase getSession error:', error.message);
          }

          if (session?.user && isMounted) {
            let profileName: string | null = null;
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', session.user.id)
                .single();
              if (profile?.full_name) {
                profileName = profile.full_name;
              }
            } catch {
              // Ignore profile query fallback
            }

            const isDemoUser =
              session.user.email?.toLowerCase().includes('demo') ||
              session.user.id === 'd3b07384-d113-4a44-9c88-123456789abc';

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: resolveFullName(session.user.user_metadata, profileName, session.user.email),
              avatarUrl: session.user.user_metadata?.avatar_url,
              isDemo: isDemoUser,
            });
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Supabase auth initialization error:', e);
        }

        // When Supabase is configured and there is no active session, user is strictly unauthenticated
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      // Standalone local mode (only when Supabase is not configured)
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(LOCAL_AUTH_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.id && parsed.email) {
              if (isMounted) setUser(parsed);
            } else {
              localStorage.removeItem(LOCAL_AUTH_KEY);
              if (isMounted) setUser(null);
            }
          } catch {
            localStorage.removeItem(LOCAL_AUTH_KEY);
            if (isMounted) setUser(null);
          }
        } else {
          if (isMounted) setUser(null);
        }
      }

      if (isMounted) setIsLoading(false);
    }

    initAuth();

    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { data: authListener } = client.auth.onAuthStateChange(
        async (_event, session) => {
          if (!isMounted) return;
          if (session?.user) {
            let profileName: string | null = null;
            try {
              const { data: profile } = await client
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', session.user.id)
                .single();
              if (profile?.full_name) {
                profileName = profile.full_name;
              }
            } catch {
              // Ignore profile query fallback
            }

            const isDemoUser =
              session.user.email?.toLowerCase().includes('demo') ||
              session.user.id === 'd3b07384-d113-4a44-9c88-123456789abc';

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: resolveFullName(session.user.user_metadata, profileName, session.user.email),
              avatarUrl: session.user.user_metadata?.avatar_url,
              isDemo: isDemoUser,
            });
          } else {
            setUser(null);
          }
          setIsLoading(false);
        }
      );

      return () => {
        isMounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    const trimmedEmail = email.trim().toLowerCase();
    const isDemo =
      trimmedEmail === 'demo@resumai.com' ||
      trimmedEmail === 'demo@resumai.example.com' ||
      trimmedEmail === 'alex.morgan@example.com';

    if (isSupabaseConfigured && supabase) {
      try {
        let authResult = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password || '',
        });

        // If demo account sign in fails on Supabase because user doesn't exist yet,
        // attempt to auto-register the demo user in Supabase
        if (
          authResult.error &&
          isDemo &&
          (password === 'DemoAccount2026!' || password === 'demo123')
        ) {
          const signUpRes = await supabase.auth.signUp({
            email: trimmedEmail,
            password: password,
            options: {
              data: { full_name: 'Demo Candidate' },
            },
          });

          if (signUpRes.data?.session?.user) {
            authResult = {
              data: { user: signUpRes.data.session.user, session: signUpRes.data.session },
              error: null,
            };
          } else if (!signUpRes.error) {
            // Retry sign in
            const retryRes = await supabase.auth.signInWithPassword({
              email: trimmedEmail,
              password: password,
            });
            if (retryRes.data?.user) {
              authResult = retryRes;
            }
          }
        }

        if (authResult.error) {
          if (isDemo) {
            toast.error(
              'Demo account not found in Supabase Auth. To seed it, run supabase/migrations/20240101000001_seed_demo_user.sql in the Supabase SQL editor.'
            );
          } else {
            toast.error(authResult.error.message || 'Invalid email or password.');
          }
          setIsLoading(false);
          return false;
        }

        if (authResult.data.user) {
          let profileName: string | null = null;
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', authResult.data.user.id)
              .single();
            if (profile?.full_name) {
              profileName = profile.full_name;
            }
          } catch {
            // Ignore
          }

          setUser({
            id: authResult.data.user.id,
            email: authResult.data.user.email || trimmedEmail,
            fullName: resolveFullName(
              authResult.data.user.user_metadata,
              profileName,
              authResult.data.user.email || trimmedEmail
            ),
            avatarUrl: authResult.data.user.user_metadata?.avatar_url,
            isDemo: isDemo,
          });
          toast.success('Signed in successfully');
          setIsLoading(false);
          return true;
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to sign in');
        setIsLoading(false);
        return false;
      }
    }

    // Standalone local mode fallback (strictly when Supabase is not configured)
    if (isDemo) {
      if (password && password !== 'DemoAccount2026!' && password !== 'demo123') {
        toast.error('Invalid password for demo account. Use DemoAccount2026!');
        setIsLoading(false);
        return false;
      }

      const demoUser: AuthUser = {
        id: 'demo-user-session',
        email: trimmedEmail,
        fullName: 'Demo Candidate',
        isDemo: true,
      };

      setUser(demoUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(demoUser));
      }
      toast.success('Signed in as Demo Candidate');
      setIsLoading(false);
      return true;
    }

    // Standard local user sign in
    const localUser: AuthUser = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      email: trimmedEmail,
      fullName: trimmedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      isDemo: false,
    };

    setUser(localUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser));
    }
    toast.success('Signed in');
    setIsLoading(false);
    return true;
  };

  const signUp = async (email: string, password?: string, fullName?: string): Promise<boolean> => {
    setIsLoading(true);
    const trimmedEmail = email.trim().toLowerCase();
    const cleanName = fullName?.trim() || resolveFullName(null, null, trimmedEmail);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: password || '',
          options: {
            data: { full_name: cleanName },
          },
        });

        if (error) {
          toast.error(error.message || 'Failed to create account.');
          setIsLoading(false);
          return false;
        }

        if (data.user) {
          // If Supabase requires email confirmation and session is not yet active
          if (!data.session) {
            toast.info('Account registered! Please check your email to confirm your account before signing in.');
            setIsLoading(false);
            return true;
          }

          setUser({
            id: data.user.id,
            email: data.user.email || trimmedEmail,
            fullName: cleanName,
            isDemo: false,
          });
          toast.success('Account created successfully');
          setIsLoading(false);
          return true;
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to sign up');
        setIsLoading(false);
        return false;
      }
    }

    // Standalone local mode
    const localUser: AuthUser = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      email: trimmedEmail,
      fullName: cleanName,
      isDemo: false,
    };

    setUser(localUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser));
    }
    toast.success('Account created');
    setIsLoading(false);
    return true;
  };

  const signOut = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('SignOut error:', e);
      }
    }

    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_AUTH_KEY);
    }
    setIsLoading(false);
    toast.info('Signed out');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success('Password reset email sent');
      return true;
    }

    toast.success(`Password reset instructions simulated for ${email}`);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        isSupabaseConnected: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
