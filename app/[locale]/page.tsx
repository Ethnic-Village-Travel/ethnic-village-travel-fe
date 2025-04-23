import { Link } from '@/libs/i18n-navigation';
import { useTranslations } from 'next-intl';

import LanguageSwitcher from '@/components/language-switcher';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="text-primary hover:underline">
            {t('about')}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </main>
  );
}
