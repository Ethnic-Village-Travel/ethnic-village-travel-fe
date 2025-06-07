import { formatTourDates } from '@/utils/date';

import { Order } from '@/types/order';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StarRating from '@/components/shared/star-rating';

type TourInformationCardProps = {
  order: Order;
};

export default function TourInformationCard({ order }: TourInformationCardProps) {
  const { startDate, endDate, duration, durationShort } = formatTourDates(order.startDate, order.endDate);

  return (
    <Card className="flex flex-col gap-4 bg-primary-5 px-6 py-2">
      <div className="">
        <CardTitle className="text-xl font-semibold">Romantic Maldives</CardTitle>
        <div className="flex items-center gap-2">
          <b>Tour guide:</b> <span>Le Van A</span>
        </div>
      </div>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-500">Review</span>
          <StarRating average={5} readOnly />
        </div>

        <Separator className="h-[53px]" orientation="vertical" />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-500">Days</span>
          <span className="text-base text-dark">5 Days/4 Night</span>
        </div>

        <Separator className="h-[53px]" orientation="vertical" />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-500">Location</span>
          <span className="text-base text-dark">Maldives</span>
        </div>

        <Separator className="h-[53px]" orientation="vertical" />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-500">Aldults</span>
          <span className="text-base text-dark">3</span>
        </div>

        <Separator className="h-[53px]" orientation="vertical" />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-500">Children</span>
          <span className="text-base text-dark">2</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span>{startDate}</span>
        <div className="rounded-lg bg-primary-500 p-2 text-white">{duration}</div>
        <span>{endDate}</span>
      </CardFooter>
    </Card>
  );
}
