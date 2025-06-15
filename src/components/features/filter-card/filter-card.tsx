'use client';

import { useEffect, useState } from 'react';
import { FilterItem } from '@/data/filters';
import { cn } from '@/utils';
import { ChevronDown } from 'lucide-react';

import { useQueryConfig } from '@/hooks/use-query-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface FilterCardProps {
  title: string;
  name: string;
  items: FilterItem[];
  maxVisible?: number;
  isMultiSelect?: boolean;
  onFilterChange?: (queryConfig: any) => void;
}

export default function FilterCard({
  title,
  name,
  items,
  maxVisible = 5,
  isMultiSelect = true,
  onFilterChange,
}: FilterCardProps) {
  const queryConfig = useQueryConfig();

  const [open, setOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(() => {
    const values = queryConfig[name as keyof typeof queryConfig];
    return Array.isArray(values) ? (values as string[]) : values ? [values as string] : [];
  });

  const visibleItems = showAll ? items : items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;

  const handleCheckboxChange = (item: FilterItem, checked: boolean) => {
    let newValues: string[];

    if (isMultiSelect) {
      // Handle multi-select mode
      if (checked && selectedValues.includes(item.value)) {
        return;
      }

      if (checked) {
        newValues = [...selectedValues, item.value];
      } else {
        newValues = selectedValues.filter(value => value !== item.value);
      }
    } else {
      // Handle single-select mode
      newValues = checked ? [item.value] : [];
    }

    setSelectedValues(newValues);

    const newQueryConfig = {
      ...queryConfig,
      [name]: isMultiSelect
        ? newValues.length > 0
          ? newValues
          : undefined
        : newValues.length > 0
          ? newValues[0]
          : undefined,
    };

    onFilterChange?.(newQueryConfig);
  };

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
            <div className="space-y-2">
              {visibleItems.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${name}-${idx}`}
                    checked={selectedValues.includes(item.value)}
                    onCheckedChange={checked => handleCheckboxChange(item, checked as boolean)}
                  />
                  <label
                    htmlFor={`${name}-${idx}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
            {hasMore && (
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
