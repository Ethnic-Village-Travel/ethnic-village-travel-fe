'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { TourStatusEnum } from '@/core/enum/tour.enum';

import { TourCreateRequest } from '@/types/tour.type';
import { TourCreateFormValues } from '@/libs/schemas/tour.schema';
import { useFetchEthnics, useFetchLocations } from '@/hooks/api/useMetaData';
import { useAdminTourDetail, useAdminUpdateTour } from '@/hooks/api/useTour';
import { useToast } from '@/hooks/use-toast';

import { TourForm } from '../components/tour-form';
import { useTourForm } from '../hooks/use-tour-form';

interface TourEditContentProps {
  tourId: string;
}

export default function TourEditContent({ tourId }: TourEditContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: tourResponse, isLoading } = useAdminTourDetail(tourId);
  const { mutate: updateTour, isPending } = useAdminUpdateTour();
  const { data: ethnics } = useFetchEthnics();
  const { data: locations } = useFetchLocations();

  const form = useTourForm({ isEditMode: true });
  const hasResetRef = useRef(false);

  const tourData = tourResponse?.data;

  useEffect(() => {
    if (tourData && ethnics && locations && !hasResetRef.current) {
      hasResetRef.current = true;
      const services = tourData.tourServices || tourData.services || [];

      form.reset({
        title: tourData.title || '',
        image: tourData.imageUrl || '',
        overview: tourData.overview || '',
        status: tourData.status || TourStatusEnum.DRAFT.value,
        duration: tourData.duration || 1,
        pickupLocation: tourData.pickUpLocation?.id ? String(tourData.pickUpLocation.id) : '',
        adultPrice: tourData.adultPrice || 0,
        childPrice: tourData.childPrice || 0,
        itinerary:
          Array.isArray(tourData.timeline) && tourData.timeline.length > 0
            ? tourData.timeline.map((t: any) => ({
                title: t.title || `Ngày ${t.day || ''}`,
                description:
                  t.description || t.activities?.map((a: any) => `${a.time}: ${a.description}`).join('\n') || '',
              }))
            : [],
        ethnic: tourData.ethnics?.map(e => String(e.id)) || [],
        location: tourData.locations?.map(l => String(l.id)) || [],
        included: services.filter(s => s.included === true).map(s => String(s.id)) || [],
        excluded: services.filter(s => s.included === false).map(s => String(s.id)) || [],
        availableDates:
          (tourData.availableDates?.map(d => ({
            id: d.id,
            startDate: new Date(d.startDate),
            maxSlots: d.maxSlots,
            assignedEmployees: [],
          })) as any) || [],
        publishedDate: tourData.publishedAt ? new Date(tourData.publishedAt) : new Date(),
      });
    }
  }, [tourData, ethnics, locations, form]);

  const onSubmit = async (data: TourCreateFormValues) => {
    if (!data) return;

    const duration = data.duration;

    const calculateEndDate = (startDate: Date, duration: number) => {
      const end = new Date(startDate);
      end.setDate(end.getDate() + (duration - 1));
      return end;
    };

    const payload: Partial<TourCreateRequest> = {
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
      availableDates: data.availableDates.map((date: any) => ({
        id: date.id,
        startDate: date.startDate,
        endDate: calculateEndDate(date.startDate, duration),
        maxSlots: date.maxSlots,
      })),
      publishedDate: data.publishedDate,
    };

    updateTour(
      { id: tourId, data: payload },
      {
        onSuccess: data => {
          if (!data) return;
          toast({
            title: data.message || 'Cập nhật tour thành công',
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
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-muted-foreground">Đang tải dữ liệu tour...</div>
      </div>
    );
  }

  return <TourForm form={form} onSubmit={onSubmit} mode="edit" isSubmitting={isPending} />;
}
