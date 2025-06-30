import { useState } from 'react';
import { TourServiceInfoType } from '@/constants/enum/tour-service-info.enum';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

import { ServiceInfoBasic } from '@/types/service-info.type';
import { TourFormValues } from '@/lib/schemas/tour.schema';
import { useServiceInfoList } from '@/hooks/api/useServiceInfo';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MultiSelect } from '@/components/shared/multiple-select';

export type ServiceWithType = ServiceInfoBasic & { type: TourServiceInfoType };

type InExServiceProps = {
  form: UseFormReturn<TourFormValues>;
};

export default function InExService({ form }: InExServiceProps) {
  const [includedServices, setIncludedServices] = useState<string[]>([]);
  const [excludedServices, setExcludedServices] = useState<string[]>([]);
  const { data: serviceInfoList = [], isLoading } = useServiceInfoList();
  const t = useTranslations();

  return (
    <>
      <FormField
        control={form.control}
        name="included"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">{t('tourCreate.included')}</FormLabel>
            <MultiSelect
              options={serviceInfoList.filter(service => !excludedServices.includes(service.id))}
              onValueChange={values => {
                field.onChange(values.map((id: string) => id));
                setIncludedServices(values);
              }}
              value={includedServices}
              placeholder={t('tourCreate.included')}
              variant="inverted"
              animation={2}
              maxCount={3}
              disabled={isLoading}
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
            <FormLabel className="font-semibold">{t('tourCreate.excluded')}</FormLabel>
            <FormControl>
              <MultiSelect
                options={serviceInfoList.filter(service => !includedServices.includes(service.id))}
                onValueChange={values => {
                  field.onChange(values.map((id: string) => id));
                  setExcludedServices(values);
                }}
                value={excludedServices}
                placeholder={t('tourCreate.excluded')}
                variant="destructive"
                animation={2}
                maxCount={3}
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
