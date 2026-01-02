import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BookingGetResponse } from '@/types/booking';
import { usePayment, usePaymentLink } from '@/hooks/api/usePayment';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TransactionHeaderProps {
  booking: BookingGetResponse;
  onBack: () => void;
}

// Status styling helper
const getStatusStyle = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING_PAYMENT: 'bg-yellow text-foreground',
    PAID: 'bg-green/20 text-green-700 border-green/30',
    CONFIRMED: 'bg-primary/10 text-primary border-primary/30',
    CANCELLED: 'bg-destructive/10 text-destructive border-destructive/30',
    COMPLETED: 'bg-green text-white border-green',
  };
  return statusMap[status] || 'bg-muted text-muted-foreground';
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
      <Button
        onClick={handlePayNow}
        disabled={isCreatingPayment || isProcessing || isLoadingPaymentLink}
        className="shadow-sm"
      >
        {isCreatingPayment || isProcessing || isLoadingPaymentLink ? 'Đang xử lý...' : t('actions.pay_now')}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
        {t('actions.print_invoice')}
      </Button>
      <Button variant="outline" size="sm">
        {t('actions.download_pdf')}
      </Button>
    </div>
  );
};

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const tCommon = useTranslations('Common' as any) as any;

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{tCommon('button.back')}</span>
    </Button>
  );
};

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({ booking, onBack }) => {
  const tPersonal = useTranslations('personal.detail');
  const tTransaction = useTranslations('personal.transaction.status');
  const tAdmin = useTranslations();

  return (
    <div className="mb-6 w-full">
      {/* Tour Info Section */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-6 p-6 lg:flex-row">
          {/* Tour Image */}
          <div className="lg:w-1/3">
            <img
              src={booking.tour.imageUrl || '/images/tour-placeholder.jpg'}
              alt={booking.tour.title}
              className="h-56 w-full rounded-lg object-cover shadow-sm"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/tour-placeholder.jpg';
              }}
            />
          </div>

          {/* Tour Info + Status + Actions */}
          <div className="flex flex-col justify-between lg:w-2/3">
            <div>
              <h1 className="mb-3 font-roboto text-2xl font-bold text-foreground lg:text-3xl">{booking.tour.title}</h1>
              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  🕒 <span className="font-medium">{booking.tour.duration} {tPersonal('format.days')}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  📍 <span className="font-medium">{booking.tour.pickUpLocation?.city || 'Điểm đón'}, {booking.tour.pickUpLocation?.province}</span>
                </span>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={`border px-3 py-1 font-medium ${getStatusStyle(booking.status)}`}>
                  {getStatusText(booking.status, tTransaction, tAdmin)}
                </Badge>
                <span className="font-mono text-sm text-muted-foreground">#{booking.id.slice(-8)}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
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
