import { z } from 'zod';

import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { CardUpdate, CardUpdateChildren } from '../card-update';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must have 10 digits'),
});

const CONTACT_INFORMATION: CardUpdateChildren[] = [
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
      <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
      <CardUpdate
        className="border-none shadow-custom-blue"
        title="phan xuan s"
        formSchema={formSchema}
        childrenList={CONTACT_INFORMATION}
        footerOptions={
          <RadioGroup defaultValue="upcoming" className="grid w-full grid-cols-2 items-center justify-between p-3 px-8">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="upcoming" id="r1" />
              <Label className="text-lg" htmlFor="r1">
                I am a visitor
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="past" id="r2" />
              <Label className="text-lg" htmlFor="r2">
                I order for others
              </Label>
            </div>
          </RadioGroup>
        }
      />
    </div>
  );
}
