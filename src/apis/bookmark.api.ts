import { EntityType } from '@/constants/entity';
import { API } from '@/core/api';
import api from '@/core/api/api';

import { ApiResponse } from '@/types/api.type';
import { BookmarkRequest, BookmarkResponse } from '@/types/bookmark.type';

export const bookmarkApi = {
  /**
   * Add a bookmark
   * @param data BookmarkRequest
   * @returns Promise<ApiResponse<BookmarkResponse>>
   */
  addBookmark: async (data: BookmarkRequest) => {
    try {
      const response = await api.post<ApiResponse<BookmarkResponse>>(API.BOOKMARK.BASE, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Remove a bookmark
   * @param data BookmarkRequest
   * @returns Promise<ApiResponse<BookmarkResponse>>
   */
  removeBookmark: async (data: BookmarkRequest) => {
    try {
      const response = await api.delete<ApiResponse<BookmarkResponse>>(API.BOOKMARK.BASE, { data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get bookmarks by type
   * @param type EntityType
   * @returns Promise<ApiResponse<BookmarkResponse>>
   */
  getBookmarks: async () => {
    try {
      const response = await api.get<ApiResponse<BookmarkResponse>>(API.BOOKMARK.BASE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if an entity is bookmarked
   * @param entityId string
   * @param type EntityType
   * @returns Promise<ApiResponse<BookmarkResponse>>
   */
  checkBookmarkStatus: async (entityId: string, type: EntityType) => {
    try {
      const response = await api.get<ApiResponse<BookmarkResponse>>(API.BOOKMARK.CHECK, {
        params: { entityId, type },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
