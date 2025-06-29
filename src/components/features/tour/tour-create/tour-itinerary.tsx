import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

import { TourFormValues } from '@/lib/schemas/tour.schema';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

type TourItineraryProps = {
  form: UseFormReturn<TourFormValues>;
};

export default function TourItinerary({ form }: TourItineraryProps) {
  const t = useTranslations();
  const [itineraryTitle, setItineraryTitle] = useState('');
  const [itineraryDesc, setItineraryDesc] = useState('');

  const addItinerary = () => {
    if (itineraryTitle && itineraryDesc) {
      form.setValue('itinerary', [
        ...form.getValues('itinerary'),
        { title: itineraryTitle, description: itineraryDesc },
      ]);
      setItineraryTitle('');
      setItineraryDesc('');
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <FormLabel className="font-semibold">{t('tourCreate.itinerary')}</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              <Input
                placeholder={t('tourCreate.itinerary')}
                value={itineraryTitle}
                onChange={e => setItineraryTitle(e.target.value)}
              />
              <Textarea
                placeholder={t('tourCreate.overview')}
                value={itineraryDesc}
                onChange={e => setItineraryDesc(e.target.value)}
              />
              <Button type="button" onClick={addItinerary}>
                {t('tourCreate.addItinerary')}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        {form.getValues('itinerary').map((item, index) => (
          <div key={index} className="rounded border p-2">
            <h4 className="font-medium">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
