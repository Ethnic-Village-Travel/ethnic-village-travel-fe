'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TourAvailableDateStatusEnum } from '@/constants/enum/tour.enum';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/utils';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { Option } from '@/types/data-table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { StatusFilter } from '@/components/shared/filter';

interface AssignedAvailableDatesTableFilterProps {
  className?: string;
}

export function AssignedAvailableDatesTableFilter({ className }: AssignedAvailableDatesTableFilterProps) {
  const t = useTranslations('admin');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  // Check if user is admin
  const isAdmin = user?.roles?.includes('ADMIN');

  // Get current filter values from URL
  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status')?.split(',') || [];
  const currentFromDate = searchParams.get('start_date') || '';
  const currentToDate = searchParams.get('end_date') || '';

  // Local state for form inputs
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [fromDate, setFromDate] = useState<Date | undefined>(currentFromDate ? new Date(currentFromDate) : undefined);
  const [toDate, setToDate] = useState<Date | undefined>(currentToDate ? new Date(currentToDate) : undefined);

  // Create status options
  const statusOptions: Option[] = Object.values(TourAvailableDateStatusEnum).map(status => ({
    label: t(`available_date_status.${status.value}` as any) || status.value,
    value: status.value,
  }));

  // Update URL with new filter values
  const updateFilters = useCallback(
    (updates: Record<string, string | string[] | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, value);
        }
      });

      // Reset to first page when filters change
      params.set('page', '1');

      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  // Handle date range change
  const handleDateRangeChange = () => {
    updateFilters({
      start_date: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
      end_date: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
    });
  };

  // Apply date filter when dates change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleDateRangeChange();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fromDate, toDate]);

  // Handle status filter change
  const handleStatusChange = (statuses: string[]) => {
    updateFilters({ status: statuses });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchInput('');
    setFromDate(undefined);
    setToDate(undefined);
    updateFilters({
      search: undefined,
      status: undefined,
      start_date: undefined,
      end_date: undefined,
    });
  };

  // Check if any filters are active
  const hasActiveFilters = currentSearch || currentStatus.length > 0 || currentFromDate || currentToDate;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {/* Search Filter */}
        <div className="flex-1 space-y-2">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              id="search"
              placeholder={t('tour.assigned_dates.search_tour')}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="max-w-xs"
            />
          </form>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn('w-[130px] justify-start text-left font-normal', !fromDate && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, 'dd/MM/yyyy') : t('tour.assigned_dates.from_date')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn('w-[130px] justify-start text-left font-normal', !toDate && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, 'dd/MM/yyyy') : t('tour.assigned_dates.to_date')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <StatusFilter
            title={t('tour.assigned_dates.filter_status')}
            options={statusOptions}
            selectedValues={currentStatus}
            onSelectionChange={handleStatusChange}
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2 lg:px-3">
            {t('tour.assigned_dates.clear_filters')}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* TODO: Add Employee Filter for Admin */}
      {isAdmin && (
        <div className="border-t pt-4">
          <div className="text-sm text-muted-foreground">{t('tour.assigned_dates.filter_employee')}</div>
        </div>
      )}
    </div>
  );
}
