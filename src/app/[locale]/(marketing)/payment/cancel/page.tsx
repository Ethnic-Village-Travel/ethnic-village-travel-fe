'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { Home, RotateCcw, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('payment');

  const [countdown, setCountdown] = useState(15);

  const orderCode = searchParams.get('orderCode');
  const status = searchParams.get('status');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push(RouteConstant.home);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoHome = () => {
    router.push(RouteConstant.home);
  };

  const handleRetryPayment = () => {
    // Redirect back to the order page to retry payment
    if (orderCode) {
      router.push(RouteConstant.order_detail.replace(':id', orderCode));
    } else {
      router.push(RouteConstant.personal_transaction);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">{t('cancel.title')}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-gray-600">{t('cancel.description')}</p>
            {orderCode && (
              <p className="text-sm text-gray-500">
                {t('cancel.order_code')}: <span className="font-mono font-semibold">{orderCode}</span>
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button onClick={handleRetryPayment} className="w-full" variant="default">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('cancel.retry_payment')}
            </Button>

            <Button onClick={handleGoHome} className="w-full" variant="outline">
              <Home className="mr-2 h-4 w-4" />
              {t('cancel.back_home')}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">{t('cancel.auto_redirect', { seconds: countdown })}</div>
        </CardContent>
      </Card>
    </div>
  );
}
