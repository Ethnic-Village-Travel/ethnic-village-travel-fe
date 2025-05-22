'use client';

import { FilterCardGroup, PriceFilterCard } from '@/components/features/filter-card';

const FILTERS = [
  {
    title: 'Địa điểm',
    items: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế', 'Sapa', 'Hội An', 'Nha Trang', 'Phú Quốc'],
    maxVisible: 5,
  },
  {
    title: 'Dân tộc',
    items: ['Kinh', 'Tày', 'Thái', 'Mường', 'Hmong', 'Dao', 'Khmer', 'Nùng'],
    maxVisible: 5,
  },
  {
    title: 'Thời gian',
    items: ['1 ngày', '2 ngày', '3 ngày', '4 ngày', '5 ngày', '6 ngày', '7 ngày'],
    maxVisible: 5,
  },
  {
    title: 'Giá',
    items: ['< 1 triệu', '1-3 triệu', '3-5 triệu', '5-10 triệu', '> 10 triệu'],
    maxVisible: 5,
  },
];

export default function TourList() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl font-bold">Tour Page</h1>
      <FilterCardGroup filters={FILTERS} />
      <PriceFilterCard />
      <div className="mt-8">
        <p className="text-lg">Welcome to the Tour Page!</p>
      </div>
    </div>
  );
}
