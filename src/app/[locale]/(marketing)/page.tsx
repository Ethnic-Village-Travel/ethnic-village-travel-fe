'use client';

import ArticleSection from '@/modules/home/article-section';
import { HeroSection } from '@/modules/home/hero-section';
import ReasonSection from '@/modules/home/reason-section';
import TourSection from '@/modules/home/tour-section';
import { useTranslations } from 'next-intl';

import { useQueryConfig } from '@/hooks/use-query-config';

export default function HomePage() {
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
