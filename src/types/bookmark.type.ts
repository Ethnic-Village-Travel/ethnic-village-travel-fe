import { EntityType } from '@/constants/entity';
import { BookmarkStatus } from '@/constants/enum/bookmark.enum';

export interface Bookmark {
  id: number;
  entityType: EntityType;
  entityId: number;
  status: BookmarkStatus;
  createdAt: string;
}
