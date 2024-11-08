import db from "../config/db.js";

export const createProduct = (
  name,
  description,
  price,
  stock,
  createdBy,
  callback
) => {
  const query = `INSERT INTO products (name, description, price, stock, createdBy) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [name, description, price, stock, createdBy], function (err) {
    if (err) return callback(err);
    callback(null, {
      id: this.lastID,
      name,
      description,
      price,
      stock,
      createdBy,
    });
  });
};

export const getProductById = (productId, callback) => {
  const query = `SELECT * FROM products WHERE id = ?`;
  db.get(query, [productId], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
};

export const getAllProducts = (callback) => {
  const query = `SELECT * FROM products`;
  db.all(query, [], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
};

export const updateProduct = (productId, updatedData, callback) => {
  const { name, description, price, stock } = updatedData;
  const query = `UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?`;
  db.run(query, [name, description, price, stock, productId], function (err) {
    if (err) return callback(err);
    callback(null);
  });
};

export const deleteProduct = (productId, callback) => {
  const query = `DELETE FROM products WHERE id = ?`;
  db.run(query, [productId], function (err) {
    if (err) return callback(err);
    callback(null);
  });
};

export const adjustStock = (productId, amount, callback) => {
  const query = `UPDATE products SET stock = stock + ? WHERE id = ?`;
  db.run(query, [amount, productId], function (err) {
    if (err) return callback(err);
    callback(null);
  });
};
