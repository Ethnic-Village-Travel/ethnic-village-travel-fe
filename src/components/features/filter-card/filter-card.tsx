'use client';

import { useState } from 'react';
import { cn } from '@/utils/general';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface FilterCardProps {
  title: string;
  items: string[];
  maxVisible?: number;
}

export default function FilterCard({ title, items, maxVisible = 5 }: FilterCardProps) {
  const [open, setOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;

  return (
    <Card className="mb-4 w-64 rounded-2xl border-none bg-primary-10 px-0.5 pb-0.5 shadow-none">
      <CardHeader
        className="flex cursor-pointer flex-row items-center justify-between rounded-t-2xl px-3 py-2"
        onClick={() => setOpen(o => !o)}
      >
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <Button variant="ghost" size="icon" tabIndex={-1} type="button" className="h-fit hover:bg-transparent">
          <span className={cn('block transition-transform duration-300', { 'rotate-180': open, 'rotate-0': !open })}>
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
            <ul className="space-y-2">
              {visibleItems.map((item, idx) => (
                <li
                  key={`${title}-${idx}`}
                  className="flex cursor-pointer items-center gap-2 truncate rounded text-sm transition-colors hover:text-primary"
                >
                  <Checkbox
                    id={`${title}-${idx}`}
                    className="h-4 w-4 items-center rounded border-gray-300 text-primary focus:ring-primary data-[state=checked]:border-none data-[state=checked]:bg-primary-800 data-[state=checked]:text-white"
                    onCheckedChange={checked => {
                      console.log(`Checkbox ${item} is now ${checked ? 'checked' : 'unchecked'}`);
                    }}
                  />
                  <label htmlFor={`${title}-${idx}`} className="cursor-pointer text-base font-semibold">
                    {item}
                  </label>
                </li>
              ))}
            </ul>
            {hasMore && !showAll && (
              <Button
                variant="link"
                className="mt-2 h-auto p-0 text-xs text-[#1A1A1A] hover:text-primary"
                onClick={e => {
                  e.stopPropagation();
                  setShowAll(true);
                }}
              >
                Xem thêm
              </Button>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
