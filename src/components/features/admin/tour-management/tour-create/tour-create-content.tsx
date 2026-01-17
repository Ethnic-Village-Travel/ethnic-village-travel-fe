'use client';

import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';

import { TourCreateRequest } from '@/types/tour.type';
import { TourCreateFormValues } from '@/libs/schemas/tour.schema';
import { useAdminCreateTour } from '@/hooks/api/useTour';
import { useToast } from '@/hooks/use-toast';

import { TourForm } from '../components/tour-form';
import { useTourForm } from '../hooks/use-tour-form';

export default function TourCreateContent() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useTourForm({ isEditMode: false });
  const { mutate: createTour, isPending } = useAdminCreateTour();

  const onSubmit = async (data: TourCreateFormValues) => {
    if (!data) return;

    const duration = data.duration;

    const payload: TourCreateRequest = {
      title: data.title,
      imageUrl: data.image,
      overview: data.overview,
      status: data.status,
      duration,
      pickUpLocationId: data.pickupLocation,
      adultPrice: data.adultPrice,
      childPrice: data.childPrice,
      timeline: data.itinerary,
      ethnicIds: data.ethnic,
      locationIds: data.location,
      tourIncludedServices: data.included,
      tourExcludedServices: data.excluded,
      availableDates: data.availableDates.map(date => ({
        startDate: date.startDate,
        endDate: new Date(date.startDate.getTime() + (duration - 1) * 24 * 60 * 60 * 1000),
        maxSlots: date.maxSlots,
      })),
      publishedDate: data.publishedDate,
    };

    createTour(payload, {
      onSuccess: data => {
        if (!data) {
          return;
        }

        toast({
          title: data.message,
          variant: 'default',
        });
        router.push(RouteConstant.admin_tour);
      },
      onError: error => {
        toast({
          title: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return <TourForm form={form} onSubmit={onSubmit} mode="create" isSubmitting={isPending} />;
}
