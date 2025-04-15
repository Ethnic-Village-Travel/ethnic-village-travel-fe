import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const Env = createEnv({
  server: {
    // ARCJET_KEY: z.string().startsWith('ajkey_').optional(),
    // CLERK_SECRET_KEY: z.string().min(1),
    // DATABASE_URL: z.string().optional(),
    // LOGTAIL_SOURCE_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_CLIENT_URI: z.string().optional(),
    NEXT_PUBLIC_SERVER_URI: z.string().optional(),
    // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    // NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    NEXT_PUBLIC_CLIENT_URI: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SERVER_URI: process.env.NEXT_PUBLIC_SERVER_URI,
    NODE_ENV: process.env.NODE_ENV,
  },
});
