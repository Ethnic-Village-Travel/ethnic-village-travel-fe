'use client';

import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AccountTabContent() {
  const t = useTranslations('personal.account');

  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t('profile')}</h2>
        </CardHeader>
        <CardContent className="space-y-6">{/* Add profile settings content here */}</CardContent>
      </Card>

      <Card className="mt-6 w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t('security')}</h2>
        </CardHeader>
        <CardContent className="space-y-6">{/* Add security settings content here */}</CardContent>
      </Card>
    </div>
  );
}
