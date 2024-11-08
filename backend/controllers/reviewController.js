import Review from '../models/reviewModel.js';
/* import { sanitizeInput } from '../utils/inputSanitizer.js'; */
import xss from 'xss';

export const addReview = (req, res) => {
  const content = xss(req.body.content);
  const productId = parseInt(req.body.productId, 10);
  const username = req.user.username;
  const userId = req.user.id; 

  console.log("Review Content:", content);
  console.log("Product ID:", productId);
  console.log("User ID:", userId);
  console.log("Username:", username);

  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  if (!userId) {
    return res.status(403).json({ message: 'User ID is missing' });
  }

  Review.createReview(content, productId, username, userId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error saving review' });
    }
    res.status(201).json({ message: 'Review added successfully', reviewId: result.id });
  });
};

export const getReviews = (req, res) => {
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  Review.getReviewsByProductId(productId, (err, reviews) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching reviews' });
    }
    const sanitizedReviews = reviews.map(review => ({
      ...review,
      content: xss(review.content), // Prevent XSS in displayed content
    }));

    res.status(200).json(sanitizedReviews);
  });
 
};
