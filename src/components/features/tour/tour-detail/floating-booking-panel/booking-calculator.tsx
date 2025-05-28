'use client';

import { useState } from 'react';
import { cn } from '@/utils/classnames';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface PersonTypeCalculatorProps {
  label: string;
  price: number;
  value: number;
  onChange: (value: number) => void;
}

const PersonTypeCalculator = ({ label, price, value, onChange }: PersonTypeCalculatorProps) => {
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
      <span className="text-dark-900 whitespace-nowrap text-base">x ${price}</span>
    </div>
  );
};

interface BookingCalculatorProps {
  onBook?: () => void;
}

const PRICE = {
  adult: 130,
  child: 110,
  infant: 100,
};

export const BookingCalculator = ({ onBook }: BookingCalculatorProps) => {
  const [quantities, setQuantities] = useState({
    adult: 0,
    child: 0,
    infant: 0,
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

  return (
    <div className="shadow-custom-gray grid gap-4 rounded-[20px] border border-gray-20 bg-white p-[30px]">
      <div className="text-dark-900 text-center text-[30px] font-bold leading-[1.17]">${totalPrice}</div>

      <Separator />

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
      <PersonTypeCalculator
        label="Infant"
        price={PRICE.infant}
        value={quantities.infant}
        onChange={handleQuantityChange('infant')}
      />

      <Button
        onClick={onBook}
        className={cn(
          'hover:bg-primary/90 h-auto w-full bg-primary py-5 text-white',
          'text-base font-normal leading-[1.625]',
        )}
      >
        Book Now
      </Button>
    </div>
  );
};
