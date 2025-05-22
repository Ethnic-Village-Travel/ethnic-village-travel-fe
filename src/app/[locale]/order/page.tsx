'use client';

import ContactInformationForm from '@/components/features/order/contact-information-form';

export default function OrderPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Order Page</h1>
      <p className="mt-4 text-lg">This is the order page.</p>
      <ContactInformationForm />
    </div>
  );
}
