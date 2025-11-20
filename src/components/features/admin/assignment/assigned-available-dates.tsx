'use client';

import { Suspense } from 'react';

import { DataTableSkeleton } from '@/components/shared/data-table/data-table-skeleton';
import { Shell } from '@/components/shared/shell';

import { AssignedAvailableDatesHeader } from './components/assigned-available-dates-header';
import { AssignedAvailableDatesTable } from './components/assigned-available-dates-table';

export default function AssignedAvailableDatesContent() {
  return (
    <div className="p-6">
      <AssignedAvailableDatesHeader />
      <Shell className="gap-2">
        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={6}
              filterCount={3}
              cellWidths={['12rem', '10rem', '8rem', '8rem', '10rem', '6rem']}
              shrinkZero
            />
          }
        >
          <AssignedAvailableDatesTable />
        </Suspense>
      </Shell>
    </div>
  );
}
