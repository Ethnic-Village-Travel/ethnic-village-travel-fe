import { cn } from '@/utils';
import { BookmarkIcon } from 'lucide-react';

import { Bookmark as BookmarkButtonProps } from '@/types/bookmark.type';
import { useGetBookmarkStatus, useToggleBookmark } from '@/hooks/api/useBookmark';
import { useAuthentication } from '@/hooks/use-authentication';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

import { Button } from '../ui/button';

export default function BookmarkButton({ entityId, entityType }: BookmarkButtonProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuthentication();
  const { data: isBookmarked, isLoading: isLoadingStatus } = useGetBookmarkStatus({
    entityId: entityId,
    entityType: entityType,
  });
  const { mutate: toggleBookmark, isPending } = useToggleBookmark();

  const handleToggleBookmark = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để lưu tour',
        variant: 'destructive',
        className: 'right-4 top-0',
        action: (
          <ToastAction altText="Đăng nhập" className="font-semibold">
            Đăng nhập
          </ToastAction>
        ),
      });
      return;
    }

    toggleBookmark(
      {
        entityId: entityId,
        entityType: entityType,
      },
      {
        onSuccess: () => {
          toast({
            title: isBookmarked ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích',
            description: isBookmarked
              ? 'Tour đã được xóa khỏi danh sách yêu thích'
              : 'Tour đã được thêm vào danh sách yêu thích',
          });
        },
        onError: () => {
          toast({
            title: 'Lỗi',
            description: 'Không thể cập nhật trạng thái yêu thích. Vui lòng thử lại.',
            variant: 'destructive',
          });
        },
      },
    );
  };

  const isDisabled = isPending;
  const isLoading = isLoadingStatus || isPending;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'h-8 w-8 rounded-full p-0',
        isBookmarked ? 'text-primary-500' : 'text-gray-500',
        'hover:bg-primary-20 hover:text-primary-500',
        isDisabled && 'cursor-not-allowed opacity-50',
      )}
      onClick={handleToggleBookmark}
      disabled={isDisabled}
    >
      <BookmarkIcon className={cn('h-4 w-4', isLoading && 'animate-pulse')} />
    </Button>
  );
}
