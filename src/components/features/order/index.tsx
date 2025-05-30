import { Order } from '@/types/order';

import AdditionalInformationCard from './additional_information_card';
import ContactInformationCard from './contact-information-card';
import FloatingBookingPanel from './floating-booking-panel';
import GuestInformationCard from './guest-information-card';
import TourInformationCard from './tour-infomation-card';

type OrderDetailProps = {
  order: Order;
};

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="flex gap-8">
      <div className="flex flex-1 flex-col gap-5">
        <TourInformationCard order={order} />
        <ContactInformationCard />
        <GuestInformationCard />
        <AdditionalInformationCard />
      </div>
      <FloatingBookingPanel order={order} />
    </div>
  );
}
