import React from 'react';
import { useTranslations } from 'next-intl';

import { BookingGetResponse } from '@/types/booking';

interface TourDetailsBoxProps {
  booking: BookingGetResponse;
  className?: string;
}

export const TourDetailsBox: React.FC<TourDetailsBoxProps> = ({ booking, className = '' }) => {
  const t = useTranslations('personal.detail');
  const { tour } = booking;

  // Format duration
  const formatDuration = (days: number) => {
    if (days === 1) return t('format.single_day');
    return t('format.day_night', { days, nights: days - 1 });
  };

  // Format location
  const formatLocation = (location: any) => {
    const notSpecified = t('format.not_specified');
    if (!location) return notSpecified;
    return `${location.city || location.province || location.name || notSpecified}`;
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (!tour) {
    return (
      <div className={`bg-white-500 rounded-lg border border-light-500 p-6 shadow-sm ${className}`}>
        <div className="text-center text-gray-500">
          <p>{t('tour_info.tour_not_available')}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white-500 rounded-lg border border-light-500 p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-dark-500 flex items-center text-lg font-bold">
          <span className="bg-success-success-100 text-success-600 mr-2 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold">
            🗺️
          </span>
          {t('tour_info.title')}
        </h3>
      </div>

      {/* Tour Content */}
      <div className="space-y-4">
        {/* Tour Image & Basic Info */}
        <div className="flex space-x-4">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {tour.imageUrl ? (
              <img src={tour.imageUrl} alt={tour.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-200 to-secondary-200">
                <span className="text-sm text-gray-500">🏞️</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-dark-500 mb-1 font-semibold">{tour.title}</h4>
            <p className="mb-2 text-sm text-gray-500">{formatLocation(tour.pickUpLocation)}</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-500">⏱️ {formatDuration(tour.duration)}</span>
              <span className="font-medium text-primary-600">{formatPrice(tour.adultPrice)}</span>
            </div>
          </div>
        </div>

        {/* Tour Details */}
        <div className="border-light-light-10 space-y-3 border-t pt-3">
          {/* Location Details */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-500">Điểm khởi hành:</span>
            <span className="text-dark-500">{formatLocation(tour.pickUpLocation)}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-500">Thời gian:</span>
            <span className="text-dark-500">{formatDuration(tour.duration)}</span>
          </div>

          {/* Price per person */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-500">Giá người lớn:</span>
            <span className="text-dark-500 font-semibold">{formatPrice(tour.adultPrice)}</span>
          </div>

          {/* Child Price */}
          {tour.childPrice && tour.childPrice > 0 && (
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-500">Giá trẻ em:</span>
              <span className="text-dark-500 font-semibold">{formatPrice(tour.childPrice)}</span>
            </div>
          )}
        </div>

        {/* Tour Features/Highlights */}
        <div className="border-light-light-10 border-t pt-3">
          <h5 className="text-dark-500 mb-2 font-medium">{t('tour_info.highlights')}</h5>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-green-500">✓</span>
              <span>{t('tour_info.professional_guide')}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-green-500">✓</span>
              <span>{t('tour_info.transportation')}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-green-500">✓</span>
              <span>{t('tour_info.travel_insurance')}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-green-500">✓</span>
              <span>{t('tour_info.support_24_7')}</span>
            </div>
          </div>
        </div>

        {/* Tour Actions */}
        <div className="border-light-light-10 flex space-x-2 border-t pt-4">
          <button className="bg-primary-primary-5 hover:bg-primary-primary-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium text-primary-600 transition-colors">
            {t('tour_info.view_tour_details')}
          </button>
          <button className="bg-secondary-secondary-5 hover:bg-secondary-secondary-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium text-secondary-600 transition-colors">
            {t('tour_info.similar_tours')}
          </button>
        </div>
      </div>
    </div>
  );
};
