import { User } from './user.type';

export interface ReviewUser {
  id: number;
  name: string;
  avatar?: string;
  personal?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface Review {
  id: number;
  userId: number;
  rating: number;
  content: string;
  isPinned?: boolean;
  user: User;
  entityId: number;
  entityType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingCounts: {
    [key: number]: number;
  };
}
