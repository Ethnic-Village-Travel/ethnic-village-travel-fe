'use client';

import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function TransactionTabContent() {
  const t = useTranslations('personal.transaction');

  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      <Card className="w-full">
        <CardContent>
          <div className="flex items-center justify-center py-8 text-gray-500">{t('no_transactions')}</div>
        </CardContent>
      </Card>
    </div>
  );
}
