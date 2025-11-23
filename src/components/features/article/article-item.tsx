'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RouteConstant } from '@/core/constants/route';
import { cn } from '@/utils';
import dayjs from 'dayjs';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface ArticleItemProps {
  id: number;
  title: string;
  author: string;
  readTime: number;
  thumbnailUrl?: string;
  slug: string;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  description?: string;
  date?: string;
  tags?: string[];
  isBookmarked?: boolean;
}

const ArticleItem = ({
  title,
  author,
  readTime,
  thumbnailUrl = '/images/blog-card-thumbnail.png',
  slug,
  className,
  layout = 'vertical',
  description,
  date,
  tags,
}: ArticleItemProps) => {
  const isHorizontal = layout === 'horizontal';
  const formattedDate = date ? dayjs(date).format('DD/MM/YYYY') : null;

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
            src={thumbnailUrl}
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
            <div className="mb-3 flex h-7 flex-wrap gap-1.5">
              {tags.slice(0, 3).map(tag => (
                <Badge key={tag} autoVariant shape="rounded" size="sm">
                  {tag}
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

          {/* Description - Only for horizontal */}
          {isHorizontal && description && <p className="mb-3 line-clamp-2 text-sm text-gray-600">{description}</p>}
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-dark">{author}</span>
          <span>·</span>
          <span>{readTime} phút đọc</span>
          {formattedDate && (
            <>
              <span>·</span>
              <span>{formattedDate}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleItem;
