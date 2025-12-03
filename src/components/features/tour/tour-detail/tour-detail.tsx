'use client';

import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useTourDetail } from '@/hooks/api/useTour';

import FloatingBookingPanel from './floating-booking-panel';
import SimilarTrip from './similar-trip';
import { TourDetailContent } from './tour-detail-content';
import TourDetailHeader from './tour-detail-header';
import { TourDetailSkeleton } from './tour-detail-skeleton';

const TourDetail = ({ slug }: { slug: string }) => {
  const t = useTranslations('tour.detail');
  const { data: response, isLoading, isError } = useTourDetail(slug);

  if (isLoading) {
    return <TourDetailSkeleton />;
  }

  if (isError || !response || !response.data) {
    return notFound();
  }

  const tour = response.data;

  return (
    <div>
      <div className="full-bleed h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        <img src={tour.imageUrl} alt={tour.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col pt-4 sm:pt-6">
        <div className="flex flex-col-reverse gap-6 pb-10 sm:gap-8 sm:pb-[60px] lg:gap-10 xl:flex-row">
          <div className="w-full space-y-6 sm:space-y-8 lg:space-y-10 xl:max-w-[calc(100%-360px-40px)]">
            <TourDetailHeader {...tour} />
            <TourDetailContent tour={tour} />
          </div>
          <FloatingBookingPanel tour={tour} />
        </div>
        <SimilarTrip tours={[]} />
      </div>
    </div>
  );
};

export default TourDetail;
