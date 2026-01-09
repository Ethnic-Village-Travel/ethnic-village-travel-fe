'use client';

import { useState } from 'react';
import { useBookingStore } from '@/stores/useBookingStore';
import { cn } from '@/utils/classnames';
import { calculateTotalPriceWithPromotion, formatCurrency, getBestActiveDirectDiscount } from '@/utils/number';
import { useLocale, useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface PersonTypeCalculatorProps {
  label: string;
  price: number;
  value: number;
  locale: 'vi' | 'en' | 'ko';
  onChange: (value: number) => void;
}

const PersonTypeCalculator = ({ label, price, value, locale, onChange }: PersonTypeCalculatorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === '' || /^\d+$/.test(val)) {
      const numericValue = val === '' ? 0 : parseInt(val, 10);
      onChange(numericValue);
    }
  };

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
      <span className="text-dark-900 text-base font-bold">{label}</span>
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value || '0'}
        onChange={handleChange}
        className="h-14 w-14 border-gray-20 text-center text-base"
      />
      <span className="text-dark-900 whitespace-nowrap text-base">x {formatCurrency(price, { locale })}</span>
    </div>
  );
};

export type BookingCalculatorProps = {
  tour: Tour;
  onBook?: (tourSlug: string, quantities: { adult: number; child: number }, availableDateId?: string | number) => void;
};

export const BookingCalculator = ({ tour, onBook }: BookingCalculatorProps) => {
  const t = useTranslations('tour.detail.booking');
  const locale = useLocale() as 'vi' | 'en' | 'ko';
  const { selectedDateId, availableSlots } = useBookingStore();
  const [quantities, setQuantities] = useState({
    adult: 0,
    child: 0,
  });

  const totalPrice = calculateTotalPriceWithPromotion(quantities, tour);
  const totalQuantity = quantities.adult + quantities.child;

  // Get best DIRECT_DISCOUNT promotion for display
  const bestPromotion = getBestActiveDirectDiscount(tour);

  const handleQuantityChange = (type: keyof typeof quantities) => (value: number) => {
    const newQuantities = {
      ...quantities,
      [type]: value,
    };
    const newTotal = newQuantities.adult + newQuantities.child;

    // Only update if new total is within available slots
    if (availableSlots === undefined || newTotal <= availableSlots) {
      setQuantities(newQuantities);
    }
  };

  return (
    <div className="grid w-full gap-4 rounded-[20px] border border-gray-20 bg-white p-5 shadow-custom-gray sm:p-[30px] xl:w-[360px]">
      <h3 className="text-dark-900 text-center text-2xl font-bold leading-[1.17] sm:text-[30px]">{t('title')}</h3>

      {!selectedDateId ? (
        <p className="text-center text-sm text-gray-500">{t('select_date')}</p>
      ) : availableSlots && availableSlots > 0 ? (
        <p className="text-center text-sm text-gray-500">{t('available_slots', { count: availableSlots })}</p>
      ) : (
        <p className="text-center text-sm text-red-500">{t('no_slots')}</p>
      )}

      <Separator />

      <PersonTypeCalculator
        label={t('adult')}
        price={tour.adultPrice || 0}
        value={quantities.adult}
        locale={locale}
        onChange={handleQuantityChange('adult')}
      />
      <PersonTypeCalculator
        label={t('child')}
        price={tour.childPrice || 0}
        value={quantities.child}
        locale={locale}
        onChange={handleQuantityChange('child')}
      />

      {bestPromotion && (
        <div className="flex items-center justify-between">
          <span className="text-dark-900 text-base font-bold">{t('discount')}</span>
          <span className="text-dark-900 text-base">
            {bestPromotion.discountPercent}% ({t('max')}{' '}
            {formatCurrency(bestPromotion.maxDiscountAmount || 0, { locale })})
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-dark-900 text-base font-bold">{t('total')}</span>
        <span className="text-dark-900 text-xl font-bold">{formatCurrency(totalPrice, { locale })}</span>
      </div>

      <Button
        onClick={() => onBook?.(tour.slug || '', quantities, selectedDateId)}
        disabled={
          !selectedDateId ||
          !availableSlots ||
          availableSlots === 0 ||
          totalPrice === 0 ||
          totalQuantity > availableSlots
        }
        className={cn(
          'hover:bg-primary/90 h-auto w-full bg-primary py-5 text-white',
          'text-base font-normal leading-[1.625]',
          'disabled:cursor-not-allowed disabled:bg-gray-300',
        )}
      >
        {t('book_now')}
      </Button>
    </div>
  );
};
