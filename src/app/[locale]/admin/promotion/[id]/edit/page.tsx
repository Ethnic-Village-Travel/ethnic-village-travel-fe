import PromotionEditContent from '@/components/features/admin/promotion-management/promotion-edit';

type PromotionEditPageProps = {
  params: Promise<{
    id: string;
  }>;
}

export default async function PromotionEditPage(props: PromotionEditPageProps) {
  const params = await props.params;
  return <PromotionEditContent id={params.id} />;
}
