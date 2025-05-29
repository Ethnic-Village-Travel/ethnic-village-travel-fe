import { useState } from 'react';
import { cn } from '@/utils';
import { formatCurrency } from '@/utils/number';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

export default function PriceFilterCard() {
  const [open, setOpen] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 20000000]);

  return (
    <Card className="mb-4 w-64 rounded-2xl border shadow">
      <CardHeader
        className="flex cursor-pointer flex-row items-center justify-between rounded-t-2xl px-3 py-2"
        onClick={() => setOpen(o => !o)}
      >
        <CardTitle className="text-base font-semibold">Giá</CardTitle>
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
          <CardContent className="px-3 py-3 pt-1">
            <div className="space-y-6">
              <p className="font-medium text-black">
                Từ: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              </p>
              <Slider
                defaultValue={priceRange}
                max={priceRange[1]}
                step={10}
                onValueChange={value => setPriceRange(value)}
              />
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
