'use client';

import { EntityType } from '@/constants/entity';
import { useUserStore } from '@/store/useUserStore';
import { calculateRatingStats } from '@/utils';
import { Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookmarkButton } from '@/components/shared/bookmark-button';
import StarRating from '@/components/shared/star-rating';

import AvailableTickets from './available-tickets';

const TourDetailHeader = (tour: Tour) => {
  const t = useTranslations('tour.detail');
  const ratingObj = calculateRatingStats(tour.reviews || []);
  const { details } = useUserStore();
  const isBookmarked = details?.bookmarks?.some(bookmark => bookmark.entityId === tour.id);

  return (
    <div className="flex flex-col gap-2.5">
      <h1 className="text-[40px] font-bold text-dark">{tour.title}</h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* Review Section */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-500">{t('review')}</span>
            <StarRating average={ratingObj.average} readOnly />
          </div>

          <Separator className="h-[53px]" orientation="vertical" />

          {/* Days Section */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-500">{t('days')}</span>
            <span className="text-base text-dark">
              {t('duration_format', { days: tour.duration, nights: tour.duration - 1 })}
            </span>
          </div>

          <Separator className="h-[53px]" orientation="vertical" />

          {/* Location Section */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-500">{t('location')}</span>
            <span className="text-base text-dark">{tour.locations?.map(location => location.city).join(' - ')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <BookmarkButton
            variant="outline"
            size="icon"
            entityId={tour.id.toString()}
            entityType={EntityType.TOUR}
            isBookmarkedDefault={isBookmarked}
          />

          <Button
            variant="outline"
            className="hover:border-primary-500/80 hover:text-primary-500/80 h-[38px] border-primary-500 text-primary-500 [&_svg]:size-5"
          >
            <Share2 className="mr-2" />
            {t('share')}
          </Button>
        </div>
      </div>

      <AvailableTickets tour={tour} />
    </div>
  );
};

export default TourDetailHeader;
