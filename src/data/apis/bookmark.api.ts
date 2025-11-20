import { EntityType } from '@/core/constants/entity';
import api from '@/data/apis/axios';
import { API } from '@/data/apis/define';

import { ApiResponse } from '@/types/api.type';
import { BookmarkRequest, BookmarkResponse, BookmarkUpdateResponse } from '@/types/bookmark.type';

export const bookmarkApi = {
  /**
   * Add a bookmark
   * @param data BookmarkRequest
   * @returns Promise<ApiResponse<BookmarkResponse>>
   */
  addBookmark: async (data: BookmarkRequest) => {
    try {
      const response = await api.post<ApiResponse<BookmarkUpdateResponse>>(API.BOOKMARK.BASE, data);
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
      const response = await api.delete<ApiResponse<BookmarkUpdateResponse>>(API.BOOKMARK.BASE, { data });
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
