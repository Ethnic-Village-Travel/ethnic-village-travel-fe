import { notFound } from 'next/navigation';
import { MOCK_TOURS } from '@/data/tours';

import SimilarTrip from '@/components/features/tour/detail/similar-trip';
import { TourDetailContent } from '@/components/features/tour/detail/tour-detail-content';
import TourDetailHeader from '@/components/features/tour/detail/tour-detail-header';

interface TourDetailProps {
  params: {
    slug: string;
  };
}

export default function TourDetailPage({ params }: TourDetailProps) {
  const tour = MOCK_TOURS.find(tour => tour.slug === params.slug);

  if (!tour) {
    console.log('Tour not found:', params.slug);
    return notFound();
  }

  return (
    <div>
      <div className="full-bleed h-[600px]">
        <img src={tour.image_url} alt={tour.title} className="h-full w-full object-cover" />
      </div>

      <div className="px-[80px] pb-[60px] pt-6">
        <div className="space-y-10">
          <TourDetailHeader {...tour} />
          <TourDetailContent tour={tour} />
          <SimilarTrip tours={MOCK_TOURS.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}
