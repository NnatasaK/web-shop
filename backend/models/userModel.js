import db from "../config/db.js";

const User = {
  // Function to create a new user
  createUser: (username, hashedPassword, role, callback) => {
    const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;

    // Log the query for debugging purposes
    console.log('Creating user with username:', username);

    db.run(query, [username, hashedPassword, role], function (err) {
      if (err) {
        console.error('Error inserting user into database:', err.message);
        return callback(err);
      }

      // Log success
      console.log('User created with ID:', this.lastID);

      // Return the newly created user's ID
      callback(null, { id: this.lastID });
    });
  },

  // Function to find a user by username
  findUserByUsername: (username, callback) => {
    const query = `SELECT * FROM users WHERE username = ?`;

    // Log the query for debugging purposes
    console.log('Searching for user with username:', username);

    db.get(query, [username], (err, row) => {
      if (err) {
        console.error('Error fetching user from database:', err.message);
        return callback(err);
      }

      // Log the result if a user is found
      if (row) {
        console.log('User found:', row);
      } else {
        console.log('No user found with username:', username);
      }

      // Return the user row if found, otherwise null
      callback(null, row);
    });
  }
};

export default User;
