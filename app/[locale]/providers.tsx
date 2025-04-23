'use client';

import type * as React from 'react';
import queryClient from '@/core/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence>
        <Toaster position="top-right" />
      </AnimatePresence>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
