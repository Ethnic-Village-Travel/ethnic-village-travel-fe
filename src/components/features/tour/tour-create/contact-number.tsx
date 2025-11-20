import { TourCreateFormValues } from '@/libs/schemas/tour.schema';
import { Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type ContactNumberProps = {
  form: UseFormReturn<TourCreateFormValues>;
};

export default function ContactNumber({ form }: ContactNumberProps) {
  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control: form.control,
    name: 'contactNumbers',
  });

  const t = useTranslations();

  const addContactNumber = () => {
    if (contactFields.length < 3) {
      appendContact({ name: '', phone: '' });
    }
  };

  const removeContactNumber = (index: number) => {
    if (contactFields.length > 1) {
      removeContact(index);
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <FormLabel className="font-semibold">{t('tourCreate.contactNumber')}</FormLabel>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addContactNumber}
          disabled={form.getValues('contactNumbers').length >= 3}
          className="px-2"
        >
          <Plus className="h-4 w-4" /> {t('tourCreate.add')}
        </Button>
      </div>
      {contactFields.map((field, index) => (
        <div key={field.id} className="mb-2 grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name={`contactNumbers.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={t('tourCreate.contactPerson')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`contactNumbers.${index}.phone`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-1">
                    <Input placeholder={t('tourCreate.contactNumber')} {...field} />
                    {contactFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContactNumber(index)}
                        className="px-2 text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}
