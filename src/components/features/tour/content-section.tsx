'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/utils';

import { useFilteredTourList } from '@/hooks/api/useFilteredTourList';
import { useTourSearchQueryConfig } from '@/hooks/use-query-config';
import { TourItem } from '@/components/features/tour';
import PaginationClient from '@/components/shared/pagination-client';

import { EmptyState } from './empty-state';
import { SORT_OPTIONS, TourHeader } from './header-section';
import { TourSkeleton } from './tour-skeleton';

const ITEM_PER_PAGE = 12;

type ViewMode = 'grid' | 'list';

export default function TourContentSection() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryConfig = useTourSearchQueryConfig();

  const sortBy = searchParams.get('sort_by') || 'default';
  const order = searchParams.get('order') || 'desc';
  const currentSort = `${sortBy}-${order}`;

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const [newSortBy, newOrder] = value.split('-');

    if (newSortBy === SORT_OPTIONS.DEFAULT.sortBy) {
      newParams.delete('sort_by');
      newParams.delete('order');
    } else {
      newParams.set('sort_by', newSortBy);
      newParams.set('order', newOrder);
    }

    router.push(`?${newParams.toString()}`);
  };

  const { tours, totalPages, isLoading } = useFilteredTourList(ITEM_PER_PAGE);
  const isEmpty = !isLoading && (!tours || tours.length === 0);

  return (
    <div className="flex-1">
      <TourHeader
        sortBy={currentSort}
        onSortByChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        disabled={isEmpty}
      />

      <div className="grid gap-6">
        {isLoading ? (
          <div
            className={cn('grid gap-6', {
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': viewMode === 'grid',
              'grid-cols-1': viewMode === 'list',
            })}
          >
            {Array.from({ length: ITEM_PER_PAGE }).map((_, idx) => (
              <TourSkeleton key={idx} layout={viewMode === 'list' ? 'horizontal' : 'vertical'} />
            ))}
          </div>
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <>
            <div
              className={cn('grid gap-6', {
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': viewMode === 'grid',
                'grid-cols-1': viewMode === 'list',
              })}
            >
              {tours.map(tour => (
                <TourItem key={tour.id} tour={tour} layout={viewMode === 'list' ? 'horizontal' : 'vertical'} />
              ))}
            </div>

            <PaginationClient queryConfig={queryConfig} pageSize={totalPages} range={ITEM_PER_PAGE} showFirstLast />
          </>
        )}
      </div>
    </div>
  );
}
