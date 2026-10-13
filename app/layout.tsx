import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth/auth-context';

export const metadata: Metadata = {
  title: 'ResumAI - AI Resume Builder SaaS',
  description: 'Build high-impact, professional resumes in minutes with intelligent optional AI writing assistance, customizable templates, and PDF export.',
  openGraph: {
    title: 'ResumAI - AI Resume Builder SaaS',
    description: 'Build high-impact, professional resumes in minutes with intelligent optional AI writing assistance, customizable templates, and PDF export.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumAI - AI Resume Builder SaaS',
    description: 'Build high-impact, professional resumes in minutes with intelligent optional AI writing assistance, customizable templates, and PDF export.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased font-sans selection:bg-indigo-500 selection:text-white" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
