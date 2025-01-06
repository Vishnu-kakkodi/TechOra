import React from 'react';
import { Plus } from 'lucide-react';
import ReactStars from 'react-stars';
import { Review } from 'src/types/reviewType';

interface ReviewSectionProps {
  Review: any;
  isAddingReview: boolean;
  setIsAddingReview: (isAdding: boolean) => void;
  currentValue: number | undefined;
  setCurrentValue: (value: number | undefined) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  handleSubmitReview: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  Review,
  isAddingReview,
  setIsAddingReview,
  currentValue,
  setCurrentValue,
  reviewText,
  setReviewText,
  handleSubmitReview
}) => {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Ratings & Reviews</h2>
        <button
          onClick={() => setIsAddingReview(!isAddingReview)}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Review
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="text-4xl font-bold text-yellow-500">
          {Review?.data?.response?.averageRating?.toFixed(1) || "N/A"}
        </div>
        <div>
          <ReactStars
            count={5}
            value={Review?.data?.response?.averageRating || 0}
            size={24}
            color2={'#ffd700'}
            edit={false}
          />
          <div className="text-sm text-gray-600 mt-1">
            Based on <span className="font-medium">{Review?.data?.total || 0}</span> reviews
          </div>
        </div>
      </div>

      {isAddingReview && (
        <div className="mb-6 bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">Leave a Review</h4>
          <div className="flex items-center space-x-2 mb-4">
            <ReactStars
              count={5}
              value={currentValue}
              onChange={(newValue: number | undefined) => setCurrentValue(newValue)}
              size={24}
              color2={'#ffd700'}
            />
            <span className="text-gray-600">({currentValue || "Rate this course"})</span>
          </div>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your review here..."
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleSubmitReview}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Review
            </button>
            <button
              onClick={() => setIsAddingReview(false)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4">What Others Are Saying</h4>
        {Review?.data?.response?.userReviews && Review.data.response.userReviews.length > 0 ? (
          <ul className="space-y-6">
            {Review.data.response.userReviews.map((review: Review, index: number) => (
              <li key={index} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-semibold">
                    {review?.userId?.userName || "Anonymous User"}
                  </h5>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={18}
                    edit={false}
                    color2={'#ffd700'}
                  />
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this course!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;

