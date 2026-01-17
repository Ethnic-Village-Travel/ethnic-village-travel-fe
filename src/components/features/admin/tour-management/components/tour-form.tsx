'use client';

import logger from '@/libs/logger';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

import { TourCreateFormValues } from '@/libs/schemas/tour.schema';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { TourAvailableDatesSection } from './tour-available-dates-section';
import { TourBasicInfoSection } from './tour-basic-info-section';
import { TourItinerarySection } from './tour-itinerary-section';
import { TourPricingSection } from './tour-pricing-section';
import { TourServicesSection } from './tour-services-section';

interface TourFormProps {
  form: UseFormReturn<TourCreateFormValues>;
  onSubmit: (data: TourCreateFormValues) => void;
  mode?: 'create' | 'edit';
  isSubmitting?: boolean;
}

export function TourForm({ form, onSubmit, mode = 'create', isSubmitting = false }: TourFormProps) {
  const t = useTranslations();

  const handleSubmit = (data: TourCreateFormValues) => {
    onSubmit(data);
  };

  const handleError = (errors: any) => {
    logger.warn('Form validation errors:', errors);
  };

  return (
    <div className="p-6">
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <h2 className="mb-6 text-2xl font-bold">
            {mode === 'create' ? t('tourCreate.title') : t('tourEdit.title')}
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit, handleError)} className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <TourBasicInfoSection form={form} />
                <TourPricingSection form={form} />
              </div>

              <div className="space-y-4">
                <TourAvailableDatesSection form={form} />
                <TourServicesSection form={form} />
                <TourItinerarySection form={form} />
              </div>

              <Button type="submit" className="w-fit" disabled={isSubmitting}>
                {isSubmitting ? t('Common.button.submitting' as any) || 'Đang gửi...' : t('tourCreate.submit')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
