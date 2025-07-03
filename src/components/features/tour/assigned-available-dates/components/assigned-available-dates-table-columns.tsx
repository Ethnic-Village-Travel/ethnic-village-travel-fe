'use client';

import React from 'react';
import Link from 'next/link';
import { RouteConstant } from '@/constants/route';
import { formatDate } from '@/utils/date';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarDays, Clock, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { AssignedAvailableDateResponse } from '@/types/tour-assignment.type';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';

interface GetAssignedAvailableDatesTableColumnsProps {
  t: ReturnType<typeof useTranslations>;
  isAdmin: boolean;
}

export function getAssignedAvailableDatesTableColumns({
  t,
  isAdmin,
}: GetAssignedAvailableDatesTableColumnsProps): ColumnDef<AssignedAvailableDateResponse>[] {

  const columns: ColumnDef<AssignedAvailableDateResponse>[] = [
    {
      id: 'tour',
      // accessorKey: 'tour.title',
      accessorFn: row => row.tour?.title,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tour" />,
      cell: ({ row }) => {
        const assignment = row.original;
        const tour = assignment.tour;
        const duration = tour.duration ? `${tour.duration} ngày ${tour.duration - 1} đêm` : '';

        return (
          <div className="min-w-[200px]">
            <div className="flex items-start gap-3">
              <img
                src={tour.imageUrl}
                alt={tour.title || 'Tour image'}
                className="h-12 w-12 rounded-md border object-cover"
                width={48}
                height={48}
                loading="lazy"
              />
              <div className="flex-1">
                <Link
                  href={`${RouteConstant.admin_tour}/${tour.id}`}
                  className="mb-1 line-clamp-2 text-sm font-semibold hover:text-primary"
                >
                  {tour.title || <span className="italic text-gray-400">(Không có tiêu đề)</span>}
                </Link>
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  {duration && (
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {duration}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: 'availableDate',
      // accessorKey: 'tourAvailableDate.startDate',
      accessorFn: row => row.tourAvailableDate?.startDate,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày khả dụng" />,
      cell: ({ row }) => {
        const assignment = row.original;
        const availableDate = assignment.tourAvailableDate;
        const startDate = formatDate(availableDate.startDate, { day: '2-digit', month: '2-digit', year: 'numeric' });
        const endDate = formatDate(availableDate.endDate, { day: '2-digit', month: '2-digit', year: 'numeric' });
        const isMultiDay = availableDate.startDate !== availableDate.endDate;

        return (
          <div className="min-w-[120px]">
            <div className="flex items-center gap-1 text-sm font-medium">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              {isMultiDay ? `${startDate} - ${endDate}` : startDate}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {availableDate.bookedSlots}/{availableDate.maxSlots} chỗ
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: 'assignedDate',
      accessorKey: 'assignedDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày phân công" />,
      cell: ({ row }) => {
        const assignment = row.original;
        const assignedDate = formatDate(assignment.assignedDate, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div className="min-w-[100px]">
            <div className="text-sm font-medium">{assignedDate}</div>
            <div className="text-xs text-muted-foreground">Bởi {assignment.assignedBy}</div>
          </div>
        );
      },
    },
    {
      id: 'status',
      // accessorKey: 'tour.status',
      accessorFn: row => row.tour?.status,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
      cell: ({ row }) => {
        const assignment = row.original;
        const status = assignment.tour.status;

        const getStatusVariant = (status: string) => {
          switch (status) {
            case 'ACTIVE':
              return 'success';
            case 'INACTIVE':
              return 'secondary';
            case 'CANCELLED':
              return 'destructive';
            default:
              return 'default';
          }
        };

        return <Badge variant={getStatusVariant(status) as any}>{t(`status.${status}`)}</Badge>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
  ];

  // Add employee column only for Admin
  if (isAdmin) {
    columns.push({
      id: 'assignedEmployee',
      // accessorKey: 'assignedEmployee.user.personal.fullName',
      accessorFn: row =>
        row.assignedEmployee?.personal
          ? `${row.assignedEmployee.personal.firstName} ${row.assignedEmployee.personal.lastName}`
          : undefined,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nhân viên được phân công" />,
      cell: ({ row }) => {
        const assignment = row.original;
        const employee = assignment.assignedEmployee;

        if (!employee) {
          return <span className="text-xs text-muted-foreground">Không có nhân viên</span>;
        }

        return (
          <div className="min-w-[120px]">
            <div className="text-sm font-medium">
              {employee.personal ? `${employee.personal.firstName} ${employee.personal.lastName}` : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">{employee.email}</div>
          </div>
        );
      },
    });
  }

  return columns;
}
