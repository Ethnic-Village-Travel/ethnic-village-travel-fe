'use client';

import { useState } from 'react';
import { cn } from '@/utils';
import { formatCurrency } from '@/utils/number';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useQueryConfig } from '@/hooks/use-query-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RangeSlider } from '@/components/ui/range-slider';

const MIN_PRICE_RANGE = 0;
const MAX_PRICE_RANGE = 20000000;

const PriceFilterCard = () => {
  const queryConfig = useQueryConfig();

  const t = useTranslations('filters.price');

  const [open, setOpen] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    queryConfig.min ?? MIN_PRICE_RANGE,
    queryConfig.max ?? MAX_PRICE_RANGE,
  ]);

  return (
    <Card className="mb-4 w-64 rounded-2xl border-none bg-primary-10 px-0.5 pb-0.5 shadow-none">
      <CardHeader
        className="flex cursor-pointer flex-row items-center justify-between rounded-t-2xl px-3 py-2"
        onClick={() => setOpen(o => !o)}
      >
        <CardTitle className="text-base font-semibold">{t('title')}</CardTitle>
        <Button variant="ghost" size="icon" tabIndex={-1} type="button" className="h-fit hover:bg-transparent">
          <span
            className={cn('block transition-transform duration-300', {
              'rotate-180': open,
              'rotate-0': !open,
            })}
          >
            <ChevronDown />
          </span>
        </Button>
      </CardHeader>
      <div
        className={cn('grid transition-all duration-300 ease-in-out', {
          'grid-rows-[1fr] opacity-100': open,
          'grid-rows-[0fr] opacity-0': !open,
        })}
      >
        <div className="overflow-hidden">
          <CardContent className="rounded-[14px] bg-white px-4 py-4">
            <div className="space-y-6">
              <p className="font-medium text-black">
                {formatCurrency(queryConfig.min)} - {formatCurrency(queryConfig.max)}
              </p>
              <RangeSlider
                value={priceRange}
                min={MIN_PRICE_RANGE}
                max={MAX_PRICE_RANGE}
                step={10000}
                onValueChange={value => {
                  setPriceRange(value);
                }}
                className="py-4"
              />
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default PriceFilterCard;
