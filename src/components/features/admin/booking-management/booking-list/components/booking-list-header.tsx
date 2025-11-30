import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export const BookingListHeader = () => {
  const t = useTranslations('admin.booking.list');

  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-2 text-xl text-muted-foreground">{t('description')}</p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="outline" className="gap-2">
          <span className="text-lg font-semibold">{t('export')}</span>
          <Download className="h-[18px] w-[18px]" />
        </Button>
      </div>
    </div>
  );
};
