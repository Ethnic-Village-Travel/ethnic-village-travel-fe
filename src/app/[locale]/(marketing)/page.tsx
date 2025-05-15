'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/lib/i18n-navigation';
import { useQueryConfig } from '@/hooks/useQueryConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FormDemo from '@/components/common/form-demo';
import LanguageSwitcher from '@/components/common/language-switcher';
import PaginationClient from '@/components/common/pagination-client';

export default function HomePage() {
  const t = useTranslations('home');
  const queryConfig = useQueryConfig();

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <Link href="/about" className="text-primary hover:underline">
        {t('about')}
      </Link>
      <LanguageSwitcher />
      <Card>
        <CardHeader>
          <CardTitle>Feature Card</CardTitle>
          <CardDescription>Card description with muted foreground color</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="bg-pri text-sm">
            This card demonstrates the card background and foreground colors, with content showing regular text.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </CardFooter>
      </Card>
      <FormDemo />
      <PaginationClient queryConfig={queryConfig} pageSize={20} showFirstLast />
    </div>
  );
}
