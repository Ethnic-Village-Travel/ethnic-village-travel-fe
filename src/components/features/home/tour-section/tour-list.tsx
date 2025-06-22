'use client';

import { cn } from '@/utils';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { useMediaQuery } from '@/hooks/use-media-query';

import { TourItem } from '../../tour';

interface TourListProps {
  tours: Tour[];
  isLoading?: boolean;
  isError?: boolean;
  className?: string;
}

const TourList = ({ tours, isLoading, isError, className }: TourListProps) => {
  const isHorizontal = useMediaQuery('(max-width: 768px)');
  const t = useTranslations('common');

  if (isLoading) {
    return (
      <div className={cn(`grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`, className)}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="h-80 w-full animate-pulse rounded-lg bg-gray-200"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-50">
        <p className="text-gray-500">{t('error_loading_list')}</p>
      </div>
    );
  }

  if (!tours || tours.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-50">
        <p className="text-gray-500">{t('no_results')}</p>
      </div>
    );
  }

  return (
    <div className={cn(`grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`, className)}>
      {tours.map(tour => (
        <TourItem key={tour.id} tour={tour} layout={isHorizontal ? 'horizontal' : 'vertical'} />
      ))}
    </div>
  );
};

export default TourList;
