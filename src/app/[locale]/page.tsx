'use client';

import { useTranslations } from 'next-intl';

import { useQueryConfig } from '@/hooks/use-query-config';
import ArticleSection from '@/components/features/home/article-section';
import { HeroSection } from '@/components/features/home/hero-section';
import ReasonSection from '@/components/features/home/reason-section';
import TourSection from '@/components/features/home/tour-section';

export default function HomePage() {
  const t = useTranslations('home');
  const queryConfig = useQueryConfig();

  return (
    <div className="flex w-full flex-col gap-6">
      <HeroSection />

      <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 md:px-8 lg:px-16 xl:px-28">
        <TourSection />

        <ArticleSection />

        <ReasonSection />
      </div>

      {/* <PaginationClient queryConfig={queryConfig} pageSize={20} showFirstLast /> */}
    </div>
  );
}
