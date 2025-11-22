import { TourStatus } from '@/core/enum/tour.enum';
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
      publishedDate: z.date({ required_error: t('tourCreate.validation.publishedDateRequired') }).refine(
        date => {
          const currentDate = new Date();
          const minDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          return date >= minDate;
        },
        { message: t('tourCreate.validation.publishedDateMinWeek') },
      ),
      duration: z
        .number()
        .min(1, { message: t('tourCreate.validation.durationMin') })
        .max(30, { message: t('tourCreate.validation.durationMax') }),
      adultPrice: z.number().min(0, { message: t('tourCreate.validation.adultPriceMin') }),
      childPrice: z.number().min(0, { message: t('tourCreate.validation.childPriceMin') }),
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
            // endDate removed - will be calculated from startDate + duration
            maxSlots: z.number().min(1, { message: t('tourCreate.validation.maxSlotsMin') }),
            assignedEmployees: z
              .array(
                z.object({
                  id: z.string(),
                  email: z.string(),
                  personal: z
                    .object({
                      firstName: z.string(),
                      lastName: z.string(),
                    })
                    .optional()
                    .nullable(),
                }),
              )
              .min(1, { message: t('tourCreate.validation.assignedEmployeesRequired') }), // Require at least 1 employee
          }),
        )
        .min(1, { message: t('tourCreate.validation.availableDatesRequired') }),
    })
    .refine(
      data => {
        // Validate published date constraint
        if (!data.publishedDate) return true;
        const currentDate = new Date();
        const minPublishedDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        return data.publishedDate >= minPublishedDate;
      },
      {
        message: t('tourCreate.validation.publishedDateMinWeek'),
        path: ['publishedDate'],
      },
    )
    .refine(
      data => {
        // Validate start dates are after published date + 1 week
        if (!data.publishedDate || !data.availableDates) return true;
        const minStartDate = new Date(data.publishedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        return data.availableDates.every(date => date.startDate >= minStartDate);
      },
      {
        message: t('tourCreate.validation.startDateAfterPublished'),
        path: ['availableDates'],
      },
    )
    .refine(
      data => {
        // Validate no date conflicts between available dates
        if (!data.availableDates || !data.duration) return true;

        for (let i = 0; i < data.availableDates.length; i++) {
          const currentDate = data.availableDates[i];
          const currentStart = new Date(currentDate.startDate);
          const currentEnd = new Date(currentStart.getTime() + (data.duration - 1) * 24 * 60 * 60 * 1000);

          for (let j = i + 1; j < data.availableDates.length; j++) {
            const compareDate = data.availableDates[j];
            const compareStart = new Date(compareDate.startDate);
            const compareEnd = new Date(compareStart.getTime() + (data.duration - 1) * 24 * 60 * 60 * 1000);

            // Check overlap
            if (currentStart <= compareEnd && currentEnd >= compareStart) {
              return false;
            }
          }
        }
        return true;
      },
      {
        message: t('tourCreate.validation.dateConflict'),
        path: ['availableDates'],
      },
    );

export type TourCreateFormValues = z.infer<ReturnType<typeof createTourSchema>>;
