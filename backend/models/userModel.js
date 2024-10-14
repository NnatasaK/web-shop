import db from "../config/db.js";

const User = {
  createUser: (username, hashedPassword, role, callback) => {
    const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
    db.run(query, [username, hashedPassword, role], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID });
    });
  },

  findUserByUsername: (username, callback) => {
    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, row) => {
      if (err) {
        return callback(err);
      }
      callback(null, row);
    });
  }
};

export default User;
