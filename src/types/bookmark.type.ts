import { EntityType } from '@/constants/entity';
import { BookmarkStatus } from '@/constants/enum/bookmark.enum';

export interface Bookmark {
  id: string;
  entityType: EntityType;
  entityId: string;
  status: BookmarkStatus;
  createdAt: string;
}
