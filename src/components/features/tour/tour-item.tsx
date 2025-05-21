import Link from 'next/link';
import { RouteConstant } from '@/constants/route-constants';
import { calculateRatingStats, cn } from '@/utils';
import { formatCurrencyVND } from '@/utils/number';
import { Separator } from '@radix-ui/react-separator';
import { CalendarDays, MapPin, Star, StarHalf } from 'lucide-react';

import { Tour } from '@/types/tour.type';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export enum Layout {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

type TourItemProps = {
  tour: Tour;
  layout?: Layout.HORIZONTAL | Layout.VERTICAL;
};

export default function TourItem({ tour, layout = Layout.VERTICAL }: TourItemProps) {
  const ratingObj = calculateRatingStats(tour.rating || []);

  const renderStars = () => (
    <div className="flex items-center">
      {[...Array(Math.floor(ratingObj.average))].map((_, i) => (
        <Star key={i} strokeWidth={0} className="h-5 w-5 fill-star" />
      ))}
      {ratingObj.average % 1 >= 0.5 && <StarHalf strokeWidth={0} className="h-5 w-5 fill-star" />}
    </div>
  );

  return (
    <Card
      className={cn({
        'flex max-w-2xl flex-row': layout === Layout.HORIZONTAL,
        'flex w-80 flex-col': layout === Layout.VERTICAL,
      })}
    >
      {layout === Layout.HORIZONTAL ? (
        <img src={tour.image_url} alt={tour.title} className="h-48 w-48 rounded-l-xl object-cover" />
      ) : (
        <img src={tour.image_url} alt={tour.title} className="h-40 w-full rounded-t-xl object-cover" />
      )}
      <CardContent
        className={cn({
          'flex w-full flex-col justify-between p-4 pt-2': layout === Layout.HORIZONTAL,
          'p-4 pt-2': layout === Layout.VERTICAL,
        })}
      >
        <Link href={RouteConstant.tour_detail} className="block">
          <h3 className={cn('mb-1 line-clamp-2 text-xl font-bold', { 'mb-3': layout === Layout.HORIZONTAL })}>
            {tour.title}
          </h3>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 py-1">
              <MapPin className="h-4 w-4" />
              {tour.pick_up_location}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 py-1">
              <CalendarDays className="h-4 w-4" />
              {tour.days}
            </Badge>
          </div>
          <div className="mb-2 flex items-center gap-2">
            {renderStars()}
            <span className="text-sm text-muted-foreground">
              {ratingObj.average} ({ratingObj.total})
            </span>
          </div>

          <Separator className="my-2 h-px w-full bg-gray-20" />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-wide text-gray-500 line-through">
                {formatCurrencyVND(tour.price)}
              </span>
              <span className="text-xl font-semibold tracking-wide text-primary">
                {formatCurrencyVND(
                  tour.price,
                  tour.promotions?.[0].discount_percent,
                  tour.promotions?.[0].max_discount_amount,
                )}
                /người{' '}
              </span>
            </div>
            {tour.max_slot && <span className="text-xs text-muted-foreground">Max: {tour.max_slot}</span>}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
