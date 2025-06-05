import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MultiSelect } from '@/components/shared/multiple-select';

import { TourFormValues } from '.';

type InExServiceProps = {
  form: UseFormReturn<TourFormValues>;
};

const mockServiceData = [
  { id: '1', name: 'Flight Ticket' },
  { id: '2', name: 'Cab Transportation' },
  { id: '3', name: 'Hotel' },
];

export default function InExService({ form }: InExServiceProps) {
  const [includedServices, setIncludedServices] = useState<string[]>([]);
  const [excludedServices, setExcludedServices] = useState<string[]>([]);

  return (
    <>
      <FormField
        control={form.control}
        name="included"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">Included</FormLabel>
            <MultiSelect
              options={mockServiceData.filter(service => !excludedServices?.includes(service.name))}
              onValueChange={values => {
                field.onChange(values);
                setIncludedServices(values);
              }}
              placeholder="Select included services"
              variant="inverted"
              animation={2}
              maxCount={3}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Excluded */}
      <FormField
        control={form.control}
        name="excluded"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">Excluded</FormLabel>
            <FormControl>
              <MultiSelect
                options={mockServiceData.filter(service => !includedServices.includes(service.id))}
                onValueChange={values => {
                  field.onChange(values);
                  setExcludedServices(values);
                }}
                placeholder="Select excluded services"
                variant="destructive"
                animation={2}
                maxCount={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
