import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { TourFormValues } from '@/lib/schemas/tour.schema';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type AvailableDatesProps = {
  form: UseFormReturn<TourFormValues>;
};

export default function AvailableDates({ form }: AvailableDatesProps) {
  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'availableDates',
  });

  const t = useTranslations();

  const addAvailableDate = () => {
    if (fields.length < 5) {
      append({ startDate: new Date(), endDate: new Date(), maxSlots: 1 });
    }
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
      {fields.map((field, index) => (
        <div key={field.id} className="mb-2 grid grid-cols-3 gap-2">
          {/* Start Date */}
          <FormField
            control={form.control}
            name={`availableDates.${index}.startDate`}
            render={({ field }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {field.value ? new Date(field.value).toLocaleDateString() : t('tourCreate.chooseDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* End Date */}
          <FormField
            control={form.control}
            name={`availableDates.${index}.endDate`}
            render={({ field }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {field.value ? new Date(field.value).toLocaleDateString() : t('tourCreate.chooseDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Max Slots */}
          <FormField
            control={form.control}
            name={`availableDates.${index}.maxSlots`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}
