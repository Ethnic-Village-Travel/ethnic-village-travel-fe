import Link from 'next/link';
import { RouteConstant } from '@/constants/route';
import { calculateRatingStats, cn } from '@/utils';
import { formatCurrencyVND } from '@/utils/number';
import { Separator } from '@radix-ui/react-separator';
import { CalendarDays, MapPin, Star, StarHalf } from 'lucide-react';

import { Tour } from '@/types/tour.type';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type TourItemProps = {
  tour: Tour;
  layout?: 'horizontal' | 'vertical';
};

export default function TourItem({ tour, layout = 'vertical' }: TourItemProps) {
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
      className={cn('flex w-full flex-col', {
        'flex-row': layout === 'horizontal',
      })}
    >
      <img
        src={tour.image_url}
        alt={tour.title}
        className={cn('h-full w-48 rounded-l-xl object-cover', {
          'h-40 w-full rounded-t-xl': layout === 'vertical',
        })}
      />

      <CardContent
        className={cn({
          'flex w-full flex-col justify-between p-4 pt-2': layout === 'horizontal',
          'flex-1 p-4 pt-2': layout === 'vertical',
        })}
      >
        <Link href={`${RouteConstant.tour}/${tour.slug}`} className="flex flex-col gap-2">
          <h3 className={cn('line-clamp-2 h-[56px] text-xl font-bold')}>{tour.title}</h3>
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
          <div className="flex items-center gap-2">
            {renderStars()}
            <span className="text-sm text-muted-foreground">
              {ratingObj.average} ({ratingObj.total})
            </span>
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
        </Link>
      </CardContent>
    </Card>
  );
}
