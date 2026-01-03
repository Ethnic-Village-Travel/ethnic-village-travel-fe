'use client';

import { useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { createSearchParams } from '@/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { QueryConfig } from '@/types/query.type';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';

const DEFAULT_RANGE = 2;

type PaginationClientProps = {
  queryConfig: QueryConfig;
  pageSize: number;
  range?: number;
  showFirstLast?: boolean;
};

export default function PaginationClient({
  queryConfig,
  pageSize,
  range = DEFAULT_RANGE,
  showFirstLast = false,
}: PaginationClientProps) {
  const pathname = usePathname();
  const page = Number(queryConfig.page || '1');

  const createPageUrl = useCallback(
    (pageNumber: number) => ({
      pathname,
      query: createSearchParams({
        ...queryConfig,
        page: pageNumber.toString(),
      }).toString(),
    }),
    [pathname, queryConfig],
  );

  const pages = useMemo(() => {
    const items: React.ReactNode[] = [];
    const shouldShowFirst = showFirstLast && page > 1 + range;
    const shouldShowLast = showFirstLast && page < pageSize - range;

    if (shouldShowFirst) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink href={createPageUrl(1)}>1</PaginationLink>
        </PaginationItem>,
      );
    }

    let startPage = Math.max(1, page - range);
    let endPage = Math.min(pageSize, page + range);
    const visiblePages = range * 2 + 1;
    const currentVisible = endPage - startPage + 1;

    if (currentVisible < visiblePages) {
      if (startPage === 1) {
        endPage = Math.min(pageSize, startPage + visiblePages - 1);
      } else if (endPage === pageSize) {
        startPage = Math.max(1, endPage - visiblePages + 1);
      }
    }

    const ellipsisOffset = showFirstLast ? 1 : 0;
    if (startPage > 1 + ellipsisOffset) {
      items.push(
        <PaginationItem key="ellipsis-before">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink href={createPageUrl(i)} isActive={i === page}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < pageSize - ellipsisOffset) {
      items.push(
        <PaginationItem key="ellipsis-after">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    if (shouldShowLast) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink href={createPageUrl(pageSize)}>{pageSize}</PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  }, [page, pageSize, range, showFirstLast, createPageUrl]);

  if (pageSize <= 1) return null;

  const disabledIconClass = 'flex h-9 w-9 items-center justify-center text-muted-foreground';
  const isFirstPage = page === 1;
  const isLastPage = page === pageSize;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {isFirstPage ? (
            <span className={disabledIconClass}>
              <ChevronLeft className="h-4 w-4" />
            </span>
          ) : (
            <PaginationLink href={createPageUrl(page - 1)} aria-label="Go to previous page">
              <ChevronLeft className="h-4 w-4" />
            </PaginationLink>
          )}
        </PaginationItem>

        {pages}

        <PaginationItem>
          {isLastPage ? (
            <span className={disabledIconClass}>
              <ChevronRight className="h-4 w-4" />
            </span>
          ) : (
            <PaginationLink href={createPageUrl(page + 1)} aria-label="Go to next page">
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
