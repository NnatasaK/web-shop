import express from "express";
import { addReview, getReviews } from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST request to add a review
router.post("/add", authenticateToken, addReview);

// GET request to fetch reviews for a product
router.get("/:productId", getReviews);

export default router;
