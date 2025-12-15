import Link from 'next/link';
import { RouteConstant } from '@/core/constants/route';
import { calculateRatingStats, cn } from '@/utils';
import { formatCurrency } from '@/utils/number';
import { Separator } from '@radix-ui/react-separator';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/shared/star-rating';

type TourItemProps = {
  tour: Tour;
  layout?: 'horizontal' | 'vertical';
};

export default function TourItem({ tour, layout = 'vertical' }: TourItemProps) {
  const ratingObj = tour.avgRating
    ? { average: tour.avgRating, total: tour.ratingCount }
    : calculateRatingStats(tour.reviews || []);
  const t = useTranslations('tour.item');

  // Prioritize DIRECT_DISCOUNT promotion for display
  const promotion = tour.promotions?.find(p => p.type === 'DIRECT_DISCOUNT' && p.status === 'ACTIVE');

  const hasPromotion = !!promotion;
  const discountPercent = promotion?.discountPercent;

  return (
    <Card
      className={cn('group relative flex w-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg', {
        'flex-row': layout === 'horizontal',
      })}
    >
      <Link
        href={`${RouteConstant.tour}/${tour.slug}`}
        className={cn('relative shrink-0 overflow-hidden', {
          'w-80': layout === 'horizontal',
          'w-full': layout === 'vertical',
        })}
      >
        <div
          className={cn('relative overflow-hidden', {
            'h-full min-h-[220px]': layout === 'horizontal',
            'aspect-[4/3]': layout === 'vertical',
          })}
        >
          <img
            src={tour.imageUrl}
            alt={tour.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {hasPromotion && discountPercent && (
            <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
              -{discountPercent}%
            </div>
          )}
        </div>
      </Link>

      <CardContent className={cn('flex flex-1 flex-col p-3')}>
        <div className="flex flex-1 flex-col">
          {/* Title */}
          <Link href={`${RouteConstant.tour}/${tour.slug}`} className="group/title mb-2 block h-14">
            <h3 className="line-clamp-2 text-lg font-bold leading-snug transition-colors group-hover/title:text-primary">
              {tour.title}
            </h3>
          </Link>

          <div className="mb-3 space-y-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {tour.locations && tour.locations.length > 0 && (
                <div className="flex items-center gap-1.5" title={tour.locations.map(l => l.city).join(', ')}>
                  <MapPin className="size-4 shrink-0 text-primary" />
                  <span className="line-clamp-1 max-w-[150px] font-medium">
                    {tour.locations.map(l => l.city).join(', ')}
                  </span>
                </div>
              )}

              {tour.ethnics && tour.ethnics.length > 0 && (
                <div className="flex items-center gap-1.5" title={tour.ethnics.map(e => e.name).join(', ')}>
                  <Users className="size-4 shrink-0 text-indigo-500" />
                  <span className="line-clamp-1 max-w-[150px] font-medium">
                    {tour.ethnics.map(e => e.name).join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="size-4 shrink-0 text-emerald-500" />
              <span className="font-medium">
                {t('duration', { days: tour.duration, nights: (tour.duration || 1) - 1 })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StarRating average={ratingObj.average} readOnly />
            <span className="text-sm font-medium text-muted-foreground">
              {ratingObj.average.toFixed(1)} <span className="text-xs">({ratingObj.total})</span>
            </span>
          </div>
        </div>

        {layout === 'vertical' && <Separator className="my-2 h-px w-full bg-gray-200" />}

        <div
          className={cn('flex items-center justify-between', {
            'mt-auto pt-3': layout === 'horizontal',
          })}
        >
          <div className="flex items-baseline gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(tour.adultPrice, {
                  discount_percent: promotion?.discountPercent,
                  max_discount_amount: promotion?.maxDiscountAmount,
                })}
              </span>
            </div>
            {hasPromotion && (
              <span className="text-sm font-medium text-gray-400 line-through">{formatCurrency(tour.adultPrice)}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
