'use client';

import { useEffect, useState } from 'react';
import { MOCK_TOURS } from '@/data/tours';
import { cn } from '@/utils';
import { LayoutGrid, List } from 'lucide-react';

import { useQueryConfig } from '@/hooks/use-query-config';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TourItem } from '@/components/features/tour';
import PaginationClient from '@/components/shared/pagination-client';

const VIEW_MOD = { GRID: 'grid', LIST: 'list' } as const;

type ViewMode = (typeof VIEW_MOD)[keyof typeof VIEW_MOD];

export default function TourContentSection() {
  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MOD.GRID);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const queryConfig = useQueryConfig();

  useEffect(() => {
    const page = Number(queryConfig.page || 1);
    setCurrentPage(page);
  }, [queryConfig.page, setCurrentPage]);

  return (
    <div className="flex-1">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tours</h1>
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] focus:ring-0 focus-visible:ring-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low-to-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-to-low">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>

          <Separator className="mx-1 h-8 w-[0.5px] bg-gray-20" />

          <div className="flex items-center rounded-full border-[1px] border-gray-500">
            <Button
              variant="ghost"
              size="icon"
              className={cn('rounded-l-full text-gray-500 hover:text-primary-500', {
                'bg-gray-100 text-primary-500': viewMode === VIEW_MOD.GRID,
              })}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Separator className="h-5 w-[0.5px] bg-gray-20" />
            <Button
              variant="ghost"
              size="icon"
              className={cn('rounded-r-full text-gray-500 hover:text-primary-500', {
                'bg-gray-100 text-primary-500': viewMode === VIEW_MOD.LIST,
              })}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div
          className={cn('grid gap-6', {
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': viewMode === 'grid',
            'grid-cols-1': viewMode === 'list',
          })}
        >
          {MOCK_TOURS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(tour => (
            <TourItem key={tour.id} tour={tour} layout={viewMode === 'list' ? 'horizontal' : 'vertical'} />
          ))}
        </div>

        {/* Pagination */}
        <PaginationClient
          queryConfig={queryConfig}
          pageSize={Math.ceil(MOCK_TOURS.length / itemsPerPage)}
          range={itemsPerPage}
          showFirstLast
        />
      </div>
    </div>
  );
}
