'use client';

import { MOCK_ARTICLES } from '@/data/articles';

import ArticleItem from '@/components/features/article/article-item';

export default function ArticlesPage() {
  return (
    <>
      <section className="mb-12">
        <h2 className="mb-8 text-2xl font-bold">Bài viết đáng chú ý</h2>
        <div className="space-y-6">
          {MOCK_ARTICLES.map(article => (
            <ArticleItem key={article.id} {...article} layout="horizontal" className="max-w-full" />
          ))}
        </div>
      </section>
    </>
  );
}
