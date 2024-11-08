import express from "express";
import {
  authenticateToken,
  authorizeRole,
} from "../middleware/authMiddleware.js";
import {
  createProductController,
  viewAllProducts,
  /*  updateProduct, */
  deleteProductController,
  reserveProductWithTimeout,
} from "../controllers/productController.js";

const router = express.Router();

// Admin-only routes
router.post(
  "/create",
  authenticateToken,
  authorizeRole("admin"),
  createProductController
);
router.put(
  "/:productId",
  authenticateToken,
  authorizeRole("admin")
  /* updateProduct */
);
router.delete(
  "/:productId",
  authenticateToken,
  authorizeRole("admin"),
  deleteProductController
);

// Public routes
router.get("/", viewAllProducts);

// User-only routes for reservation
router.post(
  "/:productId/reserve",
  authenticateToken,
  reserveProductWithTimeout
);

export default router;
