import { useState } from 'react';
import Link from 'next/link';
import { RouteConstant } from '@/constants/route';
import { MOCK_TOURS } from '@/data/tours';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import TitleSection from '../title-section';
import TabsList from './tabs-list';
import TourList from './tour-list';

const TourSection = () => {
  const [activeTab, setActiveTab] = useState<string>('popular');

  const tourTabs = [
    {
      id: 'popular',
      label: 'Phổ biến',
    },
    {
      id: 'special',
      label: 'Đặc sắc',
    },
    {
      id: 'cheap',
      label: 'Giá tốt',
    },
    {
      id: 'recommended',
      label: 'Được đề xuất',
    },
  ];

  return (
    <section className="flex flex-col items-center gap-6">
      <TitleSection title="🏝️ Best Place For Holiday" description="Best Place For Holiday 🏝️" />
      <TabsList tabs={tourTabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <TourList tours={MOCK_TOURS.slice(0, 12)} activeTab={activeTab} />
      <Button asChild>
        <Link href={`${RouteConstant.article}`}>
          Xem thêm
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  );
};

export default TourSection;
