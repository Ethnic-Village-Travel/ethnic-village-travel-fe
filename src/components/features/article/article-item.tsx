'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RouteConstant } from '@/core/constants/route';
import { cn } from '@/utils';
import dayjs from 'dayjs';
import { ArrowBigUp, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Article } from '@/types/article.type';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface ArticleItemProps extends Omit<Article, 'content' | 'id'> {
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

const ArticleItem = ({
  title,
  slug,
  summary,
  imageUrl,
  upvote,
  views,
  publishedDate,
  tags,
  className,
  layout = 'horizontal',
}: ArticleItemProps) => {
  const t = useTranslations('article.item');
  const isHorizontal = layout === 'horizontal';
  const formattedDate = publishedDate ? dayjs(publishedDate).format('DD/MM/YYYY') : null;
  const readTime = Math.ceil((summary?.length || 0) / 200); // Estimate read time: 200 words/minute

  return (
    <Card
      className={cn(
        'group relative flex h-full w-full overflow-hidden transition-all duration-300 hover:shadow-lg',
        {
          'flex-row': isHorizontal,
          'flex-col': !isHorizontal,
        },
        className,
      )}
    >
      {/* Image Section */}
      <Link
        href={`${RouteConstant.article_detail.replace(':slug', slug)}`}
        className={cn('relative shrink-0 overflow-hidden', {
          'w-80': isHorizontal,
          'w-full': !isHorizontal,
        })}
      >
        <div
          className={cn('relative overflow-hidden', {
            'h-full min-h-[220px]': isHorizontal,
            'aspect-[4/3]': !isHorizontal,
          })}
        >
          <Image
            src={imageUrl || '/images/blog-card-thumbnail.png'}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
          />
        </div>
      </Link>

      {/* Content Section */}
      <CardContent className="flex flex-1 flex-col p-5">
        {/* Published Date */}
        {formattedDate && (
          <div className="mb-2 text-sm text-gray-500">{t('published_on', { date: formattedDate })}</div>
        )}

        {/* Title */}
        <Link href={`${RouteConstant.article_detail.replace(':slug', slug)}`} className="mb-3">
          <h3 className="line-clamp-2 text-xl font-bold transition-colors hover:text-primary">{title}</h3>
        </Link>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <Badge
                key={tag.id}
                shape="rounded"
                size="sm"
                style={{
                  backgroundColor: tag.color || '#6B7280',
                  color: '#FFFFFF',
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Summary */}
        {summary && <p className="mb-auto line-clamp-3 text-sm text-gray-600">{summary}</p>}

        {/* Meta Info */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{t('views', { count: views || 0 })}</span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowBigUp className="h-5 w-5" fill="currentColor" />
              <span>{t('upvotes', { count: upvote || 0 })}</span>
            </div>
          </div>
          <div>
            <span>{t('read_time', { minutes: readTime })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleItem;
