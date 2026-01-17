import { z } from 'zod';

import { ApiResponse } from '@/types/api.type';

export function getErrorMessage(err: unknown) {
  const unknownError = 'An unexpected error occurred';

  if (err instanceof z.ZodError) {
    const errors = err.errors.map(error => error.message);
    return errors.join(', ');
  }

  if (err instanceof Error) {
    // Check if this is a Next.js redirect error (contains NEXT_REDIRECT)
    if (err.message?.includes('NEXT_REDIRECT')) {
      return 'Redirecting...';
    }
    return err.message;
  }

  if (typeof err === 'string') {
    return err;
  }

  return unknownError;
}

type ToastFunction = {
  (props: { title: string; variant?: 'default' | 'destructive' }): void;
}

export const handleError = (error: any, toast: ToastFunction) => {
  if (error.message) {
    toast({
      title: error.message,
      variant: 'destructive',
    });
    return;
  }

  if (error.error) {
    toast({
      title: error.error,
      variant: 'destructive',
    });
    return;
  }

  if (error.response?.data) {
    const response = error.response.data as ApiResponse<any>;
    toast({
      title: response.message || 'Something went wrong',
      variant: 'destructive',
    });
    return;
  }

  toast({
    title: 'Something went wrong',
    variant: 'destructive',
  });
};
