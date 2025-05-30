'use client';

import { calculateRatingStats } from '@/utils';
import { BookmarkIcon, Heart, Share2 } from 'lucide-react';

import { Tour } from '@/types/tour.type';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import StarRating from '@/components/shared/star-rating';

import AvailableTickets from './available-tickets';

const availableTickets = [
  { id: '1', day: 'Sat', date: '19 Apr' },
  { id: '2', day: 'Sun', date: '20 Apr' },
  { id: '3', day: 'Mon', date: '21 Apr', isSelected: true },
  { id: '4', day: 'Tue', date: '22 Apr' },
  { id: '5', day: 'Wed', date: '23 Apr', isSpecial: true, specialText: 'Special Holiday' },
  { id: '6', day: 'Thu', date: '24 Apr' },
  { id: '7', day: 'Fri', date: '25 Apr' },
  { id: '8', day: 'Sat', date: '26 Apr' },
];

const TourDetailHeader = (tour: Tour) => {
  const ratingObj = calculateRatingStats(tour.rating || []);

  return (
    <div className="flex flex-col gap-2.5">
      <h1 className="text-[40px] font-bold text-dark">{tour.title}</h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* Review Section */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-500">Review</span>
            <StarRating average={ratingObj.average} readOnly />
          </div>

          <Separator className="h-[53px]" orientation="vertical" />

          {/* Days Section */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-500">Days</span>
            <span className="text-base text-dark">5 Days/4 Night</span>
          </div>

          <Separator className="h-[53px]" orientation="vertical" />

          {/* Location Section */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-500">Location</span>
            <span className="text-base text-dark">Maldives</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            className="hover:border-primary-500/80 h-[38px] w-[38px] border-primary-500 [&_svg]:size-5"
          >
            <BookmarkIcon className="text-primary-500" />
          </Button>
          <Button
            variant="outline"
            className="hover:border-primary-500/80 hover:text-primary-500/80 h-[38px] border-primary-500 text-primary-500 [&_svg]:size-5"
          >
            <Share2 className="mr-2" />
            Share
          </Button>
        </div>
      </div>

      <AvailableTickets tickets={availableTickets} />
    </div>
  );
};

export default TourDetailHeader;
