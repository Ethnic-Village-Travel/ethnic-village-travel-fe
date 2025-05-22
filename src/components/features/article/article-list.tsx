'use client';

import ArticleItem, { ArticleItemProps } from './article-item';

interface ArticleListProps {
  articles: ArticleItemProps[];
  variant?: 'vertical' | 'horizontal';
  className?: string;
}

const ArticleList = ({ articles, variant = 'vertical', className }: ArticleListProps) => {
  if (variant === 'horizontal') {
    return (
      <div className={`flex flex-col space-y-6 ${className || ''}`}>
        {articles.map(article => (
          <ArticleItem key={article.id} {...article} variant="horizontal" className="w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className || ''}`}>
      {articles.map(article => (
        <ArticleItem key={article.id} {...article} variant="vertical" />
      ))}
    </div>
  );
};

export default ArticleList;
