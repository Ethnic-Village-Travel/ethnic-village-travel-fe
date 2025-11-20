import TourDetail from '@/modules/tour/tour-detail';

interface TourDetailProps {
  params: {
    slug: string;
  };
}

export default function TourDetailPage({ params }: TourDetailProps) {
  return <TourDetail slug={params.slug} />;
}
