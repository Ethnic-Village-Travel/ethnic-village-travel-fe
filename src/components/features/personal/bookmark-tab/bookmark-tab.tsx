'use client';

import { useMemo, useState } from 'react';
import { EntityType } from '@/constants/entity';
import { useUserStore } from '@/store/useUserStore';
import { useTranslations } from 'next-intl';

import { Bookmark } from '@/types/bookmark.type';
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from '@/components/animate-ui/radix/tabs';

import ArticleBookmarksTab from './article-bookmarks-tab';
import TourBookmarksTab from './tour-bookmarks-tab';

const ITEMS_PER_PAGE = 5;

type BookmarkMap = {
  [EntityType.TOUR]: Bookmark[];
  [EntityType.ARTICLE]: Bookmark[];
};

export default function BookmarkTabContent() {
  const t = useTranslations('personal.bookmark');
  const [visibleTourItems, setVisibleTourItems] = useState(ITEMS_PER_PAGE);
  const [visibleArticleItems, setVisibleArticleItems] = useState(ITEMS_PER_PAGE);
  const { details } = useUserStore();

  // Sử dụng useMemo thay vì useEffect + useState
  const sortedBookmarks = useMemo(() => {
    if (!details?.bookmarks) {
      return {
        [EntityType.TOUR]: [],
        [EntityType.ARTICLE]: [],
      };
    }

    // Group and sort bookmarks by entity type
    const bookmarks = details.bookmarks.reduce((acc, bookmark) => {
      if (!acc[bookmark.entityType]) {
        acc[bookmark.entityType] = [];
      }

      acc[bookmark.entityType].push(bookmark);
      return acc;
    }, {} as BookmarkMap) || { [EntityType.TOUR]: [], [EntityType.ARTICLE]: [] };

    // Sort bookmarks by updated date
    Object.keys(bookmarks).forEach(type => {
      bookmarks[type as EntityType].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    });

    return bookmarks;
  }, [details?.bookmarks]);

  const handleLoadMoreTours = () => {
    setVisibleTourItems(prev => prev + ITEMS_PER_PAGE);
  };

  const handleLoadMoreArticles = () => {
    setVisibleArticleItems(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      <Tabs defaultValue="tours" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="tours">{t('saved_tours')}</TabsTrigger>
          <TabsTrigger value="articles">{t('saved_articles')}</TabsTrigger>
        </TabsList>

        <TabsContents>
          <TabsContent value="tours" className="w-full">
            <TourBookmarksTab
              bookmarks={sortedBookmarks[EntityType.TOUR]}
              visibleItems={visibleTourItems}
              onLoadMore={handleLoadMoreTours}
            />
          </TabsContent>

          <TabsContent value="articles" className="w-full">
            <ArticleBookmarksTab
              bookmarks={sortedBookmarks[EntityType.ARTICLE]}
              visibleItems={visibleArticleItems}
              onLoadMore={handleLoadMoreArticles}
            />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
}
