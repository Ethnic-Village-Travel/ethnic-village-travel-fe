import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { routing } from '@/lib/i18n-navigation';
import { Toaster } from '@/components/ui/toaster';
import Loading from '@/components/shared/loading';

import Providers from './providers';

import '@/styles/globals.css';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

//geistSans.variable

export const metadata: Metadata = {
  title: {
    template: '%s | Ethnic Village Travel',
    default: 'Ethnic Village Travel',
  },
  description: 'Khám phá vẻ đẹp của các làng dân tộc Việt Nam',
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html>
      <body className={`${roboto.variable} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Suspense fallback={<Loading fullScreen text="Đang tải trang..." />}>
              {children}

              <Toaster />
            </Suspense>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
