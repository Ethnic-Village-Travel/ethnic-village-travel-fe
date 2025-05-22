'use client';

import { cn } from '@/utils';

import ArticleItem, { ArticleItemProps } from '../../article/article-item';

interface ArticleListProps {
  articles: ArticleItemProps[];
  className?: string;
}

const ArticleList = ({ articles, className }: ArticleListProps) => {
  return (
    <div
      className={cn(
        `grid grid-cols-1 items-stretch justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`,
        className,
      )}
    >
      {articles.map(article => (
        <ArticleItem key={article.id} {...article} />
      ))}
    </div>
  );
};

export default ArticleList;
