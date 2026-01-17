import TourEditContent from '@/components/features/admin/tour-management/tour-edit';

export default async function TourEditPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <TourEditContent tourId={params.id} />;
}
