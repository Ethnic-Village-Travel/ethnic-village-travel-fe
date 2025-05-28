'use client';

import { BookingCalculator } from './booking-calculator';
import GuildProfileCard from './guild-profle-card';

const FloatingBookingPanel = () => {
  return (
    <div className="flex w-[360px] flex-shrink-0 flex-col gap-5">
      <BookingCalculator onBook={() => {}} />
      <GuildProfileCard />
    </div>
  );
};

export default FloatingBookingPanel;
