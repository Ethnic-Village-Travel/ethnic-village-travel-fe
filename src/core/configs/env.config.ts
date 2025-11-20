export const envConfig = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  CHATBOT_API_URL: process.env.NEXT_PUBLIC_CHATBOT_API_URL || '',
  SERVER_URI: process.env.NEXT_PUBLIC_SERVER_URI || '',
  CLIENT_URI: process.env.NEXT_PUBLIC_CLIENT_URI || '',
  VERCEL_PROJECT_PRODUCTION_URL: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL || '',
  VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL || '',
};
