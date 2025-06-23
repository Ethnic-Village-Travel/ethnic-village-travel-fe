'use client';

import { useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useBookingStore } from '@/store/useBookingStore';

import { useApiBookingGet } from '@/hooks/api/useBooking';

import AdditionalInformationCard from './additional_information_card';
import ContactInformationCard from './contact-information-card';
import FloatingBookingPanel from './floating-booking-panel';
import GuestInformationCard from './guest-information-card';
import TourInformationCard from './tour-infomation-card';

export function OrderDetail() {
  const params = useParams();
  const orderId = params.id as string;
  const { data: booking, isLoading, isError } = useApiBookingGet(orderId);
  const { setGuestInfo, setContactInfo } = useBookingStore();

  useEffect(() => {
    if (booking?.bookerDetail) {
      setContactInfo({
        name: booking.bookerDetail.name,
        email: booking.bookerDetail.email,
        phone: booking.bookerDetail.phone,
      });
    }
  }, [booking, setContactInfo, setGuestInfo]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    console.error('Failed to fetch booking');
    return notFound();
  }

  if (!booking) {
    return notFound();
  }

  return (
    <div className="flex gap-8">
      <div className="flex flex-1 flex-col gap-5">
        <TourInformationCard booking={booking} />
        <ContactInformationCard booking={booking} />
        <GuestInformationCard booking={booking} />
        <AdditionalInformationCard booking={booking} />
      </div>
      <FloatingBookingPanel booking={booking} />
    </div>
  );
}
