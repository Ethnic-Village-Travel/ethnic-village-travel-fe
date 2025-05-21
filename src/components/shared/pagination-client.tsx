'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { createSearchParams } from '@/utils';

import { QueryConfig } from '@/types/query.type';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const DEFAULT_RANGE = 2;

interface PaginationClientProps {
  queryConfig: QueryConfig;
  pageSize: number;
  range?: number;
  showFirstLast?: boolean;
}

export default function PaginationClient({
  queryConfig,
  pageSize,
  range = DEFAULT_RANGE,
  showFirstLast = false,
}: PaginationClientProps) {
  const pathname = usePathname();
  const page = Number(queryConfig.page || '1');

  // Don't render pagination if there's only 1 page or no pages
  if (pageSize <= 1) return null;

  const createPageUrl = (pageNumber: number) => ({
    pathname,
    query: createSearchParams({
      ...queryConfig,
      page: pageNumber.toString(),
    }).toString(),
  });

  const pages = useMemo(() => {
    const items: React.ReactNode[] = [];

    if (showFirstLast && page > 1 + range) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink href={createPageUrl(1)}>1</PaginationLink>
        </PaginationItem>,
      );
    }

    let startPage = Math.max(1, page - range);
    let endPage = Math.min(pageSize, page + range);

    const visiblePages = range * 2 + 1;
    if (endPage - startPage + 1 < visiblePages) {
      if (startPage === 1) {
        endPage = Math.min(pageSize, startPage + visiblePages - 1);
      } else if (endPage === pageSize) {
        startPage = Math.max(1, endPage - visiblePages + 1);
      }
    }

    if (startPage > 1 + (showFirstLast ? 1 : 0)) {
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

    if (endPage < pageSize - (showFirstLast ? 1 : 0)) {
      items.push(
        <PaginationItem key="ellipsis-after">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    if (showFirstLast && page < pageSize - range) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink href={createPageUrl(pageSize)}>{pageSize}</PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  }, [page, pageSize, range, showFirstLast]);

  return (
    <Pagination>
      <PaginationContent>
        {page === 1 ? (
          <PaginationItem>
            <span className="px-3 py-2 text-sm text-muted-foreground">Previous</span>
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationPrevious href={createPageUrl(page - 1)} />
          </PaginationItem>
        )}

        {pages}

        {page === pageSize ? (
          <PaginationItem>
            <span className="px-3 py-2 text-sm text-muted-foreground">Next</span>
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationNext href={createPageUrl(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
