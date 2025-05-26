export interface Review {
  id: number;
  userId: number;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  entityId: number;
  entityType: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingCounts: {
    [key: number]: number;
  };
}
