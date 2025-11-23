import React from 'react';
import { useTranslations } from 'next-intl';

import { BookingGetResponse } from '@/types/booking';

interface CustomerInfoBoxProps {
  booking: BookingGetResponse;
  className?: string;
}

export const CustomerInfoBox: React.FC<CustomerInfoBoxProps> = ({ booking, className = '' }) => {
  const t = useTranslations('personal.detail');

  // Extract customer info from bookerDetail
  const customerName = booking.bookerDetail?.fullName || booking.bookerDetail?.name || t('customer_info.not_updated');
  const customerEmail = booking.bookerDetail?.email || t('customer_info.not_updated');
  const customerPhone =
    booking.bookerDetail?.phoneNumber || booking.bookerDetail?.phone || t('customer_info.not_updated');

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    const notUpdated = t('customer_info.not_updated');
    if (!phone || phone === notUpdated) return notUpdated;
    // Format Vietnamese phone numbers
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
  };

  // Create mailto link
  const createMailtoLink = () => {
    const subject = `Liên hệ về đơn đặt tour #${booking.id.slice(-8)}`;
    const tourName = booking.tour?.title || 'Tour';
    const body = `Xin chào ${customerName},\n\nChúng tôi liên hệ về đơn đặt tour "${tourName}" của bạn.\n\nTrân trọng,\nĐội ngũ hỗ trợ khách hàng`;
    return `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Create tel link
  const createTelLink = () => {
    return `tel:${customerPhone}`;
  };

  return (
    <div
      className={`bg-white-500 rounded-lg border border-light-500 p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-dark-500 flex items-center text-lg font-bold">
          <span className="bg-secondary-secondary-100 mr-2 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-secondary-600">
            👤
          </span>
          {t('customer_info.title')}
        </h3>
      </div>

      {/* Customer Details */}
      <div className="space-y-4">
        {/* Avatar and Name */}
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-400 to-secondary-400">
              <span className="text-lg font-bold text-white">
                {customerName ? customerName.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-dark-500 font-semibold">{customerName}</h4>
            <p className="text-sm text-gray-500">{t('customer_info.customer')}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
              <span className="text-sm text-blue-600">✉️</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{t('customer_info.email')}</p>
              <p className="text-dark-500 break-all font-medium">{customerEmail}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
              <span className="text-sm text-green-600">📞</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{t('customer_info.phone')}</p>
              <p className="text-dark-500 font-medium">{formatPhoneNumber(customerPhone)}</p>
            </div>
          </div>

          {/* Booking Statistics (if needed) */}
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50">
              <span className="text-sm text-purple-600">📊</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{t('customer_info.status')}</p>
              <p className="text-dark-500 font-medium">
                {booking.status === 'CONFIRMED' ? t('customer_info.loyal_customer') : t('customer_info.new_customer')}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Actions */}
        {(customerEmail !== t('customer_info.not_updated') || customerPhone !== t('customer_info.not_updated')) && (
          <div className="border-light-light-10 flex space-x-2 border-t pt-4">
            {customerEmail !== t('customer_info.not_updated') && (
              <a
                href={createMailtoLink()}
                className="bg-primary-primary-5 hover:bg-primary-primary-10 flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium text-primary-600 transition-colors"
              >
                {t('customer_info.send_email')}
              </a>
            )}
            {customerPhone !== t('customer_info.not_updated') && (
              <a
                href={createTelLink()}
                className="bg-secondary-secondary-5 hover:bg-secondary-secondary-10 flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium text-secondary-600 transition-colors"
              >
                {t('customer_info.make_call')}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
