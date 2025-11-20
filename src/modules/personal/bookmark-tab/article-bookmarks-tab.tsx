'use client';

import { memo, useMemo } from 'react';
import { MOCK_ARTICLES } from '@/data/mock/articles';
import ArticleItem from '@/modules/article/article-item';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Bookmark } from '@/types/bookmark.type';
import { Button } from '@/components/ui/button';

interface ArticleBookmarksTabProps {
  bookmarks?: Bookmark[];
  visibleItems: number;
  onLoadMore: () => void;
}

function ArticleBookmarksTab({ bookmarks, visibleItems, onLoadMore }: ArticleBookmarksTabProps) {
  const t = useTranslations('personal.bookmark');

  // Note: Using mock data for now since article API is not implemented
  const articles = useMemo(() => MOCK_ARTICLES.slice(0, visibleItems), [visibleItems]);

  const hasMoreItems = visibleItems < (bookmarks?.length || 0);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {articles.map(article => (
          <ArticleItem key={article.id} {...article} layout="horizontal" />
        ))}
      </div>
      {hasMoreItems && (
        <div className="mt-8 flex justify-center">
          <Button onClick={onLoadMore} variant="outline" className="gap-2 px-8">
            {t('view_more')}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default memo(ArticleBookmarksTab);
