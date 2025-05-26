'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDraggable } from 'react-use-draggable-scroll';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TicketDate {
  id: string;
  day: string;
  date: string;
  isSelected?: boolean;
  isSpecial?: boolean;
  specialText?: string;
}

interface AvailableTicketsProps {
  tickets: TicketDate[];
}

const AvailableTickets = ({ tickets }: AvailableTicketsProps) => {
  const scrollRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const { events } = useDraggable(scrollRef);

  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    const initialSelected = tickets.find(ticket => ticket.isSelected);
    if (initialSelected) {
      setSelectedTicket(initialSelected.id);
    }
  }, [tickets]);

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

  const handleTicketClick = (ticketId: string) => {
    setSelectedTicket(ticketId);
  };

  return (
    <Card className="mt-2.5 p-6 px-5 shadow-[1px_1px_2px_0px_rgba(105,197,249,0.25),-1px_-1px_2px_0px_rgba(105,197,249,0.25)]">
      <h2 className="mb-4 text-xl font-bold">Available Tickets</h2>
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
          {tickets.map(ticket => (
            <Button
              key={ticket.id}
              variant={selectedTicket === ticket.id ? 'default' : 'outline'}
              onClick={() => handleTicketClick(ticket.id)}
              className={cn(
                'flex h-auto min-w-[120px] flex-col items-center gap-1 border-gray-500 px-4 py-2 transition-all duration-200',
                {
                  'border-secondary-600 text-secondary-600': ticket.isSpecial,
                  'hover:bg-primary-500/90 bg-primary-500 text-white': selectedTicket === ticket.id,
                },
              )}
            >
              <span
                className={cn('text-lg', {
                  'text-[#FF9665]': ticket.isSpecial,
                  'text-white': selectedTicket === ticket.id,
                })}
              >
                {ticket.isSpecial ? '🔥 ' : ''}
                {ticket.day}
              </span>
              <span className="text-xl font-bold">{ticket.date}</span>
              {ticket.specialText && (
                <span
                  className={cn('text-sm font-bold', {
                    'text-white': selectedTicket === ticket.id,
                  })}
                >
                  {ticket.specialText}
                </span>
              )}
            </Button>
          ))}
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
