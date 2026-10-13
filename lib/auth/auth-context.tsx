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

const DEMO_USER: AuthUser = {
  id: 'user-demo-1',
  email: 'alex.morgan@example.com',
  fullName: 'Alex Morgan',
  avatarUrl: 'https://picsum.photos/seed/alexmorgan/200/200',
  isDemo: true,
};

const LOCAL_AUTH_KEY = 'resumai_auth_user_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || 'Member',
              avatarUrl: session.user.user_metadata?.avatar_url,
              isDemo: false,
            });
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Supabase auth session error:', e);
        }
      }

      // Check local stored session or default to DEMO_USER
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(LOCAL_AUTH_KEY);
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(DEMO_USER);
            localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(DEMO_USER));
          }
        } else {
          setUser(DEMO_USER);
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(DEMO_USER));
        }
      }
      setIsLoading(false);
    }

    initAuth();

    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || 'Member',
              avatarUrl: session.user.user_metadata?.avatar_url,
              isDemo: false,
            });
          } else {
            setUser(null);
          }
        }
      );
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const signIn = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'TestPass123!',
        });
        if (error) {
          toast.error(error.message);
          setIsLoading(false);
          return false;
        }
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            isDemo: false,
          });
          toast.success('Signed in successfully');
          setIsLoading(false);
          return true;
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to sign in');
      }
    }

    // Demo / Local fallback
    const authedUser: AuthUser = {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      isDemo: true,
    };
    setUser(authedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(authedUser));
    }
    toast.success('Welcome back!');
    setIsLoading(false);
    return true;
  };

  const signUp = async (email: string, password?: string, fullName?: string): Promise<boolean> => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || 'TestPass123!',
          options: {
            data: { full_name: fullName || 'New Member' },
          },
        });
        if (error) {
          toast.error(error.message);
          setIsLoading(false);
          return false;
        }
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            fullName: fullName || email.split('@')[0],
            isDemo: false,
          });
          toast.success('Account created successfully');
          setIsLoading(false);
          return true;
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to sign up');
      }
    }

    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email,
      fullName: fullName || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      isDemo: true,
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(newUser));
    }
    toast.success('Account registered!');
    setIsLoading(false);
    return true;
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_AUTH_KEY);
    }
    toast.info('Signed out');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
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
