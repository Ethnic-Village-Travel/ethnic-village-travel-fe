import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  average: number;
}

const StarRating = ({ average }: StarRatingProps) => {
  return (
    <div className="flex items-center">
      {[...Array(Math.floor(average))].map((_, i) => (
        <Star key={i} strokeWidth={0} className="h-5 w-5 fill-star" />
      ))}
      {average % 1 >= 0.5 && <StarHalf strokeWidth={0} className="h-5 w-5 fill-star" />}
    </div>
  );
};

export default StarRating;
