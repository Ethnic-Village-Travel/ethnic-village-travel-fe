'use client';

import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { Link } from '@/lib/i18n-navigation';
import { useQueryConfig } from '@/hooks/useQueryConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TourItem, Layout as TourLayout } from '@/components/features/tour';
import FormDemo from '@/components/shared/form-demo';
import PaginationClient from '@/components/shared/pagination-client';

const TOUR: Tour = {
  id: 1,
  image_url: 'https://r2.nucuoimekong.com/wp-content/uploads/cau-trang-tien-1.jpg',
  title: 'Sample Tour Title',
  overview: 'This is a sample tour overview.',
  days: '3 days',
  pick_up_location: 'Sample Location',
  rating: [
    {
      id: 1,
      entity_id: 101,
      entity_type: 'tour',
      user_id: 501,
      rating: 5,
      content: 'Trải nghiệm tuyệt vời!',
      created_at: '2025-05-20T10:00:00Z',
      updated_at: '2025-05-20T10:00:00Z',
    },
    {
      id: 2,
      entity_id: 101,
      entity_type: 'tour',
      user_id: 502,
      rating: 4,
      content: 'Hướng dẫn viên nhiệt tình.',
      created_at: '2025-05-18T14:32:00Z',
      updated_at: '2025-05-18T14:32:00Z',
    },
    {
      id: 3,
      entity_id: 102,
      entity_type: 'tour',
      user_id: 503,
      rating: 4.5,
      content: 'Địa điểm đẹp nhưng hơi đông.',
      created_at: '2025-05-15T08:21:00Z',
      updated_at: '2025-05-15T08:21:00Z',
    },
  ],
  promotions: [
    {
      id: 1,
      name: 'Giảm giá 20% cho khách hàng mới',
      description: 'Đăng ký ngay để nhận ưu đãi.',
      discount_percent: 20,
      max_discount_amount: 500000,
      type: 'discount',
      start_date: '2025-06-01',
      end_date: '2025-06-30',
    },
    // {
    //   id: 2,
    //   name: 'Mua 2 tặng 1',
    //   description: 'Mua 2 tour bất kỳ, tặng 1 tour miễn phí.',
    //   discount_percent: 20,
    //   max_discount_amount: 500000,
    //   type: 'code',
    //   start_date: '2025-07-01',
    //   end_date: '2025-07-31',
    // },
  ],
  price: 150000,
};

export default function HomePage() {
  const t = useTranslations('home');
  const queryConfig = useQueryConfig();

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <Link href="/about" className="text-primary hover:underline">
        {t('about')}
      </Link>
      <TourItem tour={TOUR} layout={TourLayout.VERTICAL}></TourItem>
      <Card>
        <CardHeader>
          <CardTitle>Feature Card</CardTitle>
          <CardDescription>Card description with muted foreground color</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="bg-pri text-sm">
            This card demonstrates the card background and foreground colors, with content showing regular text.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </CardFooter>
      </Card>
      <FormDemo />
      <PaginationClient queryConfig={queryConfig} pageSize={20} showFirstLast />
    </div>
  );
}
