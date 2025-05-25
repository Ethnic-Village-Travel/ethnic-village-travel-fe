'use client';

import { Tour } from '@/types/tour.type';

interface TourDetailReviewsProps {
  tour: Tour;
}

export function TourDetailReviews({ tour }: TourDetailReviewsProps) {
  return <div className="text-[16px] leading-[26px]">Reviews</div>;
}
