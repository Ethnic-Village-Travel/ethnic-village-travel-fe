'use client';

import { Skeleton } from '@/components/ui/skeleton';

const TourDetailHeaderSkeleton = () => {
  return (
    <div className="flex flex-col gap-2.5">
      <Skeleton className="h-[40px] w-3/4" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* Review Section */}
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-4 w-4" />
              ))}
            </div>
          </div>

          <div className="h-[53px] w-[1px] bg-gray-200" />

          {/* Days Section */}
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="h-[53px] w-[1px] bg-gray-200" />

          {/* Location Section */}
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Skeleton className="h-[38px] w-[38px]" />
          <Skeleton className="h-[38px] w-[100px]" />
        </div>
      </div>

      {/* Available Tickets */}
      <div className="mt-4">
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-[80px] w-[120px] flex-shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );
};

const TourDetailContentSkeleton = () => {
  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="relative mb-[30px] border-b border-gray-200 pb-3">
        <div className="flex gap-[30px]">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="absolute bottom-0 left-0 h-[3px] w-[84px] bg-primary" />
      </div>

      {/* Content */}
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

const BookingCalculatorSkeleton = () => {
  return (
    <div className="xl:flex-0 grid gap-4 rounded-[20px] border border-gray-20 bg-white p-[30px] shadow-custom-gray lg:w-[360px]">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="mx-auto h-4 w-3/4" />

      <div className="h-[1px] bg-gray-200" />

      {[1, 2].map(i => (
        <div key={i} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-14 w-14" />
          <Skeleton className="h-6 w-16" />
        </div>
      ))}

      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>

      <Skeleton className="h-[52px] w-full" />
    </div>
  );
};

export const TourDetailSkeleton = () => {
  return (
    <div>
      <Skeleton className="full-bleed h-[600px]" />
      <div className="flex flex-col pt-6">
        <div className="flex gap-10 px-[80px] pb-[60px] sm:flex-col-reverse md:flex-col-reverse lg:flex-col-reverse xl:flex-row">
          <div className="w-full space-y-10 xl:max-w-[calc(100%-360px)]">
            <TourDetailHeaderSkeleton />
            <TourDetailContentSkeleton />
          </div>
          <BookingCalculatorSkeleton />
        </div>
      </div>
    </div>
  );
};
