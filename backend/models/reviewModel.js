import db from "../config/db.js";

const Review = {
  // Function to create a new review
  createReview: (content, productId, username, userId, callback) => {
    const createdAt = Math.floor(Date.now() / 1000);
    const query = `INSERT INTO reviews (content, productId, username, userId, createdAt) VALUES (?, ?, ?, ?, ?)`;

    db.run(
      query,
      [content, productId, username, userId, createdAt],
      function (err) {
        if (err) {
          console.error("Error inserting review into database:", err.message);
          return callback(err);
        }

        console.log("Review created with ID:", this.lastID);
        callback(null, { id: this.lastID });
      }
    );
  },

  // Function to fetch all reviews
  getReviewsByProductId: (productId, callback) => {
    const query = `SELECT * FROM reviews WHERE productId = ? ORDER BY id DESC`;

    db.all(query, [productId], (err, rows) => {
      if (err) {
        console.error("Error fetching reviews from database:", err.message);
        return callback(err);
      }
      callback(null, rows);
    });
  },
};

export default Review;
