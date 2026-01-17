'use client';

import { currencyToNumber, formatCurrency } from '@/utils';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

import { TourCreateFormValues } from '@/libs/schemas/tour.schema';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface TourPricingSectionProps {
  form: UseFormReturn<TourCreateFormValues>;
}

export function TourPricingSection({ form }: TourPricingSectionProps) {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="adultPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">
              {t('tourCreate.adultPrice')}
              <span className="text-destructive"> {t('tourCreate.required')}</span>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="numeric"
                {...field}
                onChange={e => {
                  const numericValue = currencyToNumber(e.target.value);
                  field.onChange(numericValue);
                }}
                value={formatCurrency(field.value || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="childPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">
              {t('tourCreate.childPrice')}
              <span className="text-destructive"> {t('tourCreate.required')}</span>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="numeric"
                {...field}
                onChange={e => {
                  const numericValue = currencyToNumber(e.target.value);
                  field.onChange(numericValue);
                }}
                value={formatCurrency(field.value || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
