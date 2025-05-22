interface TourDetailPageProps {
  params: { slug: string };
}

export default function TourDetail({ params }: TourDetailPageProps) {
  const { slug } = params;
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Tour Page</h1>
      <p className="mt-4 text-lg">Welcome to the Tour Page!</p>
      <p className="mt-4 text-lg">{slug}</p>
    </div>
  );
}
