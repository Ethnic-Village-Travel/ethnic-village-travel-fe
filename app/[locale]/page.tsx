import { Link } from '@/libs/i18n-navigation';
import { useTranslations } from 'next-intl';

import LanguageSwitcher from '@/components/language-switcher';

export default function Home() {
  const t = useTranslations('home');
  const a = 4 / 0;
  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href="/about">{t('about')}</Link>
      <LanguageSwitcher />
      {a}
    </div>
  );
}
