import { ArticleStatus } from '@/core/enum/article.enum';

import { Tag } from './tag.type';

export interface Article {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  summary: string;
  content: string;
  imageUrl: string;
  upvote: number;
  downvote: number;
  views: number;
  publishedDate: string | null;
  tags?: Tag[];
}

export interface ArticleListRequest {
  searchKey?: string;
  sortBy?: string;
  order?: string;
  tagIds?: string;
  page?: number;
  size?: number;
}

export interface ArticleListResponse {
  content: Article[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ArticleAdmin extends Article {
  createdAt: string;
  updatedAt: string;
}

export interface ArticleAdminListRequest {
  searchKey?: string;
  status?: ArticleStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  order?: string;
}

export interface ArticleAdminPayload {
  title: string;
  slug?: string;
  status?: ArticleStatus;
  summary?: string;
  content: string;
  imageUrl?: string;
  publishedDate?: string | null;
  tagIds?: string[];
}

export interface ArticleAdminStatusPayload {
  status: ArticleStatus;
}
