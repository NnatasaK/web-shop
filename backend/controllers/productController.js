import {
  createProduct,
  getAllProducts,
  deleteProduct,
} from "../models/productModel.js";
import {
  createReservation,
  getUserReservationsCount,
  releaseProduct,
} from "../models/reservationModel.js";

// Create a new product (admin only)
export const createProductController = (req, res) => {
  const { name, description, price, stock } = req.body;
  const createdBy = req.user.username;

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can create products." });
  }

  createProduct(name, description, price, stock, createdBy, (err, product) => {
    if (err) return res.status(500).json({ message: "Error creating product" });
    res.status(201).json({ message: "Product created", product });
  });
};

// View all products (all users)
export const viewAllProducts = (req, res) => {
  getAllProducts((err, products) => {
    if (err)
      return res.status(500).json({ message: "Error fetching products" });
    res.json({ products });
  });
};

// Delete a product (admin only)
export const deleteProductController = (req, res) => {
  const { productId } = req.params;

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can delete products." });
  }

  deleteProduct(productId, (err) => {
    if (err) return res.status(500).json({ message: "Error deleting product" });
    res.json({ message: "Product deleted successfully" });
  });
};

// Reserve a product (user only)
export const reserveProductWithTimeout = (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  getUserReservationsCount(userId, (err, count) => {
    if (err)
      return res.status(500).json({ message: "Error checking reservations" });
    if (count >= 5) {
      return res.status(403).json({
        message:
          "Reservation limit reached. You cannot reserve more than 5 products.",
      });
    }

    createReservation(userId, productId, (err) => {
      if (err)
        return res.status(500).json({ message: "Error reserving product" });
      res.json({ message: "Product reserved successfully" });

      setTimeout(() => {
        releaseProduct(productId, (releaseErr) => {
          if (releaseErr)
            console.error(`Error releasing product ${productId}:`, releaseErr);
        });
      }, 2 * 60 * 1000); // 2-minute timeout for testing
    });
  });
};
