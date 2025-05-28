import { notFound } from 'next/navigation';
import { MOCK_TOURS } from '@/data/tours';

import TourDetail from '@/components/features/tour/tour-detail';

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
    <div className="">
      <div className="full-bleed h-[600px]">
        <img src={tour.image_url} alt={tour.title} className="h-full w-full object-cover" />
      </div>

      <TourDetail tour={tour} />
    </div>
  );
}
