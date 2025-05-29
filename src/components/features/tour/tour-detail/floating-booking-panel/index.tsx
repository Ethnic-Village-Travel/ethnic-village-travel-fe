'use client';

import { BookingCalculator } from './booking-calculator';
import GuildProfileCard from './guild-profile-card';

const FloatingBookingPanel = () => {
  return (
    <div className="flex gap-5 xl:w-[360px] xl:flex-shrink-0 xl:flex-col">
      <BookingCalculator onBook={() => {}} />
      <GuildProfileCard />
    </div>
  );
};

export default FloatingBookingPanel;
