import { MOCK_TOURS } from '@/data/tours';

import { Tour } from '@/types/tour.type';

import FloatingBookingPanel from './floating-booking-panel';
import SimilarTrip from './similar-trip';
import { TourDetailContent } from './tour-detail-content';
import TourDetailHeader from './tour-detail-header';

const TourDetail = ({ tour }: { tour: Tour }) => {
  return (
    <div className="flex flex-col pt-6">
      <div className="flex gap-10 px-[80px] pb-[60px] sm:flex-col-reverse md:flex-col-reverse lg:flex-col-reverse xl:flex-row">
        <div className="w-full space-y-10 xl:max-w-[calc(100%-360px)]">
          <TourDetailHeader {...tour} />
          <TourDetailContent tour={tour} />
        </div>
        <FloatingBookingPanel />
      </div>
      <SimilarTrip tours={MOCK_TOURS.slice(0, 4)} />
    </div>
  );
};

export default TourDetail;
