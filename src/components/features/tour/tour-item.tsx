import Link from 'next/link';
import { EntityConstant } from '@/constants/entity';
import { RouteConstant } from '@/constants/route';
import { calculateRatingStats, cn } from '@/utils';
import { formatCurrency } from '@/utils/number';
import { Separator } from '@radix-ui/react-separator';
import { CalendarDays, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import BookmarkButton from '@/components/shared/bookmark-button';
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

  return (
    <Card
      className={cn('flex w-full flex-col', {
        'flex-row': layout === 'horizontal',
      })}
    >
      <Link href={`${RouteConstant.tour}/${tour.slug}`} className="flex flex-col gap-2">
        <img
          src={tour.imageUrl}
          alt={tour.title}
          className={cn('h-full rounded-l-xl object-cover md:w-48', {
            'h-40 w-full rounded-t-xl rounded-bl-none md:w-full': layout === 'vertical',
          })}
        />
      </Link>

      <CardContent
        className={cn({
          'flex w-full flex-col justify-between p-4 pl-5 pt-2': layout === 'horizontal',
          'flex-1 p-4 pt-2': layout === 'vertical',
        })}
      >
        <Link href={`${RouteConstant.tour}/${tour.slug}`} className="flex flex-col gap-2">
          <h3 className={cn('line-clamp-2 overflow-hidden text-lg font-bold leading-tight md:h-[50px] lg:h-[56px]')}>
            {tour.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1 py-1">
            <MapPin className="h-4 w-4" />
            <span className="block max-w-[70px] overflow-hidden truncate text-ellipsis whitespace-nowrap">
              {tour.locations?.map(l => l.city).join(' - ')}
            </span>
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 py-1">
            <CalendarDays className="h-4 w-4" />
            {t('duration', { days: tour.duration, nights: tour.duration - 1 })}
          </Badge>
        </div>
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarRating average={ratingObj.average} readOnly />
            <span className="text-sm text-muted-foreground">
              {ratingObj.average} ({ratingObj.total})
            </span>{' '}
          </div>
          <BookmarkButton entityId={tour.id} entityType={EntityConstant.tour} />
        </div>

        <Separator className="h-px w-full bg-gray-20" />
        <div className="flex h-[52px] items-center justify-between">
          <div className="flex flex-col">
            {tour?.promotions && tour?.promotions?.length > 0 && (
              <span className="text-base font-semibold tracking-wide text-gray-500 line-through">
                {t('price', {
                  price: formatCurrency(tour.adultPrice),
                })}
              </span>
            )}
            <span className="text-xl font-semibold tracking-wide text-primary">
              {t('price', {
                price: formatCurrency(tour.adultPrice, {
                  discount_percent: tour.promotions?.[0]?.discountPercent,
                  max_discount_amount: tour.promotions?.[0]?.maxDiscountAmount,
                }),
              })}
            </span>
          </div>
          {tour.avalableSlots && <span className="text-xs text-muted-foreground">{tour.avalableSlots}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
