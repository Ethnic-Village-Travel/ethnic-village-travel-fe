'use client';

import * as React from 'react';

import { Tour } from '@/types/tour.type';
import { fetchTours } from '@/lib/mock-api';
import { useDataTable } from '@/hooks/use-data-table';
import { useQueryConfig } from '@/hooks/use-query-config';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableToolbar } from '@/components/shared/data-table/data-table-toolbar';

import DeleteTourDialog from './tour-delete-dialog';
import { ToursTableActionBar } from './tour-table-action-bar';
import { getTourTableColumns } from './tour-table-columns';

interface ToursTableProps {
  data?: Tour[];
  pageCount?: number;
}

export function ToursTable() {
  const queryConfig = useQueryConfig();
  const [tourData, setTourData] = React.useState<{
    data: Tour[];
    pageCount: number;
    statusCounts: Record<string, number>;
  }>({
    data: [],
    pageCount: 0,
    statusCounts: {},
  });

  // Fetch data when filters change
  React.useEffect(() => {
    const loadData = async () => {
      const result = await fetchTours({
        searchTerm: queryConfig.search,
        status: queryConfig.status,
        page: queryConfig.page,
        pageSize: queryConfig.perPage,
      });
      setTourData(result);
    };
    loadData();
  }, [queryConfig]);

  const [rowAction, setRowAction] = React.useState<{
    id: number;
    action: 'edit' | 'delete' | 'status';
    row?: Tour;
  } | null>(null);

  const columns = React.useMemo(
    () =>
      getTourTableColumns({
        setRowAction,
      }),
    [],
  );

  const { table } = useDataTable<Tour>({
    data: tourData.data,
    columns,
    pageCount: tourData.pageCount,
    initialState: {
      columnPinning: { right: ['actions'] },
    },
    getRowId: originalRow => originalRow.id.toString(),
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable table={table} actionBar={<ToursTableActionBar table={table} />}>
        <DataTableToolbar table={table} />
      </DataTable>
      {/* TODO: Implement UpdateTourSheet
      <UpdateTourSheet
        open={rowAction?.variant === 'update'}
        onOpenChange={() => setRowAction(null)}
        tour={rowAction?.row.original ?? null}
      />
      */}
      <DeleteTourDialog
        open={rowAction?.action === 'delete'}
        onOpenChange={() => setRowAction(null)}
        tours={rowAction?.row ? [rowAction.row] : []}
        showTrigger={false}
        onSuccess={() => {
          // TODO: Implement refresh logic here
          setRowAction(null);
        }}
      />
    </>
  );
}
