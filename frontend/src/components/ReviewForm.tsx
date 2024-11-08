import React, { useState } from "react";
import axios from "axios";

interface ReviewFormProps {
  productId: number;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const [content, setContent] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/api/reviews/add`,
        { content, productId },
        { withCredentials: true }
      );
      setContent("");
      alert("Review added successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to add review.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a review..."
        className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 mb-2"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
