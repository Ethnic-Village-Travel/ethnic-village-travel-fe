import { z } from 'zod';

import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { CardUpdate, CardUpdateChildren } from '../card-update';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must have 10 digits'),
});

const GUEST_INFORMATION: CardUpdateChildren[] = [
  {
    name: 'phone',
    label: <span className="text-lg font-semibold text-gray-500">Phone</span>,
    defaultChildren: <span className="text-base font-semibold">+84788641673</span>,
    defaultValue: '+84788641673',
    children: <FormField name="phone" render={({ field }) => <Input placeholder="Enter your Phone" {...field} />} />,
  },
  {
    name: 'email',
    label: <span className="text-lg font-semibold text-gray-500">Email</span>,
    defaultChildren: <span className="text-base font-semibold">phanxuansy@gmail.com</span>,
    defaultValue: 'phanxuansy@gmail.com',
    children: <FormField name="email" render={({ field }) => <Input placeholder="Enter your Email" {...field} />} />,
  },
];

export default function ContactInformationCard() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-2xl font-semibold text-gray-800">Guest information</h2>
      <CardUpdate
        className="border-none shadow-custom-blue"
        title="phan xuan s"
        formSchema={formSchema}
        childrenList={GUEST_INFORMATION}
      />
    </div>
  );
}
