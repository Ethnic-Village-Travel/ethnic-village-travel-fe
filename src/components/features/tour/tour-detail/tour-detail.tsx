'use client';

import { useMemo } from 'react';
import { notFound } from 'next/navigation';
import { tourApi } from '@/data/apis/tour.api';
import { useQuery } from '@tanstack/react-query';

import { useTourDetail } from '@/hooks/api/useTour';

import FloatingBookingPanel from './floating-booking-panel';
import SimilarTrip from './similar-trip';
import { TourDetailContent } from './tour-detail-content';
import TourDetailHeader from './tour-detail-header';
import { TourDetailSkeleton } from './tour-detail-skeleton';

const TourDetail = ({ slug }: { slug: string }) => {
  const { data: response, isLoading, isError } = useTourDetail(slug);
  const tour = response?.data;

  const ethnicIds = useMemo(
    () => (tour?.ethnics || []).map(ethnic => ethnic.id).filter((id): id is string => Boolean(id)),
    [tour?.ethnics],
  );

  const { data: similarTours } = useQuery({
    queryKey: ['similar-tours', tour?.slug, ethnicIds],
    queryFn: async () => {
      const response = await tourApi.getTourList({
        page: 0,
        size: 4,
        ethnicIds,
      });

      const content = response.data?.content || [];
      return content.filter(similar => similar.slug !== tour?.slug).slice(0, 4);
    },
    enabled: !!tour && ethnicIds.length > 0,
  });

  if (isLoading) {
    return <TourDetailSkeleton />;
  }

  if (isError || !tour) {
    return notFound();
  }

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
        <SimilarTrip tours={similarTours || []} />
      </div>
    </div>
  );
};

export default TourDetail;
