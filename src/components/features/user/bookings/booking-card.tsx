'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { getStatusBadgeVariant } from '@/core/enum/booking.enum';
import { formatCurrency } from '@/utils/number';
import { format } from 'date-fns';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { BookingListResponse as BookingListItem } from '@/types/booking';
import { useApiBookingCancel } from '@/hooks/api/useBooking';
import { usePayment, usePaymentLink } from '@/hooks/api/usePayment';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BookingCardProps {
  booking: BookingListItem;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const t = useTranslations('personal.transaction');
  const locale = useLocale();
  const router = useRouter();
  const detailUrl = `/${locale}${RouteConstant.personal_transaction_detail.replace(':id', booking.id)}`;

  // Payment hooks
  const { toast } = useToast();
  const { createPayment, isCreatingPayment } = usePayment();
  const { data: existingPaymentLink, isLoading: isLoadingPaymentLink } = usePaymentLink(
    booking.id,
    booking.status === 'PENDING_PAYMENT',
  );
  const { mutateAsync: cancelBooking, isPending: isCancelling } = useApiBookingCancel(booking.id);
  const [isProcessing, setIsProcessing] = useState(false);

  // Guest count
  const guestCount = booking.personCount
    ? Object.values(booking.personCount).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0)
    : 1;
  // Location
  const location =
    booking.tour?.locations && booking.tour.locations.length > 0
      ? booking.tour.locations[0].city || booking.tour.locations[0].province
      : 'Unknown';

  // Check if payment is expired
  const isPaymentExpired =
    booking.status === 'PENDING_PAYMENT' &&
    booking.paymentExpiredDate &&
    new Date(booking.paymentExpiredDate) <= new Date();

  // Payment handler
  const handlePayNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
        throw new Error(t('payment_error_description'));
      }
    } catch (error) {
      console.error('Failed to handle payment:', error);
      toast({
        variant: 'destructive',
        title: t('payment_error'),
        description: t('payment_error_description'),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Cancel handler
  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await cancelBooking();
      toast({
        title: t('cancel_success'),
        description: t('cancel_success_description'),
      });
      // Reload the page to refresh the list
      window.location.reload();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast({
        variant: 'destructive',
        title: t('cancel_failed'),
        description: t('cancel_failed_description'),
      });
    }
  };

  // Get display status
  const getDisplayStatus = () => {
    if (isPaymentExpired) {
      return 'expired_payment';
    }
    return booking.status.toLowerCase();
  };

  return (
    <Link href={detailUrl} className="block transition-transform hover:scale-[1.02]">
      <Card className="flex w-full cursor-pointer flex-row items-center gap-4 rounded-xl bg-white p-2 shadow-[1px_1px_2px_0px_rgba(105,197,249,0.25),-1px_-1px_2px_0px_rgba(105,197,249,0.25)] transition-shadow hover:shadow-lg">
        {/* Image section */}
        <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EDFAF3]">
          <img
            src={booking.tour?.imageUrl || '/images/placeholder.jpg'}
            alt={booking.tour?.title}
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
        {/* Info section */}
        <CardContent className="flex flex-1 flex-col gap-2 p-0">
          {/* Title */}
          <h3 className="text-lg font-bold leading-tight text-black">{booking.tour?.title}</h3>
          {/* Location, Date, Duration, Guest count */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-400" aria-label="Location" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4 text-gray-400" aria-label="Date" />
              <span>
                {format(new Date(booking.startDate), 'dd MMM yyyy')} -{' '}
                {format(new Date(booking.endDate), 'dd MMM yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-400" aria-label="Duration" />
              <span>
                {booking.tour?.duration} {t('days')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block h-4 w-4 rounded-full bg-gray-300 text-center text-xs leading-4">👤</span>
              <span>{guestCount} People</span>
            </div>
          </div>
          {/* Price and Status */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-primary">
                {formatCurrency(booking.totalPrice, { locale: locale as 'vi' | 'en' | 'ko' })}
              </span>
              {(booking.discountAmountApplied ?? 0) > 0 && (
                <span className="text-base font-semibold text-gray-500 line-through">
                  {formatCurrency(booking.totalPrice + (booking.discountAmountApplied ?? 0), {
                    locale: locale as 'vi' | 'en' | 'ko',
                  })}
                </span>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant={isPaymentExpired ? 'destructive' : getStatusBadgeVariant(booking.status)}
                className="px-3 py-1 text-xs"
              >
                {t(`status.${getDisplayStatus()}` as any)}
              </Badge>
              {booking.paymentMethod && (
                <span className="text-xs text-gray-500">
                  {t('payment_method_label')}: {t(`payment_method.${booking.paymentMethod.toLowerCase()}` as any)}
                </span>
              )}
              {booking.paymentDate && (
                <span className="text-xs text-gray-500">
                  {t('payment_date')}: {format(new Date(booking.paymentDate), 'dd MMM yyyy HH:mm')}
                </span>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="mt-4 flex justify-end gap-2">
            {booking.status === 'PENDING_PAYMENT' && !isPaymentExpired && (
              <Button
                variant="default"
                onClick={handlePayNow}
                disabled={isCreatingPayment || isProcessing || isLoadingPaymentLink}
                className={
                  isCreatingPayment || isProcessing || isLoadingPaymentLink ? 'cursor-not-allowed opacity-50' : ''
                }
              >
                {isCreatingPayment || isProcessing || isLoadingPaymentLink
                  ? t('processing')
                  : t('actions.pay_now' as any)}
              </Button>
            )}
            {['PENDING_PAYMENT', 'PAID', 'CONFIRMED'].includes(booking.status) && !isPaymentExpired && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isCancelling}
                className={isCancelling ? 'cursor-not-allowed opacity-50' : ''}
              >
                {isCancelling ? t('cancelling') : t('actions.cancel' as any)}
              </Button>
            )}
            {booking.status === 'COMPLETED' && (
              <Button
                variant="outline"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle review action
                }}
              >
                {t('actions.review' as any)}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                router.push(detailUrl);
              }}
            >
              {t('actions.view_details' as any)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
