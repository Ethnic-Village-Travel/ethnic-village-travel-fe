'use client';

import Link from 'next/link';
import { TourStatusEnum } from '@/constants/enum/tour';
import { RouteConstant } from '@/constants/route';
import { splitDateStr } from '@/utils/date';
import type { ColumnDef } from '@tanstack/react-table';
import { CircleDashed, MoreHorizontal, Text } from 'lucide-react';

import { Tour } from '@/types/tour.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';

interface GetTourTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<{
      id: number;
      action: 'edit' | 'delete' | 'status';
      row?: Tour;
    } | null>
  >;
}

export function getTourTableColumns({ setRowAction }: GetTourTableColumnsProps): ColumnDef<Tour>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => <div className="line-clamp-2 min-w-[200px]">{row.getValue('title')}</div>,
      enableColumnFilter: true,
      meta: {
        label: 'Title',
        placeholder: 'Search titles...',
        variant: 'text',
        icon: Text,
      },
    },
    {
      accessorKey: 'ethnics',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ethnic" />,
      cell: ({ row }) => (
        <div className="flex min-w-[200px] flex-wrap gap-2">
          {row.original.ethnics?.map(ethnic => (
            <Badge key={ethnic.id} variant="outline" className="bg-gray-100">
              {ethnic.name}
            </Badge>
          ))}
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: true,
      // meta: {
      //   label: 'Ethnics',
      //   variant: 'multiSelect',
      //   options: Object.values(TourStatusEnum).map(status => ({
      //     label: status.label,
      //     value: status.value,
      //     // count: statusCounts[status],
      //     // icon: getStatusIcon(status),
      //   })),
      //   icon: CircleDashed,
      // },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const statusInfo = Object.values(TourStatusEnum).find(s => s.value === row.original.status);
        return statusInfo ? <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge> : null;
      },
      enableColumnFilter: true,
      meta: {
        label: 'Status',
        variant: 'multiSelect',
        options: Object.values(TourStatusEnum).map(status => ({
          label: status.label,
          value: status.value,
          // count: statusCounts[status],
          // icon: getStatusIcon(status),
        })),
        icon: CircleDashed,
      },
    },
    {
      accessorKey: 'slots',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Slots" />,
      cell: ({ row }) => <span>{row.original.maxSlot || 0}</span>,
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: 'inNumberRange',
    },
    {
      accessorKey: 'publishedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Publish(UTC)" />,
      cell: ({ row }) => {
        const [date, time] = splitDateStr(row.original.publishedAt);
        return (
          <div className="whitespace-pre">
            {date}
            {'\n'}
            {time}
          </div>
        );
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'start_date',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Start(UTC)" />,
      cell: ({ row }) => {
        const [date, time] = splitDateStr(row.original.publishedAt);
        return (
          <div className="whitespace-pre">
            {date}
            {'\n'}
            {time}
          </div>
        );
      },
    },
    {
      accessorKey: 'end_date',
      header: ({ column }) => <DataTableColumnHeader column={column} title="End(UTC)" />,
      cell: ({ row }) => {
        const [date, time] = splitDateStr(row.original.publishedAt);
        return (
          <div className="whitespace-pre">
            {date}
            {'\n'}
            {time}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const tour = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRowAction({ id: tour.id, action: 'edit', row: tour })}>
                <Link href={RouteConstant.admin_tour_edit.replace(':slug', tour.slug)}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRowAction({ id: tour.id, action: 'status', row: tour })}>
                Change Status
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setRowAction({ id: tour.id, action: 'delete', row: tour })}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
