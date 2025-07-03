'use client';

import { useEffect, useRef, useState } from 'react';
import { useBookingStore } from '@/store/useBookingStore';
import { cn } from '@/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDraggable } from 'react-use-draggable-scroll';

import { Tour } from '@/types/tour.type';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AvailableTicketsProps {
  tour: Tour;
}

const AvailableTickets = ({ tour }: AvailableTicketsProps) => {
  const t = useTranslations('tour.detail.available_tickets');
  const scrollRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const { events } = useDraggable(scrollRef);

  const { selectedDateId, setSelectedDate } = useBookingStore();
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  // Calculate booked slots from bookedPersonCounts
  const calculateBookedSlots = (bookedPersonCounts: { adult: number; child: number }[]) => {
    if (!bookedPersonCounts || bookedPersonCounts.length === 0) return 0;
    return bookedPersonCounts.reduce((total, booking) => {
      return total + (booking.adult || 0) + (booking.child || 0);
    }, 0);
  };

  useEffect(() => {
    // Select first available date by default
    if (tour?.availableDates && tour?.availableDates.length > 0) {
      const firstAvailableDate = tour.availableDates.find(date => {
        const bookedSlots = calculateBookedSlots(date.bookedPersonCounts);
        return bookedSlots < date.maxSlots;
      });
      if (firstAvailableDate) {
        const bookedSlots = calculateBookedSlots(firstAvailableDate.bookedPersonCounts);
        setSelectedDate(firstAvailableDate.id, firstAvailableDate.maxSlots - bookedSlots);
      }
    }
  }, [tour?.availableDates, setSelectedDate]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();

      return () => {
        scrollElement.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  const handleDateClick = (dateId: number, availableSlots: number) => {
    setSelectedDate(dateId, availableSlots);
  };

  return (
    <Card className="mt-2.5 p-6 px-5 shadow-custom-gray">
      <h2 className="mb-4 text-xl font-bold">{t('title')}</h2>
      <div className="relative">
        {showLeftButton && (
          <Button
            variant="outline"
            size="icon"
            className="hover:border-primary-500/80 absolute left-[-36px] top-1/2 h-9 w-9 -translate-y-1/2 border-primary-500 [&_svg]:size-4"
            onClick={() => handleScroll('left')}
          >
            <ChevronLeft className="text-primary-500" />
          </Button>
        )}
        <div ref={scrollRef} {...events} className="custom-scrollbar flex gap-3">
          {tour?.availableDates?.map(date => {
            const startDate = new Date(date.startDate);
            const isSpecial = false;
            const bookedSlots = calculateBookedSlots(date.bookedPersonCounts);
            const availableSlots = date.maxSlots - bookedSlots;

            return (
              <Button
                key={date.id}
                variant={selectedDateId === date.id ? 'default' : 'outline'}
                onClick={() => handleDateClick(date.id, availableSlots)}
                className={cn(
                  'flex h-auto min-w-[120px] flex-col items-center gap-1 border-gray-500 px-4 py-2 transition-all duration-200',
                  {
                    'border-secondary-600 text-secondary-600': isSpecial,
                    'hover:bg-primary-500/90 bg-primary-500 text-white': selectedDateId === date.id,
                  },
                )}
              >
                <span
                  className={cn('text-lg', {
                    'text-[#FF9665]': isSpecial,
                    'text-white': selectedDateId === date.id,
                  })}
                >
                  {isSpecial ? '🔥 ' : ''}
                  {format(startDate, 'EEEE', { locale: vi })}
                </span>
                <span className="text-xl font-bold">{format(startDate, 'dd/MM', { locale: vi })}</span>
                <span
                  className={cn('text-sm font-bold', {
                    'text-white': selectedDateId === date.id,
                  })}
                >
                  {availableSlots > 0 ? t('available_slots', { count: availableSlots }) : t('no_slots')}
                </span>
                {isSpecial && (
                  <span
                    className={cn('text-sm font-bold text-[#FF9665]', {
                      'text-white': selectedDateId === date.id,
                    })}
                  >
                    {t('special_price')}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
        {showRightButton && (
          <Button
            variant="outline"
            size="icon"
            className="hover:border-primary-500/80 absolute right-[-36px] top-1/2 h-9 w-9 -translate-y-1/2 border-primary-500 [&_svg]:size-4"
            onClick={() => handleScroll('right')}
          >
            <ChevronRight className="text-primary-500" />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AvailableTickets;
