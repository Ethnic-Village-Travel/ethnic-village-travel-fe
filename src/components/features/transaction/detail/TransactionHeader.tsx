import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import { BookingGetResponse } from '@/types/booking';
import { usePayment, usePaymentLink } from '@/hooks/api/usePayment';
import { useToast } from '@/hooks/use-toast';

interface TransactionHeaderProps {
  booking: BookingGetResponse;
  onBack: () => void;
}

// Status styling helper
const getStatusStyle = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-700',
    CONFIRMED: 'bg-primary-primary-100 text-primary-600',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-success text-white-500',
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: string, tTransaction: any, tAdmin: any) => {
  // Use admin status for COMPLETED and CANCELLED
  if (status === 'COMPLETED' || status === 'CANCELLED') {
    return tAdmin(`admin.status.${status}`);
  }

  // Use personal transaction status for other statuses
  const statusKey = status.toLowerCase();
  return tTransaction(statusKey) || status;
};

// Action buttons based on status
const ActionButtons: React.FC<{ booking: BookingGetResponse }> = ({ booking }) => {
  const t = useTranslations('personal.detail');
  const { toast } = useToast();
  const { createPayment, isCreatingPayment } = usePayment();
  const { data: existingPaymentLink, isLoading: isLoadingPaymentLink } = usePaymentLink(
    booking.id,
    booking.status === 'PENDING_PAYMENT',
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = async () => {
    try {
      setIsProcessing(true);

      // Check if payment link already exists
      if (existingPaymentLink?.checkoutUrl) {
        console.log('Using existing payment link:', existingPaymentLink.checkoutUrl);
        window.location.href = existingPaymentLink.checkoutUrl;
        return;
      }

      // Create new payment link if none exists
      const paymentData = await createPayment(booking.id);
      console.log('New payment data received:', paymentData);

      if (paymentData?.checkoutUrl) {
        window.location.href = paymentData.checkoutUrl;
      } else {
        console.error('Invalid payment data:', paymentData);
        throw new Error('Không thể tạo link thanh toán');
      }
    } catch (error) {
      console.error('Failed to handle payment:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi thanh toán',
        description: 'Không thể tạo link thanh toán. Vui lòng thử lại.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (booking.status === 'PENDING_PAYMENT') {
    return (
      <button
        onClick={handlePayNow}
        disabled={isCreatingPayment || isProcessing || isLoadingPaymentLink}
        className="rounded-lg bg-primary-500 px-4 py-2 text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isCreatingPayment || isProcessing || isLoadingPaymentLink ? 'Đang xử lý...' : t('actions.pay_now')}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button className="bg-primary-primary-100 hover:bg-primary-primary-200 rounded-lg px-3 py-2 text-sm text-primary-600 transition-colors">
        {t('actions.print_invoice')}
      </button>
      <button className="hover:bg-primary-primary-10 rounded-lg border border-primary-500 px-3 py-2 text-sm text-primary-500 transition-colors">
        {t('actions.download_pdf')}
      </button>
    </div>
  );
};

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const tCommon = useTranslations('Common');

  return (
    <button
      onClick={onClick}
      className="hover:text-dark-500 flex items-center gap-2 px-3 py-2 text-gray-600 transition-colors"
    >
      <span>←</span>
      <span>{tCommon('button.back')}</span>
    </button>
  );
};

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({ booking, onBack }) => {
  const tPersonal = useTranslations('personal.detail');
  const tTransaction = useTranslations('personal.transaction.status');
  const tAdmin = useTranslations();

  return (
    <div className="mb-8 w-full">
      {/* Tour Info Section */}
      <div className="bg-white-500 rounded-lg border border-light-500 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Tour Image */}
          <div className="lg:w-1/3">
            <img
              src={booking.tour.imageUrl || '/images/tour-placeholder.jpg'}
              alt={booking.tour.title}
              className="h-48 w-full rounded-lg object-cover"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/tour-placeholder.jpg';
              }}
            />
          </div>

          {/* Tour Info + Status + Actions */}
          <div className="flex flex-col justify-between lg:w-2/3">
            <div>
              <h1 className="text-dark-500 mb-2 text-2xl font-bold">{booking.tour.title}</h1>
              <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                <span>
                  🕒 {booking.tour.duration} {tPersonal('format.days')}
                </span>
                <span>
                  📍 {booking.tour.pickUpLocation?.city || 'Điểm đón'}, {booking.tour.pickUpLocation?.province}
                </span>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(booking.status)}`}>
                  {getStatusText(booking.status, tTransaction, tAdmin)}
                </span>
                <span className="font-mono text-sm text-gray-500">#{booking.id.slice(-8)}</span>
                <span className="text-sm text-gray-500">
                  {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <BackButton onClick={onBack} />
                <ActionButtons booking={booking} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
