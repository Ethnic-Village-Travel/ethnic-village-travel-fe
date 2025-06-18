'use client';

import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { OtpFormValues, otpSchema } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { OtpInput } from '@/components/shared/otp-input';

interface EnterOtpPopupProps {
  onBack: () => void;
  onSubmit: (otp: string) => void;
  email: string;
}

export function EnterOtpPopup({ onBack, onSubmit, email }: EnterOtpPopupProps) {
  const t = useTranslations('auth.enter_otp');

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleSubmit = (values: OtpFormValues) => {
    onSubmit(values.otp);
  };

  return (
    <>
      <div className="flex items-center gap-[5px]">
        <Button variant="ghost" className="h-6 w-6 p-0" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <span className="text-base font-normal">{t('back')}</span>
      </div>

      <div className="flex flex-col gap-4">
        <Image src="/icons/logo.svg" alt="Ethnic Village Travel" width={64} height={64} className="object-contain" />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-[5px]">
            <h2 className="text-[30px] font-bold leading-[1.17]">{t('title')}</h2>
            <p className="text-gray-500">
              {t('description')}
              <br />
              {email}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
              <div className="flex flex-col gap-6">
                <OtpInput value={form.watch('otp')} onChange={value => form.setValue('otp', value)} />
              </div>

              <Button
                type="submit"
                className="hover:bg-primary/90 h-14 w-full rounded-[10px] bg-primary text-base font-normal text-white"
              >
                {t('verify_otp')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
