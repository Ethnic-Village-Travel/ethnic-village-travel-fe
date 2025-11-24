'use client';

import { useTranslations } from 'next-intl';

import { useQueryConfig } from '@/hooks/use-query-config';
import ArticleSection from '@/components/features/home/article-section';
import { HeroSection } from '@/components/features/home/hero-section';
import ReasonSection from '@/components/features/home/reason-section';
import TourSection from '@/components/features/home/tour-section';

export function HomePageContent() {
  const t = useTranslations('home');
  const queryConfig = useQueryConfig();

  return (
    <div className="flex w-full flex-col gap-6">
      <HeroSection />

      <TourSection />

      <ArticleSection />

      <ReasonSection />

      {/* <PaginationClient queryConfig={queryConfig} pageSize={20} showFirstLast /> */}
    </div>
  );
}
