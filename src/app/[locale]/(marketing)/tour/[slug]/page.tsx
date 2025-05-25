import { notFound } from 'next/navigation';
import { MOCK_TOURS } from '@/data/tours';

interface TourDetailPageProps {
  params: { slug: string };
}

export default function TourDetail({ params }: TourDetailPageProps) {
  const { slug } = params;
  const tourData = MOCK_TOURS.find(tour => tour.slug === slug);
  if (!tourData) {
    console.log('Tour not found');
    return notFound();
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">{tourData.title}</h1>
      <p className="mt-4 text-lg">Welcome to the Tour Page!</p>
      <p className="mt-4 text-lg">{slug}</p>
    </div>
  );
}
