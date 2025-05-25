'use client';

import { cn } from '@/utils';

import { Tour } from '@/types/tour.type';

import TourItem from '../tour-item';

interface SimilarTripProps {
  tours: Tour[];
  className?: string;
}

const SimilarTrip = ({ tours, className }: SimilarTripProps) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Similar Trips</h2>
      <div className={cn(`grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`, className)}>
        {tours.map(tour => (
          <TourItem key={tour.id} tour={tour} layout="vertical" />
        ))}
      </div>
    </div>
  );
};

export default SimilarTrip;
