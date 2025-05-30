'use client';

import { notFound } from 'next/navigation';
import { MOCK_ORDERS } from '@/data/orders';

import { OrderDetail } from '@/components/features/order';

interface OrdeDetailProps {
  params: {
    code: string;
  };
}

export default function OrderPage({ params }: OrdeDetailProps) {
  const order = MOCK_ORDERS.find(order => order.code === params.code);

  if (!order) {
    console.log('Tour not found:', params.code);
    return notFound();
  }

  return (
    <div className="flex h-full w-full flex-col px-[40px] py-6">
      <h1 className="mb-5 text-4xl font-semibold">Review Package</h1>
      <OrderDetail order={order} />
    </div>
  );
}
