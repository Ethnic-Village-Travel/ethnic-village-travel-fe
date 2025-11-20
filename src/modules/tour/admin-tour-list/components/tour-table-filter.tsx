'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TourStatusEnum } from '@/constants/enum/tour.enum';
import { useMetaStore } from '@/stores/useMetaStore';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { Option } from '@/types/data-table';
import { Button } from '@/components/ui/button';
import { EthnicFilter, SearchFilter, StatusFilter } from '@/components/shared/filter';

interface TourTableFilterProps {
  className?: string;
}

export function TourTableFilter({ className }: TourTableFilterProps) {
  const t = useTranslations('admin');
  const router = useRouter();
  const searchParams = useSearchParams();
  const ethnics = useMetaStore(state => state.ethnics);
  const locations = useMetaStore(state => state.locations);

  // Get current filter values from URL
  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status')?.split(',') || [];
  const currentEthnic = searchParams.get('e')?.split(',') || [];

  // Create status options
  const statusOptions: Option[] = Object.values(TourStatusEnum).map(status => ({
    label: t(('status.' + status.value) as any),
    value: status.value,
  }));

  // Create ethnic options from store data
  const ethnicOptions: Option[] = React.useMemo(() => {
    if (!ethnics) return [];
    return ethnics.map(ethnic => ({
      label: ethnic.name,
      value: ethnic.code,
    }));
  }, [ethnics]);

  // Update URL with new filter values
  const updateFilters = React.useCallback(
    (updates: Record<string, string | string[] | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, value);
        }
      });

      // Reset to page 1 when filters change
      params.set('page', '0');

      const newUrl = `?${params.toString()}`;
      console.log('Updating filters:', updates, 'New URL:', newUrl);

      // Use router.push to ensure the component re-renders
      router.push(newUrl, { scroll: false });
    },
    [router, searchParams],
  );

  // Handle status filter change
  const handleStatusChange = React.useCallback(
    (values: string[]) => {
      updateFilters({ status: values.length > 0 ? values : undefined });
    },
    [updateFilters],
  );

  // Handle ethnic filter change
  const handleEthnicChange = React.useCallback(
    (values: string[]) => {
      updateFilters({ e: values.length > 0 ? values : undefined });
    },
    [updateFilters],
  );

  // Reset all filters
  const handleReset = React.useCallback(() => {
    updateFilters({ search: undefined, status: undefined, e: undefined });
  }, [updateFilters]);

  const hasActiveFilters = currentSearch || currentStatus.length > 0 || currentEthnic.length > 0;

  return (
    <div className={`flex w-full items-start justify-between gap-2 p-1 ${className || ''}`}>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Search Input */}
        <SearchFilter title={t('tour.list.search_tour')} defaultValue={currentSearch} onChange={updateFilters} />

        {/* Status Filter */}
        <StatusFilter
          title={t('tour.list.status')}
          options={statusOptions}
          selectedValues={currentStatus}
          onSelectionChange={handleStatusChange}
        />

        {/* Ethnic Filter */}
        <EthnicFilter
          title={t('tour.list.ethnic')}
          options={ethnicOptions}
          selectedValues={currentEthnic}
          onSelectionChange={handleEthnicChange}
        />

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            aria-label={t('tour.list.reset_filters')}
            variant="outline"
            size="sm"
            className="border-dashed"
            onClick={handleReset}
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
