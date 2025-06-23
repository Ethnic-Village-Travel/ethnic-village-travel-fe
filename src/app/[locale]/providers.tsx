'use client';

import * as React from 'react';
import { setDefaultHeaders } from '@/core/api';
import queryClient from '@/core/queryClient';
import { useProgressStore } from '@/store/useProgressStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useLocale } from 'next-intl';

import { Progress } from '@/components/base/progress';

export default function Providers({ children }: { children: React.ReactNode }) {
  const setIsAnimating = useProgressStore(state => state.setIsAnimating);
  const isAnimating = useProgressStore(state => state.isAnimating);
  const locale = useLocale();

  React.useEffect(() => {
    setDefaultHeaders({
      'Accept-Language': locale,
    });
  }, [locale]);

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

  return (
    <QueryClientProvider client={queryClient}>
      <Progress isAnimating={isAnimating} />
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
