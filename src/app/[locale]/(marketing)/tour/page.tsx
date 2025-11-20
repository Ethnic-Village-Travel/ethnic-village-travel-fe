'use client';

import TourContentSection from '@/components/features/tour/tour-list/content-section';
import FilterSection from '@/components/features/tour/tour-list/filter-section';
import { SearchBar } from '@/components/features/tour/tour-search';

export default function TourList() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <SearchBar className="w-screen max-w-screen-2xl rounded-none border-0 px-4 shadow-custom-blue md:px-8 lg:px-16 xl:px-28" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <FilterSection />
          <TourContentSection />
        </div>
      </div>
    </div>
  );
}
