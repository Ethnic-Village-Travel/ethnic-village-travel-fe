import { EntityType } from '@/constants/entity';
import { BookmarkStatus } from '@/constants/enum/bookmark.enum';

export interface Bookmark {
  id: number;
  entityType: EntityType;
  entityId: number;
  status: BookmarkStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkRequest {
  entityId: string;
  entityType: EntityType;
}

export interface BookmarkResponse {
  bookmarks: Bookmark[];
  total: number;
  isBookmarked: boolean;
}
