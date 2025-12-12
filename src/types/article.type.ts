import { ArticleStatus } from '@/core/enum/article.enum';

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
  publishedDate: string;
}

export interface ArticleListRequest {
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
