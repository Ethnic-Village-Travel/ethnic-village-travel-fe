import Link from 'next/link';
import { RouteConstant } from '@/core/constants/route';
import { Download, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export const TourListHeader = () => {
  const t = useTranslations('admin.tour.list');
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold">{t('tour_list_title')}</h1>
        <p className="mt-2 text-xl text-muted-foreground">{t('tour_list_description')}</p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="outline" className="gap-2">
          <span className="text-lg font-semibold">{t('import')}</span>
          <Download className="h-[18px] w-[18px]" />
        </Button>
        <Link href={RouteConstant.admin_tour_create}>
          <Button className="gap-2">
            <span className="text-lg font-semibold">{t('add_tour')}</span>
            <UserPlus className="h-[18px] w-[18px]" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
