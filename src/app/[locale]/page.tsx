'use client';

import { useTranslations } from 'next-intl';

import { useQueryConfig } from '@/hooks/use-query-config';
import ArticleSection from '@/components/features/home/article-section';
import ReasonSection from '@/components/features/home/reason-section';
import TourSection from '@/components/features/home/tour-section';

export default function HomePage() {
  const t = useTranslations('home');
  const queryConfig = useQueryConfig();

  return (
    <div className="flex w-full flex-col gap-12">
      <TourSection />

      <ArticleSection />

      <ReasonSection />

      {/* <PaginationClient queryConfig={queryConfig} pageSize={20} showFirstLast /> */}
    </div>
  );
}
