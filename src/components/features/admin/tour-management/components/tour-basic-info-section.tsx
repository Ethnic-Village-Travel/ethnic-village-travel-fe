'use client';

import { useState } from 'react';
import { TourStatusEnum } from '@/core/enum/tour.enum';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

import { TourCreateFormValues } from '@/libs/schemas/tour.schema';
import { useFetchEthnics, useFetchLocations } from '@/hooks/api/useMetaData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/shared/multiple-select';

interface TourBasicInfoSectionProps {
  form: UseFormReturn<TourCreateFormValues>;
}

export function TourBasicInfoSection({ form }: TourBasicInfoSectionProps) {
  const t = useTranslations();
  const [uploading, setUploading] = useState(false);
  const { data: ethnics } = useFetchEthnics();
  const { data: locations } = useFetchLocations();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <div className="mb-2 flex h-8 items-center">
              <FormLabel className="font-semibold">
                {t('tourCreate.image')}
                <span className="text-destructive"> {t('tourCreate.required')}</span>
              </FormLabel>
            </div>
            <FormControl>
              <div className="mt-2 flex flex-col gap-2">
                <Input
                  placeholder="https://..."
                  value={field.value || ''}
                  onChange={e => field.onChange(e.target.value)}
                />
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploading(true);
                      const reader = new FileReader();
                      reader.onload = () => {
                        const result = reader.result as string;
                        form.setValue('image', result, { shouldValidate: true });
                        setUploading(false);
                      };
                      reader.onerror = () => setUploading(false);
                      reader.readAsDataURL(file);
                    }}
                  />
                  {uploading && (
                    <span className="text-xs text-muted-foreground">
                      {t('uploading' as any) || 'Đang tải...'}
                    </span>
                  )}
                </div>
                {field.value && (
                  <div className="flex flex-col items-start gap-2">
                    <img
                      src={field.value}
                      alt="preview"
                      className="aspect-video w-full max-w-[400px] rounded-md border object-cover"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => form.setValue('image', '', { shouldValidate: true })}
                    >
                      {t('clear_image' as any) || 'Xóa ảnh'}
                    </Button>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">
              {t('tourCreate.title')}
              <span className="text-destructive"> {t('tourCreate.required')}</span>
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">
              {t('tourCreate.location')}
              <span className="text-destructive"> {t('tourCreate.required')}</span>
            </FormLabel>
            <FormControl>
              <MultiSelect
                options={(locations ?? []).map(loc => ({
                  id: String(loc.id),
                  name: loc.city,
                  province: loc.province,
                }))}
                onValueChange={values => field.onChange(values)}
                placeholder={t('tourCreate.selectLocation')}
                renderOption={option => (
                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <span className="text-sm font-semibold">{option.name}</span>
                      <Badge variant="outline" className="h-5 text-[10px]">
                        {option.province}
                      </Badge>
                    </div>
                  </div>
                )}
                maxCount={5}
                animation={2}
                variant="secondary"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ethnic"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">
              {t('tourCreate.ethnic')}
              <span className="text-destructive"> {t('tourCreate.required')}</span>
            </FormLabel>
            <MultiSelect
              options={(ethnics ?? []).map(e => ({ ...e, id: String(e.id) }))}
              onValueChange={values => field.onChange(values)}
              placeholder={t('tourCreate.selectEthnic')}
              variant="secondary"
              animation={2}
              maxCount={3}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">
              {t('tourCreate.duration')}
              <span className="text-destructive"> {t('tourCreate.required')}</span>
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Input
                  type="number"
                  min={1}
                  max={30}
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                  placeholder="Nhập số ngày"
                />
                {field.value && (
                  <div className="text-sm text-muted-foreground">
                    {field.value} ngày {field.value - 1} đêm
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t('tourCreate.status')}
                <span className="text-destructive"> {t('tourCreate.required')}</span>
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TourStatusEnum).map(({ value }) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="publishedDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="mb-[10px] font-semibold">
                {t('tourCreate.publishedDate')}
                <span className="text-destructive"> {t('tourCreate.required')}</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    {field.value ? field.value.toLocaleDateString('vi-VN') : t('tourCreate.chooseDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date => {
                      const currentDate = new Date();
                      const minDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                      return date < minDate;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="pickupLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">
              {t('tourCreate.pickupLocation')}
              <span className="text-destructive"> {t('tourCreate.required')}</span>
            </FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('tourCreate.selectPickupLocation')}>
                    {field.value && (
                      <span className="font-medium">
                        {(locations ?? []).find(loc => String(loc.id) === field.value)?.city}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(locations ?? []).map(option => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      <div className="flex flex-col">
                        <div className="flex gap-2">
                          <span className="text-sm font-semibold">{option.city}</span>
                          <Badge variant="outline" className="h-5 text-[10px]">
                            {option.province}
                          </Badge>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="overview"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">
              {t('tourCreate.overview')}
              <span className="text-destructive"> {t('tourCreate.required')}</span>
            </FormLabel>
            <FormControl>
              <Textarea {...field} className="min-h-[100px]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
