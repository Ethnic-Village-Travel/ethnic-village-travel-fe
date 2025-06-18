'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { SearchBar } from '@/components/features/home/hero-section';
import TourContentSection from '@/components/features/tour/content-section';
import FilterSection from '@/components/features/tour/filter-section';

export default function TourList() {
  const t = useTranslations('tour.list');
  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get('search');

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <SearchBar className="w-screen max-w-screen-2xl rounded-none border-0 px-4 shadow-custom-blue md:px-8 lg:px-16 xl:px-28" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
        {/* Show search results header if searching */}
        {searchKeyword && (
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{t('search_results', { keyword: searchKeyword })}</h1>
          </div>
        )}

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <FilterSection />
          <TourContentSection />
        </div>
      </div>
    </div>
  );
}
