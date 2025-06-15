export interface Review {
  id: number;
  userId: number;
  rating: number;
  content: string;
  isPinned?: boolean;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  entityId: number;
  entityType: string;
  deleted: boolean;
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
