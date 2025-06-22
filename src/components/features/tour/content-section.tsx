'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/utils';
import { useTranslations } from 'next-intl';

import { useFilteredTourList } from '@/hooks/api/useFilteredTourList';
import { useTourSearchQueryConfig } from '@/hooks/use-query-config';
import { TourItem } from '@/components/features/tour';
import PaginationClient from '@/components/shared/pagination-client';

import { EmptyState } from './empty-state';
import { SORT_OPTIONS, TourHeader } from './header-section';

const ITEM_PER_PAGE = 12;

type ViewMode = 'grid' | 'list';

export default function TourContentSection() {
  const t = useTranslations('search');
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryConfig = useTourSearchQueryConfig();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const sortBy = searchParams.get('sort_by') || 'default';
  const order = searchParams.get('order') || 'desc';
  const currentSort = `${sortBy}-${order}`;
  const searchKeyword = searchParams.get('search');

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

      {/* Show results count when not loading and has results */}
      {!isLoading && tours.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">{t('results_count', { count: tours.length })}</p>
        </div>
      )}

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
              <span className="text-gray-600">{t('searching')}</span>
            </div>
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
