'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { bookingApi } from '@/data/apis/booking.api';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import {
  BookingInfoBox,
  CustomerInfoBox,
  TourDetailsBox,
  TransactionHeader,
} from '@/components/features/transaction/detail';

interface TransactionDetailPageProps {
  params: {
    id: string;
  };
}

const LoadingState = () => (
  <div className="mx-auto max-w-[1172px] px-4 py-8">
    <div className="animate-pulse">
      <div className="mb-6 h-48 rounded-lg bg-gray-200"></div>
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-lg bg-gray-200"></div>
        <div className="h-64 rounded-lg bg-gray-200"></div>
      </div>
      <div className="h-96 rounded-lg bg-gray-200"></div>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="mx-auto max-w-[1172px] px-4 py-8">
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        ❌
      </div>
      <h2 className="text-dark-500 mb-2 text-xl font-bold">Không thể tải thông tin giao dịch</h2>
      <p className="mb-4 text-gray-500">Vui lòng thử lại sau hoặc liên hệ hỗ trợ</p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-primary-500 px-4 py-2 text-white transition-colors hover:bg-primary-600"
      >
        Thử lại
      </button>
    </div>
  </div>
);

export default function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  const router = useRouter();
  const t = useTranslations('personal.detail');

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['booking-detail', params.id],
    queryFn: () => bookingApi.get(params.id),
  });

  if (isLoading) return <LoadingState />;
  if (error || !booking?.data) return <ErrorState />;

  return (
    <div className="bg-light-light-5 min-h-screen">
      <div className="mx-auto max-w-[1172px] px-4 py-8">
        {/* Header Section */}
        <TransactionHeader booking={booking.data} onBack={() => router.back()} />

        {/* Main Content Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Booking & Customer Info */}
          <div className="space-y-6 lg:col-span-2">
            <BookingInfoBox booking={booking.data} />
            <CustomerInfoBox booking={booking.data} />
          </div>

          {/* Right Column - Tour Details */}
          <div className="lg:col-span-1">
            <TourDetailsBox booking={booking.data} />
          </div>
        </div>

        {/* Footer Actions (if needed) */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.back()}
            className="bg-light-light-10 hover:bg-light-light-20 rounded-lg px-6 py-2 text-gray-600 transition-colors"
          >
            Quay lại danh sách
          </button>
          <button className="rounded-lg bg-primary-600 px-6 py-2 text-white transition-colors hover:bg-primary-700">
            In giao dịch
          </button>
        </div>
      </div>
    </div>
  );
}
