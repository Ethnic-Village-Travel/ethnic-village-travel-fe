import { z } from 'zod';

import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { CardUpdate, CardUpdateChildren } from '../card-update';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must have 10 digits'),
});

const CONTACT_INFORMATION: CardUpdateChildren[] = [
  {
    name: 'email',
    label: <span className="text-lg font-semibold text-gray-500">Email</span>,
    defaultChildren: <span className="text-base font-semibold">+84788641673</span>,
    defaultValue: '+84788641673',
    children: (
      <FormField name="email" render={({ field }) => <Input placeholder="Enter your full name" {...field} />} />
    ),
  },
];

export default function ContactInformationForm() {
  return (
    <CardUpdate
      className="shadow-custom-blue rounded-md border-none"
      title="Contact Information"
      formSchema={formSchema}
      childrenList={CONTACT_INFORMATION}
    />
  );
}
