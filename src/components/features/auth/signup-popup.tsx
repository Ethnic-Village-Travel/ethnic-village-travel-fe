'use client';

import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { SignupFormValues, signupSchema } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function SignupPopup() {
  const t = useTranslations('auth.signup');
  const { signupOpen, setSignupOpen, setLoginOpen, setEnterOtpOpen, setOtpEmail } = useAuthStore();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const handleSubmit = (values: SignupFormValues) => {
    // TODO: Implement signup logic
    setOtpEmail(values.email);
    setSignupOpen(false);
    setEnterOtpOpen(true);
  };

  const handleBackToLogin = () => {
    setSignupOpen(false);
    setLoginOpen(true);
  };

  return (
    <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
      <DialogContent className="flex flex-col gap-[30px] p-8">
        <div className="flex flex-col gap-4">
          <Image src="/icons/logo.svg" alt="Ethnic Village Travel" width={64} height={64} className="object-contain" />
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-[5px]">
              <h2 className="text-[30px] font-bold leading-[1.17]">{t('create_account')}</h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>{t('last_name')}</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder={t('last_name_placeholder')}
                              className="h-[44px] rounded-[10px] border-gray-500 px-3 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>{t('first_name')}</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder={t('first_name_placeholder')}
                              className="h-[44px] rounded-[10px] border-gray-500 px-3 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email')}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t('email_placeholder')}
                            className="h-[44px] rounded-[10px] border-gray-500 px-3 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password')}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t('password_placeholder')}
                            className="h-[44px] rounded-[10px] border-gray-500 px-3 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="hover:bg-primary/90 h-14 w-full rounded-[10px] bg-primary text-base font-normal text-white"
                >
                  {t('sign_up')}
                </Button>
              </form>

              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">{t('already_have_account')}</p>
                <Button variant="link" onClick={handleBackToLogin} className="p-0 text-sm text-primary">
                  {t('go_to_login')}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
