import PromotionEditContent from '@/components/features/admin/promotion-management/promotion-edit';

interface PromotionEditPageProps {
  params: {
    id: string;
  };
}

export default function PromotionEditPage({ params }: PromotionEditPageProps) {
  return <PromotionEditContent id={params.id} />;
}
