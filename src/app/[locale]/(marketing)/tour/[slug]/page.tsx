import TourDetail from '@/components/features/tour/tour-detail';

type TourDetailProps = {
  params: {
    slug: string;
  };
}

export default function TourDetailPage({ params }: TourDetailProps) {
  return <TourDetail slug={params.slug} />;
}
