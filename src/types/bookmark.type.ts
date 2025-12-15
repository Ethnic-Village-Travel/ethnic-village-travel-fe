import { EntityType } from '@/core/constants/entity';
import { BookmarkStatus } from '@/core/enum/bookmark.enum';

export interface Bookmark {
  id: number;
  entityType: EntityType;
  entityId: string;
  status: BookmarkStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkRequest {
  entityId: string;
  entityType: EntityType;
}

export interface BookmarkUpdateResponse {
  bookmark: Bookmark;
}

export interface BookmarkResponse {
  bookmarks: Bookmark[];
  total: number;
  isBookmarked: boolean;
}
