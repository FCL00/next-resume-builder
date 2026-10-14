'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to handle navigation for the "Build Resume" CTA.
 * Ensures:
 * 1. Authenticated users are navigated directly to their destination (/dashboard).
 * 2. Unauthenticated users are redirected to the sign-in page (/login?redirect=...).
 * 3. Asynchronous authentication checks wait for resolution before navigating,
 *    preventing premature redirects or treating unauthenticated users as authenticated.
 */
export function useBuildResume(defaultDestination: string = '/dashboard') {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isPendingRef = useRef(false);
  const targetDestinationRef = useRef(defaultDestination);

  useEffect(() => {
    targetDestinationRef.current = defaultDestination;
  }, [defaultDestination]);

  // When auth state finishes loading, if a navigation was queued while loading, execute it
  useEffect(() => {
    if (isPendingRef.current && !isLoading) {
      isPendingRef.current = false;
      const dest = targetDestinationRef.current;
      if (user) {
        router.push(dest);
      } else {
        router.push(`/login?redirect=${encodeURIComponent(dest)}`);
      }
    }
  }, [isLoading, user, router]);

  const handleBuildResume = useCallback(
    (e?: React.MouseEvent, customDestination?: string) => {
      if (e) {
        e.preventDefault();
      }
      const target = customDestination || targetDestinationRef.current;
      targetDestinationRef.current = target;

      if (isLoading) {
        // Queue navigation until authentication status resolves
        isPendingRef.current = true;
        return;
      }

      if (user) {
        router.push(target);
      } else {
        router.push(`/login?redirect=${encodeURIComponent(target)}`);
      }
    },
    [isLoading, user, router]
  );

  const getTargetHref = useCallback(
    (customDestination?: string) => {
      const target = customDestination || defaultDestination;
      if (isLoading) return target;
      return user ? target : `/login?redirect=${encodeURIComponent(target)}`;
    },
    [isLoading, user, defaultDestination]
  );

  return {
    user,
    isLoading,
    handleBuildResume,
    getTargetHref,
  };
}
