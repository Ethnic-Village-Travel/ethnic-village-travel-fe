'use client';

import { CircleCheck, CircleMinus } from 'lucide-react';

import { Tour } from '@/types/tour.type';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface TourDetailOverviewProps {
  tour: Tour;
}

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

export function TourDetailOverview({ tour }: TourDetailOverviewProps) {
  return (
    <div className="flex flex-col gap-[30px]">
      {/* Trip Overview */}
      <div className="flex flex-col gap-[20px]">
        <h3 className="text-[20px] font-bold">Trip Overview</h3>
        <p className="text-[16px]">
          t is a long established fact that a reader will be distracted by the readable content of a page when looking
          at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
          opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing
          packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
          will uncover many web sites still in their infancy.
          <br />
          <br />
          Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and
          the like).
        </p>
        <div className="h-[1px] w-full bg-gray-20" />
      </div>

      {/* Included/Excluded */}
      <div className="flex flex-col gap-[20px]">
        <h3 className="text-[20px] font-bold">Included/Excluded</h3>
        <div className="grid grid-cols-2 gap-x-[30px]">
          <div className="space-y-[10px]">
            {INCLUDED_EXCLUDED.filter(item => item.type === 'included').map((item, index) => (
              <div key={index} className="flex items-center gap-[10px]">
                <CircleCheck className="size-[24px] text-primary" />
                <span className="text-[16px]">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="space-y-[10px]">
            {INCLUDED_EXCLUDED.filter(item => item.type === 'excluded').map((item, index) => (
              <div key={index} className="flex items-center gap-[10px]">
                <CircleMinus className="size-[24px] text-secondary-500" />
                <span className="text-[16px]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[1px] w-full bg-gray-20" />
      </div>

      {/* Trip Plan */}
      <div className="flex flex-col gap-[20px]">
        <h3 className="text-[20px] font-bold">Trip Plan</h3>
        <Accordion type="single" collapsible defaultValue="day-1" className="w-full">
          {TRIP_PLAN.map(day => (
            <AccordionItem
              key={day.day}
              value={`day-${day.day}`}
              className="border-b border-gray-20 py-[10px] last:border-0"
            >
              <AccordionTrigger className="flex items-center justify-between py-0 hover:no-underline [&[data-state=open]>div>img]:rotate-180">
                <h4 className="text-[18px] font-bold">Day {day.day}</h4>
              </AccordionTrigger>
              <AccordionContent className="pt-[10px]">
                <p className="text-[16px]">{day.content}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
