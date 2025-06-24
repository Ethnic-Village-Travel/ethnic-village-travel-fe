'use client';

import Image from 'next/image';
import Link from 'next/link';
import { EntityType } from '@/constants/entity';
import { RouteConstant } from '@/constants/route';
import { cn } from '@/utils';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BookmarkButton } from '@/components/shared/bookmark-button';

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
  id,
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
  isBookmarked = false,
}: ArticleItemProps) => {
  const isHorizontal = layout === 'horizontal';

  return (
    <Link href={`${RouteConstant.article_detail.replace(':slug', slug)}`} className="block w-full">
      <Card
        className={cn(
          'h-full w-full overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md',
          {
            'flex flex-col md:flex-row': isHorizontal,
          },
          className,
        )}
      >
        <div
          className={cn('relative h-[154px] w-full', {
            'flex-shrink-0 md:h-auto md:w-[150px]': isHorizontal,
          })}
        >
          <Image src={thumbnailUrl} alt={title} fill style={{ objectFit: 'cover' }} priority />
        </div>
        <CardContent
          className={cn('flex flex-col gap-3 p-4', {
            'flex-grow gap-0 p-5': isHorizontal,
          })}
        >
          <div>
            {tags && tags.length > 0 && (
              <div
                className={cn('mb-2 flex flex-wrap gap-1', {
                  'h-[44px]': !isHorizontal,
                })}
              >
                {tags.map(tag => (
                  <Badge key={tag} autoVariant shape="rounded" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <h3
              className={cn('line-clamp-2 text-base font-bold text-dark', {
                'mb-2 line-clamp-2 text-xl md:line-clamp-1 md:text-2xl': isHorizontal,
              })}
            >
              {title}
            </h3>
            {isHorizontal && description && <p className="mb-3 mt-2 line-clamp-3 text-gray-600">{description}</p>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-dark">{author}</span>
              <span className="text-gray-500">·</span>
              <span className="text-sm text-gray-500">{readTime} phút đọc</span>
              {isHorizontal && date && (
                <>
                  <span className="text-gray-500">·</span>
                  <span className="text-sm text-gray-500">{date}</span>
                </>
              )}
            </div>
            <BookmarkButton entityId={id.toString()} entityType={EntityType.ARTICLE} isBookmarked={isBookmarked} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArticleItem;
