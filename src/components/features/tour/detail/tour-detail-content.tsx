'use client';

import { useState } from 'react';
import { cn } from '@/utils';

import { Tour } from '@/types/tour.type';

import { TourDetailOverview } from './tour-detail-overview';
import { TourDetailReviews } from './tour-detail-reviews';

interface TourDetailContentProps {
  tour: Tour;
}

const TABS = ['Overview', 'Reviews'] as const;
type Tab = (typeof TABS)[number];

interface IncludedExcludedItem {
  type: 'included' | 'excluded';
  text: string;
}

interface TripPlanDay {
  day: number;
  content: string;
}

const INCLUDED_EXCLUDED: IncludedExcludedItem[] = [
  { type: 'included', text: 'Flight Ticket & Cab Transportation' },
  { type: 'excluded', text: 'Sight-seen' },
  { type: 'included', text: 'Breakfast - Lunch - Dinner' },
  { type: 'included', text: 'Hotel Accommodation' },
  { type: 'included', text: 'Professional Tour Guide' },
  { type: 'included', text: 'Transfer Between Destinations' },
  { type: 'included', text: 'How to use premade UI kits' },
  { type: 'excluded', text: 'City Tour' },
  { type: 'excluded', text: 'Custom Duty' },
];

const TRIP_PLAN: TripPlanDay[] = [
  {
    day: 1,
    content:
      "Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.",
  },
  {
    day: 2,
    content:
      "Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.",
  },
  {
    day: 3,
    content:
      "Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.",
  },
  {
    day: 4,
    content:
      "Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.",
  },
  {
    day: 5,
    content:
      "Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.",
  },
];

export function TourDetailContent({ tour }: TourDetailContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="relative mb-[30px] border-b border-[rgba(166,170,172,0.2)] pb-3">
        <div className="flex gap-[30px]">
          {TABS.map(tab => (
            <button
              key={tab}
              className={cn('text-xl transition-colors duration-300 hover:text-primary', {
                'text-primary': activeTab === tab,
              })}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div
          className={cn('absolute bottom-0 left-0 h-[3px] w-[84px] bg-primary transition-transform duration-300', {
            'translate-x-[0px]': activeTab === 'Overview',
            'w-[72px] translate-x-[112px]': activeTab === 'Reviews',
          })}
        />
      </div>

      {/* Content */}
      {activeTab === 'Overview' ? <TourDetailOverview tour={tour} /> : <TourDetailReviews tour={tour} />}
    </div>
  );
}
