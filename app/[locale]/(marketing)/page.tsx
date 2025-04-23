'use client';

import { Toast } from '@/helpers/toast';
import { Link } from '@/libs/i18n-navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/language-switcher';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <Link href="/about" className="text-primary hover:underline">
        {t('about')}
      </Link>
      <LanguageSwitcher />
      <Button onClick={() => Toast.success('Success!')}>Test toast</Button>
    </div>
  );
}
