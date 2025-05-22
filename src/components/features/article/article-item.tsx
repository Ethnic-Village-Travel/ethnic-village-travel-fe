'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/utils';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface ArticleItemProps {
  id: string;
  title: string;
  author: string;
  readTime: number;
  thumbnailUrl?: string;
  slug: string;
  className?: string;
  variant?: 'vertical' | 'horizontal';
  description?: string;
  date?: string;
  tags?: string[];
}

const ArticleItem = ({
  id,
  title,
  author,
  readTime,
  thumbnailUrl = '/images/blog/blog-card-thumbnail.png',
  slug,
  className,
  variant = 'vertical',
  description,
  date,
  tags,
}: ArticleItemProps) => {
  const isHorizontal = variant === 'horizontal';

  return (
    <Link href={`/article/${slug}`} className="block w-full" passHref>
      <Card
        className={cn(
          'w-full overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md',
          {
            'flex flex-col md:flex-row': isHorizontal,
          },
          className,
        )}
      >
        <div
          className={cn('relative h-[154px] w-full', {
            'h-[200px] flex-shrink-0 md:h-auto md:w-[350px]': isHorizontal,
          })}
        >
          <Image src={thumbnailUrl} alt={title} fill style={{ objectFit: 'cover' }} priority />
        </div>
        <CardContent
          className={cn('flex flex-col gap-3 p-4', {
            'flex-grow p-5': isHorizontal,
          })}
        >
          <div>
            {tags && tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
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
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArticleItem;
