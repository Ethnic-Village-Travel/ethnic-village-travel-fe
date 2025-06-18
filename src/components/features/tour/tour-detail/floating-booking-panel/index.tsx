'use client';

import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/constants/route';
import { useBookingStore } from '@/store/useBookingStore';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { useToast } from '@/hooks/use-toast';

import { BookingCalculator } from './booking-calculator';
import GuildProfileCard from './guild-profile-card';

interface FloatingBookingPanelProps {
  tour: Tour;
}

const FloatingBookingPanel = ({ tour }: FloatingBookingPanelProps) => {
  const router = useRouter();
  const { selectedDateId, availableSlots } = useBookingStore();
  const { toast } = useToast();
  const t = useTranslations('tour.detail.booking');

  const handleBook = (quantities: { adult: number; child: number }) => {
    if (availableSlots && availableSlots < quantities.adult + quantities.child) {
      toast({
        title: t('booking_failed'),
        description: t('booking_failed_out_of_stock'),
      });
      return;
    }

    router.push(
      RouteConstant.order +
        `?tour=${tour.slug}&availableDate=${selectedDateId}&adult=${quantities.adult}&child=${quantities.child}`,
    );
  };

  return (
    <div className="flex gap-5 xl:w-[360px] xl:flex-shrink-0 xl:flex-col">
      <BookingCalculator tour={tour} onBook={handleBook} />
      <GuildProfileCard />
    </div>
  );
};

export default FloatingBookingPanel;
