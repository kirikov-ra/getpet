"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { token, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated && !token) {
      router.replace('/login');
    }
  }, [_hasHydrated, token, router]);

  if (!_hasHydrated || (!token && _hasHydrated)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
};