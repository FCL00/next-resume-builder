'use client';

import React from 'react';
import Link from 'next/link';
import { useBuildResume } from '@/lib/hooks/use-build-resume';

interface BuildResumeCTAProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  'aria-label'?: string;
}

/**
 * Reusable CTA component for "Build Resume" actions across the application.
 * Reliably routes authenticated users to /dashboard and unauthenticated users to /login?redirect=...
 * Preserves existing styles, animations, and icons.
 */
export function BuildResumeCTA({
  href = '/dashboard',
  className,
  children,
  onClick,
  'aria-label': ariaLabel,
}: BuildResumeCTAProps) {
  const { handleBuildResume, getTargetHref } = useBuildResume(href);

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    handleBuildResume(e, href);
  };

  return (
    <Link
      href={getTargetHref(href)}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
