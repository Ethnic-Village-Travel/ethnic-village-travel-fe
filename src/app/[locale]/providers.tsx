'use client';

import * as React from 'react';
import { useProgressStore } from '@/stores/useProgressStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Progress } from '@/components/base/progress';
import { UserDetailsLoader } from '@/components/features/auth/user-details-loader';

export default function Providers({ children }: { children: React.ReactNode }) {
  const setIsAnimating = useProgressStore(state => state.setIsAnimating);
  const isAnimating = useProgressStore(state => state.isAnimating);

  React.useEffect(() => {
    if (!document) return;

    const handleStart = () => {
      setIsAnimating(true);
    };

    const handleStop = () => {
      setIsAnimating(false);
    };

    document.addEventListener('navigationStart', handleStart);
    document.addEventListener('navigationEnd', handleStop);
    document.addEventListener('navigationError', handleStop);

    return () => {
      document.removeEventListener('navigationStart', handleStart);
      document.removeEventListener('navigationEnd', handleStop);
      document.removeEventListener('navigationError', handleStop);
    };
  }, [setIsAnimating]);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 60 * 1000 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: 'always',
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Progress isAnimating={isAnimating} />
      <UserDetailsLoader />
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
