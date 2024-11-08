import db from "../config/db.js";

const User = {
  // Function to create a new user
  createUser: (username, hashedPassword, role, callback) => {
    const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;

    console.log("Creating user with username:", username);

    db.run(query, [username, hashedPassword, role], function (err) {
      if (err) {
        console.error("Error inserting user into database:", err.message);
        return callback(err);
      }

      // Log success
      console.log("User created with ID:", this.lastID);

      callback(null, { id: this.lastID });
    });
  },

  // Function to find a user by username
  findUserByUsername: (username, callback) => {
    const query = `SELECT * FROM users WHERE username = ?`;

    db.get(query, [username], (err, row) => {
      if (err) {
        console.error("Error fetching user from database:", err.message);
        return callback(err);
      }
      if (row) {
        console.log("User found:", row);
      } else {
        console.log("No user found with username:", username);
      }
      callback(null, row);
    });
  },
};

export default User;
