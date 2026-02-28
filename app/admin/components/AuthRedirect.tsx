"use client";

/**
 * Auth success redirect component
 * Handles redirect to dashboard after successful auth
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthRedirectProps {
  success: boolean;
  userId?: string;
  targetUrl?: string;
}

export function AuthRedirect({ success, userId, targetUrl = "/admin" }: AuthRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    if (success && userId) {
      // Delay slightly to show success message
      const timer = setTimeout(() => {
        router.push(targetUrl);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, userId, router, targetUrl]);

  return null;
}
