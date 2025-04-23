import React from 'react';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/i18n-navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import Providers from './providers';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  throw new Error('This layout is not used anymore');

  const { locale } = params;
  const messages = await getMessages();

  if (!hasLocale(routing.locales, locale) || !messages) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
}
