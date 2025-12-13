'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RouteConstant } from '@/core/constants/route';
import { ArticleStatusEnum } from '@/core/enum/article.enum';
import { cn } from '@/utils';
import dayjs from 'dayjs';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';

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
  publishedDate,
  tags,
  className,
  layout = 'vertical',
}: ArticleItemProps) => {
  const isHorizontal = layout === 'horizontal';
  const formattedDate = publishedDate ? dayjs(publishedDate).format('DD/MM/YYYY') : null;
  const readTime = Math.ceil(summary.length / 100); // Estimate read time from summary

  return (
    <Card
      className={cn(
        'group relative flex h-full w-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg',
        {
          'flex-row': isHorizontal,
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
      <CardContent className={cn('flex flex-1 flex-col p-5', isHorizontal ? 'py-4' : '')}>
        <div className="flex flex-1 flex-col">
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mb-3 flex h-6 flex-wrap gap-1.5 overflow-hidden">
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

          {/* Title */}
          <Link href={`${RouteConstant.article_detail.replace(':slug', slug)}`} className="group/title mb-3 block h-14">
            <h3 className="line-clamp-2 text-lg font-bold leading-snug transition-colors group-hover/title:text-primary">
              {title}
            </h3>
          </Link>

          {/* Summary */}
          {summary && <p className="mb-3 line-clamp-2 text-sm text-gray-600">{summary}</p>}
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {formattedDate && <span>{formattedDate}</span>}
          <span>·</span>
          <span>{readTime} phút đọc</span>
          <span>·</span>
          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="flex items-center gap-1">
              <ArrowBigUp className="h-6 w-6" fill="currentColor" />
              <span>{upvote}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleItem;
