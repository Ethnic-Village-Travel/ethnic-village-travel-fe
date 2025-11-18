'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TabType } from '@/apis/tour.api';
import { RouteConstant } from '@/constants/route';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useFilteredTours } from '@/hooks/api/useTour';
import { Button } from '@/components/ui/button';

import TitleSection from '../title-section';
import TabsList from './tabs-list';
import TourList from './tour-list';

const tourTabs = [
  {
    id: 'popular' as TabType,
    label: 'popular',
  },
  {
    id: 'outstanding' as TabType,
    label: 'outstanding',
  },
  {
    id: 'best_price' as TabType,
    label: 'best_price',
  },
];

const TourSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>('popular');
  const t = useTranslations('common');
  const { data: tourData, isLoading, isError } = useFilteredTours(activeTab);

  const tours = tourData?.data || [];

  return (
    <section className="flex flex-col items-center gap-6">
      <TitleSection title="🏝️ Best Place For Holiday" description="Best Place For Holiday 🏝️" />
      <TabsList tabs={tourTabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <TourList tours={tours} isLoading={isLoading} isError={isError} />
      <Button asChild>
        <Link href={`${RouteConstant.tour}`}>
          {t('view_more')}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  );
};

export default TourSection;
