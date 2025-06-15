'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils';
import { formatCurrency } from '@/utils/number';
import { ChevronDown } from 'lucide-react';

import { useQueryConfig } from '@/hooks/use-query-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

export default function PriceFilterCard() {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const queryConfig = useQueryConfig();

  // Get price range from queryConfig or use default values
  const defaultPriceRange = [0, 20000000];
  const [localPriceRange, setLocalPriceRange] = useState([
    queryConfig.min ?? defaultPriceRange[0],
    queryConfig.max ?? defaultPriceRange[1],
  ]);

  // Update URL with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update if values have changed
      if (localPriceRange[0] !== queryConfig.min || localPriceRange[1] !== queryConfig.max) {
        // Update queryConfig with new price range
        const searchParams = new URLSearchParams();
        Object.entries(queryConfig).forEach(([key, val]) => {
          if (Array.isArray(val)) {
            val.forEach(v => searchParams.append(key, v.toString()));
          } else if (val !== undefined) {
            searchParams.set(key, val.toString());
          }
        });

        // Add price range to search params
        searchParams.set('min', localPriceRange[0].toString());
        searchParams.set('max', localPriceRange[1].toString());

        // Update the URL with new search params
        router.push(`?${searchParams.toString()}`);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [localPriceRange, queryConfig, router]);

  return (
    <Card className="mb-4 w-64 rounded-2xl border-none bg-primary-10 px-0.5 pb-0.5 shadow-none">
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
          <CardContent className="rounded-[14px] bg-white px-4 py-4">
            <div className="space-y-6">
              <p className="font-medium text-black">
                Từ: {formatCurrency(localPriceRange[0])} - {formatCurrency(localPriceRange[1])}
              </p>
              <Slider
                value={localPriceRange}
                min={0}
                max={20000000}
                step={10000}
                onValueChange={setLocalPriceRange}
                className="py-4"
              />
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
