'use client';

import { useState } from 'react';
import { MOCK_ARTICLES } from '@/data/articles';
import { MOCK_TOURS } from '@/data/tours';
import { cn } from '@/utils';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ArticleItem from '@/components/features/article/article-item';
import { TourItem } from '@/components/features/tour';

const ITEMS_PER_PAGE = 3;

export default function BookmarkTabContent() {
  const [visibleTours, setVisibleTours] = useState(ITEMS_PER_PAGE);
  const [visibleArticles, setVisibleArticles] = useState(ITEMS_PER_PAGE);

  // Mock bookmarked items - this would come from an API in reality
  const bookmarkedTours = MOCK_TOURS.slice(0, 8); // Mock 8 bookmarked tours
  const bookmarkedArticles = MOCK_ARTICLES.slice(0, 6); // Mock 6 bookmarked articles

  const handleLoadMoreTours = () => {
    setVisibleTours(prev => prev + ITEMS_PER_PAGE);
  };

  const handleLoadMoreArticles = () => {
    setVisibleArticles(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="flex flex-col items-start gap-10 px-4">
      {/* Tours Section */}
      <section className="w-full">
        <h2 className="mb-6 text-2xl font-bold">Tours Đã Lưu</h2>
        <div className="flex flex-col gap-3">
          {bookmarkedTours.slice(0, visibleTours).map(tour => (
            <TourItem key={tour.id} tour={tour} layout="horizontal" />
          ))}
        </div>
        {visibleTours < bookmarkedTours.length && (
          <div className="mt-8 flex justify-center">
            <Button onClick={handleLoadMoreTours} variant="outline" className="gap-2 px-8">
              Xem thêm
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </section>

      {/* Articles Section */}
      <section className="w-full">
        <h2 className="mb-6 text-2xl font-bold">Bài Viết Đã Lưu</h2>
        <div className="flex flex-col gap-3">
          {bookmarkedArticles.slice(0, visibleArticles).map(article => (
            <ArticleItem key={article.id} {...article} layout="horizontal" />
          ))}
        </div>
        {visibleArticles < bookmarkedArticles.length && (
          <div className="mt-8 flex justify-center">
            <Button onClick={handleLoadMoreArticles} variant="outline" className="gap-2 px-8">
              Xem thêm
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
