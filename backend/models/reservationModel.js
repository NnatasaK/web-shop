import db from "../config/db.js";
import { adjustStock, getProductById } from "../models/productModel.js";

export const createReservation = (userId, productId, callback) => {
  const reservedAt = Date.now();
  const query = `INSERT INTO reservations (userId, productId, reservedAt, status) VALUES (?, ?, ?, 'reserved')`;

  getProductById(productId, (err, product) => {
    if (err) return callback(err);
    if (!product || product.stock < 1) {
      return callback(new Error("Product out of stock or not available"));
    }

    db.run(query, [userId, productId, reservedAt], function (err) {
      if (err) return callback(err);

      adjustStock(productId, -1, (err) => {
        if (err) return callback(err);
        callback(null, { id: this.lastID });
      });
    });
  });
};

export const getUserReservationsCount = (userId, callback) => {
  const query = `SELECT COUNT(*) AS count FROM reservations WHERE userId = ? AND status = 'reserved'`;
  db.get(query, [userId], (err, row) => {
    if (err) return callback(err);
    callback(null, row.count);
  });
};

export const releaseProduct = (productId, callback) => {
  const query = `UPDATE reservations SET status = 'released' WHERE productId = ? AND status = 'reserved'`;
  db.run(query, [productId], (err) => {
    if (err) return callback(err);

    adjustStock(productId, 1, callback);
  });
};

export const autoReleaseExpiredReservations = () => {
  const EXPIRATION_TIME = 5 * 60 * 1000;
  const currentTime = Date.now();
  const query = `SELECT productId FROM reservations WHERE status = 'reserved' AND reservedAt <= ?`;

  db.all(query, [currentTime - EXPIRATION_TIME], (err, rows) => {
    if (err) return console.error("Error fetching expired reservations:", err);

    rows.forEach((row) => {
      releaseProduct(row.productId, (err) => {
        if (err)
          console.error(`Error releasing product ${row.productId}:`, err);
      });
    });
  });
};

// Set an interval to auto-release expired reservations every minute
setInterval(autoReleaseExpiredReservations, 60 * 1000);
