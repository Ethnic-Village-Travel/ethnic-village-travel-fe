import { useState } from 'react';
import { cn } from '@/utils';
import { formatTimeAgo } from '@/utils/number';
import { MoreHorizontal, PinIcon, Trash2Icon } from 'lucide-react';

import { Review } from '@/types/review.type';
import { useAuthentication } from '@/hooks/use-authentication';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AddReviewCard } from '../features/tour/detail/add-review-card';
import StarRating from './star-rating';

interface ReviewItemProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
  onPin?: (review: Review) => void;
  onReport?: (review: Review) => void;
}

export function ReviewItem({ review, onEdit, onDelete, onPin, onReport }: ReviewItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { user: currentUser } = useAuthentication();
  const isOwner = currentUser?.id === review.user.id;

  const handleSubmit = ({ rating, content }: { rating: number; content: string }) => {
    const newReview = {
      ...review,
      rating,
      content,
    };

    onEdit?.(newReview);

    console.log('====================================');
    console.log(newReview);
    console.log('====================================');

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl border px-6 py-4',
        review.isPinned && 'border-primary-500 bg-primary-5',
      )}
    >
      {isEditing ? (
        <AddReviewCard review={review} onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative h-full w-10 overflow-hidden rounded-full bg-gray-100">
                {review.user.avatar && <img src={review.user.avatar} alt={review.user.name} className="object-cover" />}
              </div>

              {/* User info */}
              <div className="flex flex-col">
                <h4 className="font-semibold">{review.user.name}</h4>
                <StarRating average={review.rating} />
              </div>
            </div>

            {/* Actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {isOwner && (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(true)} className="gap-2">
                      <PinIcon className="h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete?.(review)}
                      className="gap-2 text-destructive hover:text-destructive focus:text-destructive"
                    >
                      <Trash2Icon className="h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {currentUser?.id && (
                  <>
                    <DropdownMenuItem onClick={() => onPin?.(review)} className="gap-2">
                      <PinIcon className="h-4 w-4" />
                      {review.isPinned ? 'Bỏ ghim' : 'Ghim'}
                    </DropdownMenuItem>
                    {!isOwner && (
                      <DropdownMenuItem onClick={() => onReport?.(review)} className="gap-2 text-destructive">
                        <Trash2Icon className="h-4 w-4" />
                        Báo cáo
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Review content */}
          <p className="text-gray-600">{review.content}</p>

          {/* Review metadata */}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            {review.isPinned && (
              <>
                <PinIcon className="h-4 w-4" />
                <span>Đã ghim</span>
                <span>•</span>
              </>
            )}
            <span className="capitalize">{formatTimeAgo(review.createdAt)}</span>
            {review.updatedAt > review.createdAt && (
              <>
                <span>•</span>
                <span>Đã chỉnh sửa</span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
