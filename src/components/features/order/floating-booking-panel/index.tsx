'use client';

import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/constants/route';

import { Order } from '@/types/order';

import { BookingCalculator } from './booking-calculator';
import GuildProfileCard from './pick-drop-location';

type FloatingBookingPanelProps = {
  order: Order;
};

const FloatingBookingPanel = ({ order }: FloatingBookingPanelProps) => {
  const router = useRouter();

  const handleBook = () => {
    router.push(RouteConstant.order);
  };

  return (
    <div className="flex gap-5 xl:w-[360px] xl:flex-shrink-0 xl:flex-col">
      <BookingCalculator order={order} onBook={handleBook} />
      <GuildProfileCard />
    </div>
  );
};

export default FloatingBookingPanel;
