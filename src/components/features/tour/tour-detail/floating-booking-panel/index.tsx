'use client';

import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/constants/route';

import { BookingCalculator } from './booking-calculator';
import GuildProfileCard from './guild-profile-card';

const FloatingBookingPanel = () => {
  const router = useRouter();

  const handleBook = () => {
    router.push(RouteConstant.order);
  };

  return (
    <div className="flex gap-5 xl:w-[360px] xl:flex-shrink-0 xl:flex-col">
      <BookingCalculator onBook={handleBook} />
      <GuildProfileCard />
    </div>
  );
};

export default FloatingBookingPanel;
