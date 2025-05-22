'use client';

import { useState } from 'react';
import { cn } from '@/utils/general';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

export type CardUpdateChildren = {
  name: string;
  label: React.ReactNode;
  defaultChildren?: React.ReactNode;
  defaultValue: string;
  children: React.ReactNode;
};

interface CardUpdateProps {
  title: string;
  className?: string;
  formSchema: z.ZodObject<any>;
  childrenList: CardUpdateChildren[];
  footerOptions?: React.ReactNode;
}

export default function CardUpdate({ title, className, formSchema, childrenList, footerOptions }: CardUpdateProps) {
  type FormData = z.infer<typeof formSchema>;
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: childrenList.reduce((acc, item) => {
      acc[item.name] = item.defaultValue;
      return acc;
    }, {} as FormData),
  });

  const handleChange = () => {
    setIsUpdating(true);
  };

  const handleCancel = () => {
    setIsUpdating(false);
  };

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitResult({
        success: true,
        message: 'Form submitted successfully!',
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitResult({
        success: false,
        message: 'An error occurred while submitting the form.',
      });
    } finally {
      setIsSubmitting(false);
      setIsUpdating(false);
    }
  };

  return (
    <Card className={cn(className, 'rounded-md')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 py-3">
        <CardTitle>{title}</CardTitle>
        {!isUpdating && (
          <Button variant="link" size="sm" onClick={handleChange}>
            Change
          </Button>
        )}
      </CardHeader>
      <Separator className="h-px w-full bg-gray-20" />
      <CardContent className="px-5 py-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {childrenList.map(item =>
              !isUpdating ? (
                <div className="flex flex-col gap-2">
                  {item.label}
                  {item.defaultValue}
                </div>
              ) : (
                <FormItem>
                  <FormLabel>{item.label}</FormLabel>
                  <FormControl>{item.children}</FormControl>
                  <FormMessage />
                </FormItem>
              ),
            )}
          </form>
        </Form>
      </CardContent>
      {isUpdating ? (
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmit(form.getValues())} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </CardFooter>
      ) : (
        footerOptions && (
          <CardFooter className={cn('flex justify-between rounded-b-md bg-gray-20 px-5 py-0')}>
            {footerOptions}
          </CardFooter>
        )
      )}
    </Card>
  );
}
