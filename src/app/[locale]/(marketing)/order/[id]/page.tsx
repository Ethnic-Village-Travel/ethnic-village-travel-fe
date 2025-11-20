import OrderDetail from '@/components/features/booking/order-detail';

export default function OrderPage() {
  return (
    <div className="flex h-full w-full flex-col px-[40px] py-6">
      <h1 className="mb-5 text-4xl font-semibold">Review Package</h1>
      <OrderDetail />
    </div>
  );
}
