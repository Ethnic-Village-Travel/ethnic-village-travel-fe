'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingStatus } from '@/core/enum/booking.enum';
import { bookingAdminApi } from '@/data/apis/booking.admin.api';
import { cn } from '@/utils';
import { format, parse, startOfDay } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BookingFilters } from '@/types/booking';
import { TourAvailableDateResponse, TourBasicResponse } from '@/types/booking/booking.admin.response';
import { useAdminBookingQueryConfig } from '@/hooks/use-query-config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MultiSelect } from '@/components/shared/multiple-select';
import { SearchableSelect } from '@/components/shared/searchable-select';

export const BookingTableFilter = () => {
  const t = useTranslations('admin.booking.list.filter');
  const tStatus = useTranslations('admin.booking.list.status');
  const router = useRouter();
  const queryConfig = useAdminBookingQueryConfig();

  const [tours, setTours] = useState<TourBasicResponse[]>([]);
  const [tourDates, setTourDates] = useState<TourAvailableDateResponse[]>([]);
  const [isLoadingTours, setIsLoadingTours] = useState(false);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  // Parse initial dates from query config
  const startDateStr = queryConfig.start_date as string | undefined;
  const endDateStr = queryConfig.end_date as string | undefined;

  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    return startDateStr ? parse(startDateStr, 'yyyy-MM-dd', new Date()) : undefined;
  });

  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    return endDateStr ? parse(endDateStr, 'yyyy-MM-dd', new Date()) : undefined;
  });

  // Initialize filter values from URL
  const filters: BookingFilters = {
    tourId: queryConfig.tourId,
    tourAvailableDateIds: queryConfig.tourAvailableDateIds || [],
    status: (queryConfig.status as BookingStatus[]) || [],
    fromDate: queryConfig.start_date,
    toDate: queryConfig.end_date,
  };

  // Date change handlers
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      updateUrlParams({ fromDate: format(startOfDay(date), 'yyyy-MM-dd') });
    } else {
      updateUrlParams({ fromDate: undefined });
    }
    setFromDateOpen(false);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      updateUrlParams({ toDate: format(startOfDay(date), 'yyyy-MM-dd') });
    } else {
      updateUrlParams({ toDate: undefined });
    }
    setToDateOpen(false);
  };

  // Helper function to update URL parameters
  const updateUrlParams = (newFilters: Partial<BookingFilters>) => {
    const params = new URLSearchParams(window.location.search);

    // Update or remove parameters based on new filter values
    if (newFilters.tourId) {
      params.set('tourId', newFilters.tourId);
    } else if (newFilters.tourId === undefined) {
      params.delete('tourId');
    }

    if (newFilters.tourAvailableDateIds && newFilters.tourAvailableDateIds.length > 0) {
      params.set('tourAvailableDateIds', newFilters.tourAvailableDateIds.join(','));
    } else if (newFilters.tourAvailableDateIds !== undefined) {
      params.delete('tourAvailableDateIds');
    }

    if (newFilters.status && newFilters.status.length > 0) {
      params.set('status', newFilters.status.join(','));
    } else if (newFilters.status !== undefined) {
      params.delete('status');
    }

    if (newFilters.fromDate) {
      params.set('start_date', newFilters.fromDate);
    } else if (newFilters.fromDate === undefined) {
      params.delete('start_date');
    }

    if (newFilters.toDate) {
      params.set('end_date', newFilters.toDate);
    } else if (newFilters.toDate === undefined) {
      params.delete('end_date');
    }

    // Reset to first page when filters change
    params.set('page', '1');

    router.replace(`?${params.toString()}`);
  };

  // Load tours for search
  const handleTourSearch = (searchKey: string) => {
    setIsLoadingTours(true);
    bookingAdminApi
      .searchTours(searchKey)
      .then(result => {
        const tours = result.data || [];
        setTours(tours);
      })
      .catch(error => {
        console.error('Error searching tours:', error);
        setTours([]);
      })
      .finally(() => {
        setIsLoadingTours(false);
      });
  };

  // Load available dates when tour is selected
  useEffect(() => {
    if (filters.tourId) {
      setIsLoadingDates(true);
      bookingAdminApi
        .getTourAvailableDates(filters.tourId)
        .then(res => {
          setTourDates(res.data || []);
        })
        .catch(error => {
          console.error('Error loading tour dates:', error);
          setTourDates([]);
        })
        .finally(() => setIsLoadingDates(false));
    } else {
      setTourDates([]);
    }
  }, [filters.tourId]);

  // Handle filter changes
  const updateFilter = (key: keyof BookingFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };

    // Reset tour dates when tour changes
    if (key === 'tourId') {
      newFilters.tourAvailableDateIds = [];
    }

    updateUrlParams(newFilters);
  };

  const clearFilter = (key: keyof BookingFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];

    // Also clear tour dates if clearing tour
    if (key === 'tourId') {
      delete newFilters.tourAvailableDateIds;
    }

    updateUrlParams(newFilters);
  };

  const clearAllFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    updateUrlParams({
      tourId: undefined,
      tourAvailableDateIds: [],
      status: [],
      fromDate: undefined,
      toDate: undefined,
    });
  };

  // Booking status options
  const getStatusText = (status: BookingStatus) => {
    const statusKey = status.toLowerCase();
    return tStatus(statusKey as any) || status;
  };

  const statusOptions = Object.values(BookingStatus).map(status => ({
    name: getStatusText(status),
    id: status,
  }));

  // Tour options for select (SearchableSelect uses label/value)
  const tourOptions = tours.map(tour => ({
    label: tour.title.length > 50 ? `${tour.title.substring(0, 50)}...` : tour.title,
    value: tour.tourId,
  }));

  // Tour date options for multi-select
  const tourDateOptions = tourDates.map(date => ({
    name: `${format(new Date(date.startDate), 'dd/MM/yyyy')} - ${format(new Date(date.endDate), 'dd/MM/yyyy')}`,
    id: date.id,
  }));

  const hasFilters = Object.keys(filters).some(key => filters[key as keyof BookingFilters]);

  return (
    <div className="space-y-4">
      {/* Hàng 1: Tour, Status, Available Date */}
      <div className="flex flex-wrap gap-4">
        {/* Tour Select */}
        <div className="w-full md:w-80">
          <SearchableSelect
            placeholder={t('tour')}
            options={tourOptions}
            value={filters.tourId || ''}
            onValueChange={value => updateFilter('tourId', value)}
            onSearch={handleTourSearch}
            loading={isLoadingTours}
            clearable
            loadOnMount={true}
          />
        </div>

        {/* Tour Available Dates Multi-Select */}
        <div className="w-full md:w-96">
          <MultiSelect
            placeholder={t('tour_dates')}
            options={tourDateOptions}
            value={filters.tourAvailableDateIds || []}
            onValueChange={value => updateFilter('tourAvailableDateIds', value)}
            disabled={!filters.tourId || isLoadingDates}
            maxCount={1}
          />
        </div>

        {/* Status Multi-Select */}
        <div className="w-full md:w-auto">
          <MultiSelect
            placeholder={t('status')}
            options={statusOptions}
            value={filters.status || []}
            onValueChange={value => updateFilter('status', value)}
            maxCount={1}
          />
        </div>
      </div>

      {/* Hàng 2: From Date, To Date, Clear Button */}
      <div className="flex flex-wrap gap-4">
        {/* From Date */}
        <div className="w-full md:w-48">
          <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'dd/MM/yyyy') : 'Từ ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                disabled={date => (endDate ? date > endDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */}
        <div className="w-full md:w-48">
          <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'dd/MM/yyyy') : 'Đến ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                disabled={date => (startDate ? date < startDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear All Button */}
        {hasFilters && (
          <Button variant="ghost" onClick={clearAllFilters} className="h-10">
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Active Filters - Chỉ hiển thị available dates và status */}
      {
        <div className="flex flex-wrap gap-2">
          {filters.tourAvailableDateIds?.length || filters.status?.length ? (
            filters.tourAvailableDateIds?.map(dateId => {
              const date = tourDates.find(d => d.id === dateId);
              return date ? (
                <Badge key={dateId} variant="secondary" className="gap-1">
                  {format(new Date(date.startDate), 'dd/MM')} - {format(new Date(date.endDate), 'dd/MM')}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      updateFilter(
                        'tourAvailableDateIds',
                        filters.tourAvailableDateIds?.filter(id => id !== dateId),
                      )
                    }
                  />
                </Badge>
              ) : null;
            })
          ) : (
            <></>
          )}

          {filters.status?.map(status => (
            <Badge key={status} variant="secondary" className="gap-1">
              {getStatusText(status)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  updateFilter(
                    'status',
                    filters.status?.filter(s => s !== status),
                  )
                }
              />
            </Badge>
          ))}
        </div>
      }
    </div>
  );
};
