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
      <div className="full-bleed h-[600px]">
        <img src={tour.imageUrl} alt={tour.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col pt-6">
        <div className="flex gap-10 px-[80px] pb-[60px] sm:flex-col-reverse md:flex-col-reverse lg:flex-col-reverse xl:flex-row">
          <div className="w-full space-y-10 xl:max-w-[calc(100%-360px)]">
            <TourDetailHeader {...tour} />
            <TourDetailContent tour={tour} />
          </div>
          <FloatingBookingPanel tour={tour} />
        </div>
        <SimilarTrip tours={[]} /> {/* TODO: Implement similar tours API */}
      </div>
    </div>
  );
};

export default TourDetail;
