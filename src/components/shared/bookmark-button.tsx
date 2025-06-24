import { EntityType } from '@/constants/entity';
import { cn } from '@/utils/classnames';
import { Bookmark } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useApiBookmarkAdd, useApiBookmarkRemove } from '@/hooks/api/useBookmark';
import { useAuthentication } from '@/hooks/use-authentication';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BookmarkButtonProps {
  entityId: string;
  entityType: EntityType;
  isBookmarked?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'icon' | 'default' | 'sm' | 'lg';
  showText?: boolean;
}

export const BookmarkButton = ({
  entityId,
  entityType,
  isBookmarked = false,
  className,
  variant = 'ghost',
  size = 'icon',
  showText = false,
}: BookmarkButtonProps) => {
  const { mutate: addBookmark, isPending: isAdding } = useApiBookmarkAdd();
  const { mutate: removeBookmark, isPending: isRemoving } = useApiBookmarkRemove();
  const { toast } = useToast();
  const { isAuthenticated } = useAuthentication();
  const t = useTranslations('bookmark');

  const isLoading = isAdding || isRemoving;

  const handleToggleBookmark = () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      toast({
        title: t('auth_required'),
        variant: 'destructive',
      });
      return;
    }

    const request = { entityId, entityType };
    if (isBookmarked) {
      removeBookmark(request, {
        onSuccess: response => {
          toast({
            title: response.message,
          });
        },
        onError: (error: any) => {
          toast({
            title: error.message,
            variant: 'destructive',
          });
        },
      });
    } else {
      addBookmark(request, {
        onSuccess: response => {
          toast({
            title: response.message,
          });
        },
        onError: (error: any) => {
          toast({
            title: error.message,
            variant: 'destructive',
          });
        },
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn(
              'group gap-2 transition-all duration-300',
              {
                'text-primary': isBookmarked,
                'hover:text-primary': !isBookmarked,
              },
              className,
            )}
            onClick={handleToggleBookmark}
            disabled={isLoading}
          >
            <Bookmark
              className={cn(
                'h-[1.2rem] w-[1.2rem] transition-transform group-hover:scale-110',
                isBookmarked ? 'fill-current' : 'fill-none',
              )}
            />
            {showText && (isBookmarked ? 'Saved' : 'Save')}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
