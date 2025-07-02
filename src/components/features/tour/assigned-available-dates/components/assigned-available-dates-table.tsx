'use client';

import React, { useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslations } from 'next-intl';

import { AssignedAvailableDateResponse } from '@/types/tour-assignment.type';
import { useAssignedAvailableDates } from '@/hooks/api/useTourAssignment';
import { useDataTable } from '@/hooks/use-data-table';
import { useQueryConfig } from '@/hooks/use-query-config';
import { DataTable, DataTableProps } from '@/components/shared/data-table/data-table';
import { DataTableViewOptions } from '@/components/shared/data-table/data-table-view-options';

import { getAssignedAvailableDatesTableColumns } from './assigned-available-dates-table-columns';
import { AssignedAvailableDatesTableFilter } from './assigned-available-dates-table-filter';

export function AssignedAvailableDatesTable() {
  const queryConfig = useQueryConfig();
  const t = useTranslations('admin');
  const { user } = useAuthStore();
  const isAdmin = Boolean(user?.roles?.includes('ADMIN'));

  // Build request params from URL query config
  const requestParams = useMemo(() => {
    const params = {
      page: queryConfig.page ? queryConfig.page - 1 : -1,
      size: typeof queryConfig.perPage === 'number' ? queryConfig.perPage : 10,
      sortBy: (queryConfig.sort_by as string) || 'assignedDate',
      order: (queryConfig.order as 'asc' | 'desc') || 'desc',
    } as any;

    // Add filters if present
    if (queryConfig.search) {
      params.searchKey = queryConfig.search as string;
    }
    if (queryConfig.status) {
      const statusArray = Array.isArray(queryConfig.status) ? queryConfig.status : [queryConfig.status as string];
      params.tourStatus = statusArray;
    }

    // Use existing date fields from queryConfig
    if (queryConfig.start_date) {
      params.fromDate = queryConfig.start_date as string;
    }
    if (queryConfig.end_date) {
      params.toDate = queryConfig.end_date as string;
    }

    return params;
  }, [queryConfig]);

  // Fetch assigned available dates
  const { data, isLoading, error } = useAssignedAvailableDates(requestParams);

  // Extract data from response with multiple safety checks
  const assignedDates = useMemo(() => {
    if (!data || !data.data || !Array.isArray(data.data.content)) {
      return [];
    }
    return data.data.content;
  }, [data]);

  const totalPages = useMemo(() => {
    if (!data || !data.data || typeof data.data.totalPages !== 'number') {
      return 0;
    }
    return data.data.totalPages;
  }, [data]);

  const columns = useMemo(
    () =>
      getAssignedAvailableDatesTableColumns({
        t,
        isAdmin,
      }),
    [t, isAdmin], // Add proper dependencies
  );

  // Always create table - useDataTable hook must be called unconditionally
  const { table } = useDataTable<AssignedAvailableDateResponse>({
    data: assignedDates,
    columns,
    pageCount: totalPages,
    initialState: {
      columnPinning: { left: ['tour'] },
    },
    getRowId: (originalRow: AssignedAvailableDateResponse) => {
      return originalRow?.assignmentId || `row-${Math.random().toString(36).substr(2, 9)}`;
    },
    shallow: false,
    clearOnDefault: true,
  });

  const dataTableProps: Partial<DataTableProps<AssignedAvailableDateResponse>> = {
    loading: isLoading ?? false, // Use same pattern as tour-table.tsx
  };

  // Handle error state - but still after all hooks are called
  if (error) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-destructive">Không thể tải dữ liệu</p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DataTable {...dataTableProps} table={table}>
        <div className="flex w-full items-start justify-between gap-2 p-1">
          <AssignedAvailableDatesTableFilter
            key={JSON.stringify({
              search: queryConfig.search,
              status: queryConfig.status,
              start_date: queryConfig.start_date,
              end_date: queryConfig.end_date,
            })}
          />
          <div className="flex items-center gap-2">
            <DataTableViewOptions table={table} />
          </div>
        </div>
      </DataTable>
    </>
  );
}
