'use client';

import { TourStatusEnum } from '@/core/enum/tour.enum';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm, UseFormReturn } from 'react-hook-form';

import { createTourSchema, TourCreateFormValues } from '@/libs/schemas/tour.schema';

export interface UseTourFormOptions {
  initialData?: Partial<TourCreateFormValues>;
  isEditMode?: boolean;
}

export function useTourForm(options?: UseTourFormOptions): UseFormReturn<TourCreateFormValues> {
  const t = useTranslations();
  const { initialData, isEditMode = false } = options || {};

  const defaultValues: TourCreateFormValues = {
    image: '',
    title: '',
    status: TourStatusEnum.DRAFT.value,
    duration: 3,
    itinerary: [],
    ethnic: [],
    location: [],
    included: [],
    excluded: [],
    availableDates: isEditMode ? [] : [{ startDate: new Date(), maxSlots: 10 }],
    overview: '',
    adultPrice: 0,
    childPrice: 0,
    pickupLocation: '',
    publishedDate: new Date(),
    ...initialData,
  };

  return useForm<TourCreateFormValues>({
    resolver: zodResolver(createTourSchema((key: string) => t.raw(key as any), isEditMode)),
    defaultValues,
  });
}
