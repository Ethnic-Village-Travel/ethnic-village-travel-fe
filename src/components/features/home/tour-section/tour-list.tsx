'use client';

import { cn } from '@/utils';

import { Tour } from '@/types/tour.type';
import { useMediaQuery } from '@/hooks/use-media-query';

import { TourItem } from '../../tour';

interface TourListProps {
  tours: Tour[];
  activeTab: string;
  className?: string;
}

const TourList = ({ tours, activeTab, className }: TourListProps) => {
  const isHorizontal = useMediaQuery('(max-width: 768px)');

  const tourPopular = tours.filter(tour => tour.id % 2 === 0);
  const tourSpecial = tours.filter(tour => tour.id % 2 !== 0);
  const tourCheap = tours.filter(tour => tour.id % 2 === 0);
  const tourRecommended = tours.filter(tour => tour.id % 2 !== 0);

  const filteredTours = () => {
    switch (activeTab) {
      case 'popular':
        return tourPopular;
      case 'special':
        return tourSpecial;
      case 'cheap':
        return tourCheap;
      case 'recommended':
        return tourRecommended;
      default:
        return tours;
    }
  };

  return (
    <div className={cn(`grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`, className)}>
      {filteredTours().map(tour => (
        <TourItem key={tour.id} tour={tour} layout={isHorizontal ? 'horizontal' : 'vertical'} />
      ))}
    </div>
  );
};

export default TourList;
