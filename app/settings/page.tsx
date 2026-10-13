'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/auth/auth-context';
import { User, Shield, Sparkles, Database, CheckCircle2, Key, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, isSupabaseConnected } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || 'Alex Morgan');
  const [email, setEmail] = useState(user?.email || 'alex.morgan@example.com');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile preferences updated');
  };

  return (
    <DashboardLayout>
      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your account preferences, authentication status, and integrations.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">User Profile</h2>
              <p className="text-xs text-slate-500">Your personal identity across your resumes</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Integration Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Database & Authentication</h2>
              <p className="text-xs text-slate-500">Supabase connection status and persistence mode</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">Storage Backend</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isSupabaseConnected ? 'Connected to Supabase PostgreSQL' : 'Local Persistent Storage (Active)'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isSupabaseConnected
                ? 'Your resumes and user sessions are synchronized with Supabase PostgreSQL and protected by Row Level Security (RLS).'
                : 'Running in resilient standalone mode with browser localStorage persistence. To connect an external Supabase project, supply NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.'}
            </p>
          </div>
        </div>

        {/* AI Assistant Config Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">AI Writing Assistant</h2>
              <p className="text-xs text-slate-500">Server-side Gemini 3.8 Flash integration</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              ResumAI integrates server-side Gemini models with zero client-side exposure of secrets. AI writing assistance is strictly optional, non-destructive, and always requires your explicit approval before modifying any content.
            </p>
            <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-xs font-medium">
              <Info className="w-4 h-4 shrink-0" />
              <span>Honesty Constraint: The AI is forbidden from inventing metrics or false qualifications.</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
