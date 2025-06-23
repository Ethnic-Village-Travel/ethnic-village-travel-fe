import { validatePromotion } from '@/apis/promotion.api';
import { formatCurrency } from '@/utils';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { BookingStoreResponse } from '@/types/booking';
import { PromotionErrorCode, PromotionValidateResponse } from '@/types/promotion.type';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PromotionValidationFormProps = {
  booking: BookingStoreResponse;
  promotion: PromotionValidateResponse | null;
  setPromotion: (promotion: PromotionValidateResponse) => void;
};

const PromotionValidationForm = ({ promotion, booking, setPromotion }: PromotionValidationFormProps) => {
  const t = useTranslations('order.promotion');
  const locale = useLocale() as 'vi' | 'en' | 'ko';
  const { toast } = useToast();

  const { register, handleSubmit } = useForm<{ code: string }>();

  const handlePromotionSubmit = async (data: { code: string }) => {
    try {
      const response = await validatePromotion(data.code, booking.tour.id);

      switch (response.errorCode) {
        case PromotionErrorCode.PROMOTION_EXPIRED:
          toast({
            variant: 'destructive',
            title: t('errors.expired'),
          });
          break;
        case PromotionErrorCode.PROMOTION_OUT_OF_STOCK:
          toast({
            variant: 'destructive',
            title: t('errors.out_of_stock'),
          });
          break;
        case PromotionErrorCode.PROMOTION_NOT_ACTIVE:
          toast({
            variant: 'destructive',
            title: t('errors.inactive'),
          });
          break;
        case PromotionErrorCode.PROMOTION_NOT_FOUND:
          toast({
            variant: 'destructive',
            title: t('errors.not_found'),
          });
          break;
        default:
          setPromotion(response);
          toast({
            title: t('success'),
          });
          break;
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: error.message,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handlePromotionSubmit)}>
        <div className="flex gap-2">
          <Input {...register('code')} placeholder={t('promotion_code')} />
          <Button type="submit">{t('apply')}</Button>
        </div>
      </form>
      {promotion && (
        <div className="text-sm text-green-600">
          {t('discount')}: {promotion.discountPercent}%
          {promotion.maxDiscountAmount > 0 &&
            ` (${t('max')}: ${formatCurrency(promotion.maxDiscountAmount, {
              locale: locale,
            })})`}
        </div>
      )}
    </>
  );
};

export default PromotionValidationForm;
