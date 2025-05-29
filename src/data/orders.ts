import { Order } from '@/types/order';

export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-10-05'),
    code: 'explore-the-beauty-of-bali',
    adultCount: 3,
    childrenCount: 2,
  },
  {
    id: 2,
    startDate: new Date('2023-11-15'),
    endDate: new Date('2023-11-20'),
    code: 'adventure-in-the-alps',
    adultCount: 3,
    childrenCount: 2,
  },
  {
    id: 3,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-15'),
    code: 'cultural-tour-of-japan',
    adultCount: 3,
    childrenCount: 2,
  },
];
