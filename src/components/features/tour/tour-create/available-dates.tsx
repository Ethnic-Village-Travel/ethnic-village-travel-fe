import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFieldArray, UseFormReturn, useWatch } from 'react-hook-form';

import { TourCreateFormValues } from '@/lib/schemas/tour.schema';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { AvailableEmployeeSelect } from '../admin-tour-list/components/available-employee-select';

type AvailableDatesProps = {
  form: UseFormReturn<TourCreateFormValues>;
};

export default function AvailableDates({ form }: AvailableDatesProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availableDates',
  });

  const t = useTranslations();
  const { toast } = useToast();

  // Watch duration and publishedDate for validation
  const duration = useWatch({ control: form.control, name: 'duration' }) || 3;
  const publishedDate = useWatch({ control: form.control, name: 'publishedDate' });
  const availableDates = useWatch({ control: form.control, name: 'availableDates' }) || [];

  // Calculate minimum start date
  const minStartDate = useMemo(() => {
    if (!publishedDate) return new Date();
    return new Date(publishedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  }, [publishedDate]);

  // Check for date conflicts when publishedDate changes
  useEffect(() => {
    if (!publishedDate || !availableDates.length) return;

    const minStartDate = new Date(publishedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const conflictingDates = availableDates.filter(date => date.startDate && new Date(date.startDate) < minStartDate);

    if (conflictingDates.length > 0) {
      toast({
        title: t('tourCreate.dateConflictWarning'),
        description: `${t('tourCreate.publishedDateConflictMessage')} (${publishedDate.toLocaleDateString('vi-VN')})`,
        variant: 'destructive',
      });
    }
  }, [publishedDate, availableDates, toast]);

  // Check for conflicts between available dates
  useEffect(() => {
    if (!availableDates.length || availableDates.length < 2 || !duration) return;

    for (let i = 0; i < availableDates.length; i++) {
      const currentDate = availableDates[i];
      if (!currentDate.startDate) continue;

      const currentStart = new Date(currentDate.startDate);
      const currentEnd = new Date(currentStart.getTime() + (duration - 1) * 24 * 60 * 60 * 1000);

      for (let j = i + 1; j < availableDates.length; j++) {
        const compareDate = availableDates[j];
        if (!compareDate.startDate) continue;

        const compareStart = new Date(compareDate.startDate);
        const compareEnd = new Date(compareStart.getTime() + (duration - 1) * 24 * 60 * 60 * 1000);

        // Check overlap
        if (currentStart <= compareEnd && currentEnd >= compareStart) {
          toast({
            title: t('tourCreate.dateConflictWarning'),
            description: `${t('tourCreate.availableDatesConflictMessage')} ${currentStart.toLocaleDateString('vi-VN')} - ${compareStart.toLocaleDateString('vi-VN')}`,
            variant: 'destructive',
          });
          return; // Show only first conflict
        }
      }
    }
  }, [availableDates, duration, toast]);

  const addAvailableDate = () => {
    if (fields.length < 5) {
      append({ startDate: new Date(), maxSlots: 1, assignedEmployees: [] });
    }
  };

  const removeAvailableDate = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Calculate end date for a given start date
  const calculateEndDate = (startDate: Date) => {
    return new Date(startDate.getTime() + (duration - 1) * 24 * 60 * 60 * 1000);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <FormLabel className="font-semibold">{t('tourCreate.availableDates')}</FormLabel>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addAvailableDate}
          disabled={form.getValues('availableDates')?.length >= 5}
          className="px-2"
        >
          <Plus className="h-4 w-4" /> {t('tourCreate.add')}
        </Button>
      </div>

      {/* Header labels */}
      <div className="mb-1 grid grid-cols-3 gap-2">
        <FormLabel>{t('tourCreate.startDate')}</FormLabel>
        <FormLabel>{t('tourCreate.endDate')}</FormLabel>
        <FormLabel>{t('tourCreate.maxSlots')}</FormLabel>
      </div>

      {/* Input rows */}
      {fields.map((field, index) => {
        const currentStartDate = form.watch(`availableDates.${index}.startDate`);
        const endDate = currentStartDate ? calculateEndDate(currentStartDate) : null;

        return (
          <div key={field.id} className="mb-4 space-y-3 rounded-lg border p-4">
            {/* First row: Start Date, End Date, Max Slots */}
            <div className="grid grid-cols-3 gap-2">
              {/* Start Date */}
              <FormField
                control={form.control}
                name={`availableDates.${index}.startDate`}
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          {field.value ? new Date(field.value).toLocaleDateString('vi-VN') : t('tourCreate.chooseDate')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date => {
                            // Disable dates before minimum start date
                            if (date < minStartDate) return true;

                            // Check conflicts with other available dates
                            const existingDates = form.getValues('availableDates') || [];
                            const newStart = date;
                            const newEnd = calculateEndDate(newStart);

                            return existingDates.some((existingDate, i) => {
                              if (i === index) return false; // Don't check against itself
                              if (!existingDate.startDate) return false;

                              const existingStart = new Date(existingDate.startDate);
                              const existingEnd = calculateEndDate(existingStart);

                              // Check overlap
                              return newStart <= existingEnd && newEnd >= existingStart;
                            });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date (Calculated, Read-only) */}
              <div className="flex items-center">
                <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                  {endDate ? endDate.toLocaleDateString('vi-VN') : '-'}
                </div>
              </div>

              {/* Max Slots */}
              <FormField
                control={form.control}
                name={`availableDates.${index}.maxSlots`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={e => {
                            let value = e.target.value.replace(/^0+/, '');
                            if (value === '') value = '1';
                            field.onChange(Number(value));
                          }}
                        />
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAvailableDate(index)}
                            className="px-2 text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Second row: Employee Selection */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name={`availableDates.${index}.assignedEmployees`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {currentStartDate && endDate ? (
                        <AvailableEmployeeSelect
                          startDate={currentStartDate.toLocaleString()}
                          endDate={endDate.toLocaleString()}
                          value={field.value || []}
                          onChange={employees => field.onChange(employees)}
                          placeholder={t('tourCreate.selectEmployee')}
                          showDateHeader={false}
                        />
                      ) : (
                        <div className="text-sm italic text-muted-foreground">
                          {t('tourCreate.selectStartDateFirst')}
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
