'use client';

import React, { useState } from 'react';
import { currencyToNumber, formatCurrency } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Ethnic } from '@/types/ethnic.types';
import { Location } from '@/types/location.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/shared/multiple-select';

import ContactNumber from './contact-number';
import InExService from './in-ex-service';
import TourItinerary from './tour-itinerary';

const STATUS_ENUM = {
  Inactive: '0',
  Active: '1',
} as const;

const tourSchema = z
  .object({
    image: z.string().min(1, { message: 'Image is required' }),
    title: z.string().min(1, { message: 'Title is required' }),
    location: z.string().min(1, { message: 'Location is required' }),
    ethnic: z.array(z.string()).min(1, { message: 'At least one ethnic is required' }),
    maxSlots: z.number().min(1, { message: 'Max slots must be at least 1' }),
    status: z.enum(['0', '1']),
    pickupLocation: z.string().min(1, { message: 'Pick-up location is required' }),
    startDate: z.date().refine(data => data > new Date(), { message: 'Start date must be in the future' }),
    endDate: z.date(),
    publishedDate: z.date().min(new Date(), { message: 'Published date must be today or in the future' }),
    adultPrice: z.number().min(0),
    childPrice: z.number().min(0),
    contactNumbers: z
      .array(
        z.object({
          name: z.string(),
          phone: z.string().regex(/^\d{10}$/, 'Invalid phone number'),
        }),
      )
      .min(1),
    included: z.array(z.string()),
    excluded: z.array(z.string()),
    overview: z.string().min(1),
    itinerary: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
  })
  .refine(
    data => {
      if (!data.startDate || !data.endDate) return true;
      return data.startDate <= data.endDate;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    },
  );

export type TourFormValues = z.infer<typeof tourSchema>;

const mockLocationData: Location[] = [
  {
    id: '1',
    city: 'Thành phố Lào Cai',
    province: 'Lào Cai',
  },
  {
    id: '2',
    city: 'Sa Pa',
    province: 'Sapa',
  },
  {
    id: '3',
    city: 'Bắc Hà',
    province: 'Lào Cai',
  },
];

const mockEthnicData: Ethnic[] = [
  { id: '1', name: 'Kinh' },
  { id: '2', name: "H'mong" },
  { id: '3', name: 'Tay' },
];

export default function TourCreateContent() {
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      status: STATUS_ENUM.Inactive,
      contactNumbers: [{ name: '', phone: '' }],
      itinerary: [],
      ethnic: [],
      included: [],
      excluded: [],
      startDate: undefined,
      endDate: undefined,
    },
  });

  function onSubmit(data: TourFormValues) {
    console.log(data);
  }

  return (
    <div className="p-6">
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <h2 className="mb-6 text-2xl font-bold">Create New Tour</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-2 flex h-8 items-center">
                        <FormLabel className="block font-semibold">
                          Image<span className="text-destructive"> *</span>
                        </FormLabel>
                      </div>
                      <FormControl className="mt-4">
                        <Input type="file" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Title<span className="text-destructive"> *</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Location</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location">
                              {field.value && (
                                <span className="font-medium">
                                  {mockLocationData.find(loc => loc.id === field.value)?.city}
                                </span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {mockLocationData.map(option => (
                              <SelectItem key={option.id} value={option.id}>
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

                {/* Ethnic Groups */}
                <FormField
                  control={form.control}
                  name="ethnic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Ethnic<span className="text-destructive"> *</span>
                      </FormLabel>
                      <MultiSelect
                        options={mockEthnicData}
                        onValueChange={values => field.onChange(values)}
                        placeholder="Select ethnic"
                        variant="secondary"
                        animation={2}
                        maxCount={3}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* Max Slots */}
                  <FormField
                    control={form.control}
                    name="maxSlots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Max slots<span className="text-destructive"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Status<span className="text-destructive"> *</span>
                        </FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_ENUM).map(([key, value]) => (
                              <SelectItem key={value} value={value}>
                                {key}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Pickup Location */}
                <FormField
                  control={form.control}
                  name="pickupLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Pick-up location<span className="text-destructive"> *</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dates Group */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Start Date */}
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold">
                          Start Date<span className="text-destructive"> *</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start">
                              {field.value ? field.value.toLocaleDateString() : 'Choose date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* End Date */}
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold">
                          End Date<span className="text-destructive"> *</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start">
                              {field.value ? field.value.toLocaleDateString() : 'Choose date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={date => date < form.getValues('startDate')}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Published Date */}
                  <FormField
                    control={form.control}
                    name="publishedDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold">
                          Published Date<span className="text-destructive"> *</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start">
                              {field.value ? field.value.toLocaleDateString() : 'Choose date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Prices Group */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Adult Price */}
                  <FormField
                    control={form.control}
                    name="adultPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Adult price<span className="text-destructive"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            {...field}
                            onChange={e => {
                              const numericValue = currencyToNumber(e.target.value);
                              field.onChange(numericValue);
                            }}
                            value={formatCurrency(field.value || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Child Price */}
                  <FormField
                    control={form.control}
                    name="childPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Child price</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            {...field}
                            onChange={e => {
                              const numericValue = currencyToNumber(e.target.value);
                              field.onChange(numericValue);
                            }}
                            value={formatCurrency(field.value || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Contact Numbers */}
                <ContactNumber form={form} />

                <InExService form={form} />

                {/* Overview */}
                <FormField
                  control={form.control}
                  name="overview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Overview<span className="text-destructive"> *</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tour Itinerary */}
                <TourItinerary form={form} />
              </div>
              {/* Submit Button */}
              <Button type="submit" className="w-fit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
