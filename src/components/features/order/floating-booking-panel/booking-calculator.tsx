'use client';

import { useState } from 'react';
import { calculateDiscount, formatCurrency } from '@/utils';
import { cn } from '@/utils/classnames';

import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface PersonTypeCalculatorProps {
  label: string;
  price: number;
  value: number;
  onChange: (value: number) => void;
}

const PersonTypeCalculator = ({ label, price, value }: PersonTypeCalculatorProps) => {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
      <span className="text-dark-900 text-base font-bold">{label}</span>
      <p className="border-gray-20 text-center text-base">{value} x </p>
      <span className="text-dark-900 whitespace-nowrap text-base">
        {formatCurrency(price, {
          locale: 'en',
        })}
      </span>
    </div>
  );
};

interface BookingCalculatorProps {
  order: Order;
  onBook?: () => void;
}

const PRICE = {
  adult: 130,
  child: 110,
};

export const BookingCalculator = ({ order, onBook }: BookingCalculatorProps) => {
  const [quantities, setQuantities] = useState({
    adult: order.adultCount,
    child: order.childrenCount,
  });
  const [promotionInput, setPromotionInput] = useState('');
  const [promotion, setPromotion] = useState({
    name: '',
    maxDiscount: 0,
    discountPercent: 0,
  });

  const totalPrice = Object.entries(PRICE).reduce(
    (acc, [type, price]) => acc + price * quantities[type as keyof typeof quantities],
    0,
  );

  const handleQuantityChange = (type: keyof typeof quantities) => (value: number) => {
    setQuantities(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handlePromotionSubmit = () => {
    if (!promotionInput.trim()) return;

    // Here you can add API call to validate promotion code
    setPromotion({
      name: promotionInput,
      maxDiscount: 50,
      discountPercent: 10,
    });
    setPromotionInput('');
  };

  return (
    <div className="xl:flex-0 grid gap-4 rounded-[20px] border border-gray-20 bg-white p-[30px] shadow-custom-gray lg:w-[360px]">
      <div className="text-dark-900 text-center text-[30px] font-bold leading-[1.17]">
        {formatCurrency(calculateDiscount(totalPrice, promotion.discountPercent, promotion.maxDiscount), {
          locale: 'en',
        })}
      </div>

      <Separator />

      <div className="flex flex-col gap-5">
        <PersonTypeCalculator
          label="Adult"
          price={PRICE.adult}
          value={quantities.adult}
          onChange={handleQuantityChange('adult')}
        />
        <PersonTypeCalculator
          label="Children"
          price={PRICE.child}
          value={quantities.child}
          onChange={handleQuantityChange('child')}
        />
        <div className="grid grid-cols-[1fr_auto_auto] items-center">
          <div className="flex flex-col gap-1">
            <span className="text-dark-900 text-base font-bold">Coupon Discount</span>
            {promotion.name ? (
              <Badge className="w-fit">{promotion.name}</Badge>
            ) : (
              <Input
                value={promotionInput}
                onChange={e => setPromotionInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handlePromotionSubmit();
                  }
                }}
                placeholder="Enter promotion code"
                className="focus-visible:ring-none w-fit focus-visible:ring-0"
              />
            )}
          </div>
          <span className="text-dark-900 whitespace-nowrap text-base">{promotion.discountPercent}</span>
        </div>
      </div>

      <Button
        onClick={onBook}
        className={cn(
          'hover:bg-primary/90 h-auto w-full bg-primary-button py-3 text-white',
          'text-base font-normal leading-[1.625]',
        )}
      >
        Book Now
      </Button>
    </div>
  );
};
