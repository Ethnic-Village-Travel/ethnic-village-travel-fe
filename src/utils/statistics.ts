import { Rating } from '@/types/ratings.type';

export function calculateRatingStats(ratings: Rating[]) {
  const total = ratings.length;

  if (total === 0) {
    return {
      average: 0,
      total: 0,
    };
  }

  const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
  const average = parseFloat((sum / total).toFixed(1));

  return {
    average,
    total,
  };
}
