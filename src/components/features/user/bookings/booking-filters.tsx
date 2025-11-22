'use client';

import { useState } from 'react';
import { BookingStatus } from '@/core/enum/booking.enum';
import { cn } from '@/utils/classnames';
import { format, parse, startOfDay } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BookingListRequest } from '@/types/booking';
import { useBookingQueryConfig } from '@/hooks/use-query-config';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BookingFiltersProps {
  onFilterChange: (filters: Partial<BookingListRequest>) => void;
  showStatusFilter?: boolean;
}

const FILTER_BOOKING_STATUS = Object.values(BookingStatus);

export default function BookingFilters({ onFilterChange, showStatusFilter = true }: BookingFiltersProps) {
  const t = useTranslations('personal.transaction');
  const queryConfig = useBookingQueryConfig();

  // Parse initial dates from query config, ensuring only date part is used
  const startDateStr = queryConfig.start_date as string | undefined;
  const endDateStr = queryConfig.end_date as string | undefined;

  // Parse initial statuses from query config
  const initialStatuses = queryConfig.status
    ? (queryConfig.status as string[]).map(status => status as BookingStatus)
    : [];

  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    return startDateStr ? parse(startDateStr, 'yyyy-MM-dd', new Date()) : undefined;
  });

  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    return endDateStr ? parse(endDateStr, 'yyyy-MM-dd', new Date()) : undefined;
  });

  const [selectedStatuses, setSelectedStatuses] = useState<BookingStatus[]>(initialStatuses);
  const [statusesOpen, setStatusesOpen] = useState(false);

  const statusOptions = FILTER_BOOKING_STATUS.map(status => {
    const statusKey = status === BookingStatus.PENDING_PAYMENT ? 'expired_payment' : status.toLowerCase();
    return {
      value: status,
      label: t(`status.${statusKey}` as any),
    };
  });

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      onFilterChange({ startDate: format(startOfDay(date), 'yyyy-MM-dd') });
    } else {
      onFilterChange({ startDate: undefined });
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      onFilterChange({ endDate: format(startOfDay(date), 'yyyy-MM-dd') });
    } else {
      onFilterChange({ endDate: undefined });
    }
  };

  const handleStatusChange = (status: BookingStatus) => {
    let newStatuses: BookingStatus[];

    if (selectedStatuses.includes(status)) {
      newStatuses = selectedStatuses.filter(s => s !== status);
    } else {
      newStatuses = [...selectedStatuses, status];
    }

    setSelectedStatuses(newStatuses);

    // Call onFilterChange for parent component
    onFilterChange({ status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const clearFilters = () => {
    setStartDate(startDateStr ? parse(startDateStr, 'yyyy-MM-dd', new Date()) : undefined);
    setEndDate(endDateStr ? parse(endDateStr, 'yyyy-MM-dd', new Date()) : undefined);
    setSelectedStatuses([]);
    onFilterChange({
      startDate: startDateStr,
      endDate: endDateStr,
      status: undefined,
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">{t('filters.date_range')}</span>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'w-[130px] justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : t('filters.start_date')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={handleStartDateChange} initialFocus />
                </PopoverContent>
              </Popover>
              <span>-</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn('w-[130px] justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : t('filters.end_date')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={handleEndDateChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {showStatusFilter && (
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">{t('filters.status')}</span>
              <Popover open={statusesOpen} onOpenChange={setStatusesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={statusesOpen}
                    className="w-[200px] justify-between"
                    size="sm"
                  >
                    {selectedStatuses.length > 0
                      ? `${selectedStatuses.length} ${t('filters.selected')}`
                      : t('filters.all_statuses')}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder={t('filters.search_status')} />
                    <CommandEmpty>{t('filters.no_results')}</CommandEmpty>
                    <CommandGroup>
                      {statusOptions.map(status => (
                        <CommandItem
                          key={status.value}
                          value={status.value}
                          onSelect={() => handleStatusChange(status.value)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedStatuses.includes(status.value) ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {status.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
            {t('filters.clear')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
