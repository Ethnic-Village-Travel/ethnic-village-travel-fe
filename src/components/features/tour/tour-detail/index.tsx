import { MOCK_TOURS } from '@/data/tours';

import { Tour } from '@/types/tour.type';

import FloatingBookingPanel from './floating-booking-panel';
import SimilarTrip from './similar-trip';
import { TourDetailContent } from './tour-detail-content';
import TourDetailHeader from './tour-detail-header';

const TourDetail = ({ tour }: { tour: Tour }) => {
  return (
    <div className="flex gap-10 px-[80px] pb-[60px] pt-6">
      <div className="w-full max-w-[calc(100%-360px)] space-y-10">
        <TourDetailHeader {...tour} />
        <TourDetailContent tour={tour} />
        <SimilarTrip tours={MOCK_TOURS.slice(0, 3)} />
      </div>
      <FloatingBookingPanel />
    </div>
  );
};

export default TourDetail;
