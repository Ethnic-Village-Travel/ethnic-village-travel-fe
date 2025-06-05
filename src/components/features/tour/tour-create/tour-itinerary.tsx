import { useState } from 'react';
import { Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

import { TourFormValues } from '.';

type TourItineraryProps = {
  form: UseFormReturn<TourFormValues>;
};

export default function TourItinerary({ form }: TourItineraryProps) {
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
        <FormLabel className="font-semibold">
          Tour Itinerary<span className="text-destructive"> *</span>
        </FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              <Input placeholder="Day title" value={itineraryTitle} onChange={e => setItineraryTitle(e.target.value)} />
              <Textarea
                placeholder="Day description"
                value={itineraryDesc}
                onChange={e => setItineraryDesc(e.target.value)}
              />
              <Button type="button" onClick={addItinerary}>
                Add
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
