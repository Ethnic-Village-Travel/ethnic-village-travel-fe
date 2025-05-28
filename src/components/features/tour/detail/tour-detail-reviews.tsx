'use client';

import { useState } from 'react';

import { Review } from '@/types/review.type';
import { Tour } from '@/types/tour.type';
import { Button } from '@/components/ui/button';
import { ReviewItem } from '@/components/shared/review-item';

import { AddReviewCard } from './add-review-card';
import { ReviewStatsCard } from './review-stats-card';

interface TourDetailReviewsProps {
  tour: Tour;
}

// Thêm mock data cho reviews - sẽ được thay thế bằng API call sau
const mockReviews: Review[] = [
  {
    id: 1,
    userId: 1,
    rating: 5,
    content: 'Tour rất tuyệt vời! Phong cảnh đẹp, hướng dẫn viên nhiệt tình.',
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-05-20'),
    user: {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=1',
    },
    entityId: 1,
    entityType: 'tour',
    isPinned: true,
  },
  {
    id: 1,
    userId: 1,
    rating: 5,
    content: 'Tour rất tuyệt vời! Phong cảnh đẹp, hướng dẫn viên nhiệt tình.',
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-05-20'),
    user: {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=1',
    },
    entityId: 1,
    entityType: 'tour',
  },
  {
    id: 1,
    userId: 1,
    rating: 5,
    content: 'Tour rất tuyệt vời! Phong cảnh đẹp, hướng dẫn viên nhiệt tình.',
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-05-20'),
    user: {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=1',
    },
    entityId: 1,
    entityType: 'tour',
  },
  {
    id: 1,
    userId: 1,
    rating: 5,
    content: 'Tour rất tuyệt vời! Phong cảnh đẹp, hướng dẫn viên nhiệt tình.',
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-05-20'),
    user: {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=1',
    },
    entityId: 1,
    entityType: 'tour',
  },
];

const mockStats = {
  totalReviews: 100,
  averageRating: 4.5,
  ratingCounts: {
    5: 50,
    4: 30,
    3: 10,
    2: 5,
    1: 5,
  },
  percentages: {
    5: 50,
    4: 30,
    3: 10,
    2: 5,
    1: 5,
  },
};

export function TourDetailReviews({ tour }: TourDetailReviewsProps) {
  const [reviews, setReviews] = useState(mockReviews);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setVisibleReviews(prev => prev + 5);
  };

  const handleAddReview = async (data: { rating: number; content: string }) => {
    setIsLoading(true);
    // TODO: Implement API call
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newReview: Review = {
        id: Math.random(),
        userId: 1,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 1,
          name: 'Current User',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=current',
        },
        entityId: 1,
        entityType: 'tour',
      };
      setReviews(prev => [newReview, ...prev]);
    } catch (error) {
      console.error('Failed to add review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditReview = (review: Review) => {
    // TODO: Implement edit functionality
    console.log('Edit review:', review);
  };

  const handleDeleteReview = (review: Review) => {
    // TODO: Implement delete functionality
    console.log('Delete review:', review);
  };

  const handlePinReview = (review: Review) => {
    // TODO: Implement pin functionality
    console.log('Pin review:', review);
  };

  const handleReportReview = (review: Review) => {
    // TODO: Implement report functionality
    console.log('Report review:', review);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Review stats */}
      <ReviewStatsCard stats={mockStats} />

      {/* Add review */}
      <div className="rounded-2xl border px-6 py-4">
        <AddReviewCard onSubmit={handleAddReview} isLoading={isLoading} />
      </div>

      {/* Review list */}
      <div className="flex flex-col gap-4">
        {reviews.slice(0, visibleReviews).map(review => (
          <ReviewItem
            key={review.id}
            review={review}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
            onPin={handlePinReview}
            onReport={handleReportReview}
          />
        ))}
      </div>

      {/* Load more button */}
      {visibleReviews < reviews.length && (
        <div className="flex justify-center">
          <Button onClick={handleLoadMore}>Xem thêm đánh giá</Button>
        </div>
      )}
    </div>
  );
}
