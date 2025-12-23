import React from 'react';
import { useTranslations } from 'next-intl';

import { BookingGetResponse } from '@/types/booking';

interface BookingInfoBoxProps {
  booking: BookingGetResponse;
}

// Utility components
const InfoRow: React.FC<{
  label: string;
  value: string;
  valueClass?: string;
  highlight?: boolean;
}> = ({ label, value, valueClass = 'text-dark-500 font-semibold', highlight = false }) => (
  <div
    className={`flex items-center justify-between py-2 ${!highlight ? 'border-light-light-10 border-b' : 'bg-primary-primary-5 rounded-lg px-3'}`}
  >
    <span className="font-medium text-gray-500">{label}:</span>
    <span className={valueClass}>{value}</span>
  </div>
);

export const BookingInfoBox: React.FC<BookingInfoBoxProps> = ({ booking }) => {
  const t = useTranslations('personal.detail');

  // Format person count display
  const formatPersonCount = (count: any) => {
    if (!count) return t('format.not_specified');
    const parts = [];

    // Handle both 'adult'/'adults' and 'child'/'children' formats
    const adultCount = count.adult || count.adults || 0;
    const childCount = count.child || count.children || 0;
    const infantCount = count.infant || count.infants || 0;

    if (adultCount > 0) parts.push(`${adultCount} ${t('format.adults')}`);
    if (childCount > 0) parts.push(`${childCount} ${t('format.children')}`);
    if (infantCount > 0) parts.push(`${infantCount} ${t('format.infants')}`);

    return parts.join(', ') || t('format.not_specified');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format date time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white-500 rounded-lg border border-light-500 p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-dark-500 flex items-center text-lg font-bold">
          <span className="bg-primary-primary-100 mr-2 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-primary-600">
            📋
          </span>
          {t('booking_info.title')}
        </h3>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Booking Details */}
        <InfoRow label={t('booking_info.booking_id')} value={`#${booking.id.slice(-8)}`} />
        <InfoRow label={t('booking_info.booking_date')} value={formatDate(booking.bookingDate)} />
        <InfoRow label={t('booking_info.start_date')} value={formatDate(booking.startDate)} />
        <InfoRow label={t('booking_info.end_date')} value={formatDate(booking.endDate)} />
        <InfoRow label={t('booking_info.guest_count')} value={formatPersonCount(booking.personCount)} />

        {/* Pricing */}
        <div className="border-light-light-10 border-t pt-3">
          <h4 className="text-dark-500 mb-2 font-semibold">{t('booking_info.payment_info')}</h4>
          {booking.discountAmountApplied > 0 && (
            <>
              <InfoRow
                label={t('booking_info.original_price')}
                value={formatCurrency(booking.totalPrice + booking.discountAmountApplied)}
                valueClass="text-gray-400 line-through"
              />
              <InfoRow
                label={t('booking_info.discount')}
                value={`-${formatCurrency(booking.discountAmountApplied)}`}
                valueClass="text-green-600 font-semibold"
              />
            </>
          )}

          <InfoRow
            label={t('booking_info.total_amount')}
            value={formatCurrency(booking.totalPrice)}
            valueClass="text-primary-600 font-bold text-xl"
            highlight
          />
        </div>

        {/* Payment Expired Date */}
        {booking.paymentExpiredDate && booking.status === 'PENDING_PAYMENT' && (
          <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">{t('booking_info.payment_deadline')}: </span>
              {formatDateTime(booking.paymentExpiredDate)}
            </p>
          </div>
        )}

        {/* Additional Information */}
        {booking.additionalInformation && (
          <div className="bg-light-light-5 mt-4 rounded-lg p-3">
            <p className="mb-1 text-sm text-gray-500">{t('booking_info.additional_info')}:</p>
            <p className="text-dark-500 text-sm">{booking.additionalInformation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
