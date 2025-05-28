import { useState } from 'react';
import { cn } from '@/utils';
import { Star } from 'lucide-react';

import { Review } from '@/types/review.type';
import { useAuthentication } from '@/hooks/use-authentication';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AddReviewCardProps {
  review?: Review;
  onSubmit: (data: { rating: number; content: string }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function AddReviewCard({ review, onSubmit, onCancel, isLoading }: AddReviewCardProps) {
  const { isAuthenticated, user } = useAuthentication();
  const [rating, setRating] = useState(review?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState(review?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, content });
    // Reset form
    setRating(0);
    setContent('');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-gray-500">Vui lòng đăng nhập để đánh giá</p>
        <Button>Đăng nhập</Button>
      </div>
    );
  }

  const renderUser = () => {
    let curUser = {
      id: review?.user.id || user?.id,
      name: review?.user.name || user?.name,
      avatar: review?.user.avatar || user?.avatar,
    };

    return (
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
          {curUser.avatar && <img src={curUser.avatar} alt={curUser.name} className="object-cover" />}
        </div>
        <span className="font-semibold">{curUser.name}</span>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* User info */}
      {renderUser()}

      {/* Rating */}
      <div className="flex flex-col gap-1">
        <span className="text-sm text-gray-500">Đánh giá của bạn</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className={cn('rounded-md p-1 hover:bg-gray-100')}
            >
              <Star
                size={24}
                className={cn(
                  'transition-colors',
                  (hoveredRating ? value <= hoveredRating : value <= rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300',
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Nhận xét của bạn</span>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn..."
          className="focus-visible:ring-none focus-visible:ring-0"
          rows={4}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        {review && (
          <Button variant="outline" type="button" onClick={onCancel}>
            Hủy
          </Button>
        )}

        <Button type="submit" disabled={rating === 0 || isLoading}>
          Gửi đánh giá
        </Button>
      </div>
    </form>
  );
}
