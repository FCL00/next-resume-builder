'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, DEMO_CREDENTIALS } from '@/lib/auth/auth-context';
import { Sparkles, Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signIn, isLoading } = useAuth();
  
  // Safe redirect path validation (prevents open redirects)
  const rawRedirect = searchParams.get('redirect');
  const redirectTarget =
    rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
      ? rawRedirect
      : '/dashboard';

  const [email, setEmail] = useState('demo@resumai.com');
  const [password, setPassword] = useState('DemoAccount2026!');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated and not loading, redirect immediately to intended destination
  useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirectTarget);
    }
  }, [user, isLoading, redirectTarget, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await signIn(email, password);
    setSubmitting(false);
    if (success) {
      router.push(redirectTarget);
    }
  };

  const handleDemoSignIn = async () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setSubmitting(true);
    const success = await signIn(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    setSubmitting(false);
    if (success) {
      router.push(redirectTarget);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    toast.info('Filled demo credentials into form fields.');
  };

  const signUpHref = `/signup${
    redirectTarget !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''
  }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
            R
          </div>
          <span className="font-bold text-slate-900 text-xl tracking-tight">ResumAI</span>
        </Link>
        <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Or{' '}
          <Link href={signUpHref} className="font-medium text-indigo-600 hover:text-indigo-500">
            create a new account for free
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10 space-y-5">
          {/* Demo Credentials Box */}
          <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Demo Credentials
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 underline"
              >
                Copy to inputs
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-mono bg-white/70 p-2 rounded-lg border border-indigo-100/60">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Email:</span>
                <span className="select-all font-semibold">{DEMO_CREDENTIALS.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Password:</span>
                <span className="select-all font-semibold">{DEMO_CREDENTIALS.password}</span>
              </div>
            </div>
            <p className="text-[11px] text-indigo-800/80">
              You can type these manually into the form below or click instant sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sam.wong@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-indigo-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>Sign In</span>
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400">Or use 1-click access</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>1-Click Sign In with Demo Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
