import { notFound } from 'next/navigation';
import { API, API_ROOT } from '@/core/api';
import { cn } from '@/utils';

import { ApiResponse } from '@/types/api.type';
import { Article, ArticleListResponse } from '@/types/article.type';
import ArticleDetailPageContent from '@/components/features/article/article-detail';

type ArticleDetailPageProps = {
  params: { slug: string; locale: string };
}

async function fetchArticleDetail(slug: string): Promise<Article | null> {
  const searchParams = new URLSearchParams({
    page: '0',
    size: '100',
  });

  const url = `${API_ROOT}/api/v1${API.POST.GET_ALL}?${searchParams.toString()}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const json = (await res.json()) as ApiResponse<ArticleListResponse>;
  const list = json.data?.content ?? [];

  const found: any = list.find(article => article.slug === slug);

  if (!found) {
    return null;
  }

  return {
    ...found,
    publishedDate: found.publishedDate || found.published_date || null,
  } as Article;
}

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { slug } = params;

  const article = await fetchArticleDetail(slug);

  if (!article) {
    return {};
  }

  const title = article.title || 'Article';
  const description = article.summary || '';
  const imageUrl = article.imageUrl;
  const url = `${API.POST.GET_ALL}/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl, alt: title }] : [],
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = params;

  const article = await fetchArticleDetail(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className={cn('min-h-screen bg-background', 'px-0 pb-0 pt-10')}>
      <div className="mx-auto w-full max-w-4xl">
        <ArticleDetailPageContent article={article} />
      </div>
    </main>
  );
}
