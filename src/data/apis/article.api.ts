import { API } from '@/core/api';
import api from '@/core/api/api';
import { encodeQueryData } from '@/core/api/utils';

import { ApiResponse } from '@/types/api.type';
import { Article, ArticleListRequest, ArticleListResponse } from '@/types/article.type';

export const articleApi = {
  getArticleList: async (params?: ArticleListRequest): Promise<ApiResponse<ArticleListResponse>> => {
    try {
      const queryParams = {
        page: params?.page ?? 0,
        size: params?.size ?? 4,
      };

      const queryString = encodeQueryData(queryParams);
      const { data } = await api.get<ApiResponse<ArticleListResponse>>(`${API.POST.GET_ALL}?${queryString}`);

      return data;
    } catch {
      throw new Error('Failed to get article list');
    }
  },

  getArticleDetail: async (slug: string): Promise<ApiResponse<Article>> => {
    try {
      const { data } = await api.get<ApiResponse<Article>>(`${API.POST.GET_ALL}/${slug}`);
      return data;
    } catch {
      throw new Error('Failed to get article detail');
    }
  },
};
