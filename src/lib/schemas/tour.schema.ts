import { TourStatus } from '@/constants/enum/tour.enum';
import { z } from 'zod';

export const createTourSchema = (t: (key: string) => string) =>
  z
    .object({
      image: z.string().min(1, { message: t('tourCreate.validation.imageRequired') }),
      title: z.string().min(1, { message: t('tourCreate.validation.titleRequired') }),
      location: z.array(z.string()).min(1, { message: t('tourCreate.validation.locationRequired') }),
      ethnic: z.array(z.string()).min(1, { message: t('tourCreate.validation.ethnicRequired') }),
      status: z.string().refine(
        value => {
          try {
            return Object.values(TourStatus).includes(value as TourStatus);
          } catch (error) {
            return !!value;
          }
        },
        { message: t('tourCreate.validation.statusInvalid') },
      ),
      pickupLocation: z.string().min(1, { message: t('tourCreate.validation.pickupLocationRequired') }),
      publishedDate: z.date({ required_error: t('tourCreate.validation.publishedDateRequired') }),
      adultPrice: z.number().min(0, { message: t('tourCreate.validation.adultPriceMin') }),
      childPrice: z.number(),
      contactNumbers: z
        .array(
          z.object({
            name: z.string().min(1, { message: t('tourCreate.validation.contactNameRequired') }),
            phone: z.string().regex(/^[0-9]{10}$/, t('tourCreate.validation.contactPhoneInvalid')),
          }),
        )
        .min(1),
      included: z.array(z.string()),
      excluded: z.array(z.string()),
      overview: z.string().min(1, { message: t('tourCreate.validation.overviewRequired') }),
      itinerary: z.array(
        z.object({
          title: z.string().min(1, { message: t('tourCreate.validation.itineraryTitleRequired') }),
          description: z.string().min(1, { message: t('tourCreate.validation.itineraryDescriptionRequired') }),
        }),
      ),
      availableDates: z
        .array(
          z.object({
            startDate: z.date({ required_error: t('tourCreate.validation.startDateRequired') }),
            endDate: z.date({ required_error: t('tourCreate.validation.endDateRequired') }),
            maxSlots: z.number().min(1, { message: t('tourCreate.validation.maxSlotsMin') }),
          }),
        )
        .min(1, { message: t('tourCreate.validation.availableDatesRequired') }),
    })
    .refine(
      data => {
        if (!data.availableDates) return true;
        return data.availableDates.every(d => d.startDate && d.endDate && d.startDate <= d.endDate);
      },
      {
        message: t('tourCreate.validation.endDateAfterStart'),
        path: ['availableDates'],
      },
    );

export type TourFormValues = z.infer<ReturnType<typeof createTourSchema>>;
