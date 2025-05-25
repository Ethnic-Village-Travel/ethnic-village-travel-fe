import Link from 'next/link';
import { EntityConstant } from '@/constants/entity';
import { RouteConstant } from '@/constants/route';
import { calculateRatingStats, cn } from '@/utils';
import { formatCurrencyVND } from '@/utils/number';
import { Separator } from '@radix-ui/react-separator';
import { CalendarDays, MapPin } from 'lucide-react';

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
  const ratingObj = calculateRatingStats(tour.rating || []);

  return (
    <Card
      className={cn('flex w-full flex-col', {
        'flex-row': layout === 'horizontal',
      })}
    >
      <Link href={`${RouteConstant.tour}/${tour.slug}`} className="flex flex-col gap-2">
        <img
          src={tour.image_url}
          alt={tour.title}
          className={cn('h-full w-48 rounded-l-xl object-cover', {
            'h-40 w-full rounded-t-xl rounded-bl-none': layout === 'vertical',
          })}
        />
      </Link>

      <CardContent
        className={cn({
          'flex w-full flex-col justify-between p-4 pt-2': layout === 'horizontal',
          'flex-1 p-4 pt-2': layout === 'vertical',
        })}
      >
        <Link href={`${RouteConstant.tour}/${tour.slug}`} className="flex flex-col gap-2">
          <h3 className={cn('line-clamp-2 h-[56px] text-lg font-bold leading-tight')}>{tour.title}</h3>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1 py-1">
            <MapPin className="h-4 w-4" />
            {tour.pick_up_location}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 py-1">
            <CalendarDays className="h-4 w-4" />
            {tour.days}
          </Badge>
        </div>
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarRating average={ratingObj.average} />
            <span className="text-sm text-muted-foreground">
              {ratingObj.average} ({ratingObj.total})
            </span>{' '}
          </div>
          <BookmarkButton entityId={1} entityType={EntityConstant.tour} />
        </div>

        <Separator className="h-px w-full bg-gray-20" />
        <div className="flex h-[52px] items-center justify-between">
          <div className="flex flex-col">
            {tour?.promotions && tour?.promotions?.length > 0 && (
              <span className="text-base font-semibold tracking-wide text-gray-500 line-through">
                {formatCurrencyVND(tour.price)}
              </span>
            )}
            <span className="text-xl font-semibold tracking-wide text-primary">
              {formatCurrencyVND(
                tour.price,
                tour.promotions?.[0]?.discount_percent || 0,
                tour.promotions?.[0]?.max_discount_amount || 0,
              )}
              /người
            </span>
          </div>
          {tour.max_slot && <span className="text-xs text-muted-foreground">Max: {tour.max_slot}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
