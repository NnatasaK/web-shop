import React, { useEffect, useState } from "react";
import axios from "axios";
import { Review } from "../utils/entities";

interface ReviewListProps {
  productId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/reviews/${productId}`,
          {
            withCredentials: true,
          }
        );

        setReviews(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [productId, API_BASE_URL]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="border p-2 rounded mb-2">
            <p>{review.content}</p>
          </div>
        ))
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
};

export default ReviewList;
