import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname (as you're using ES6 modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the absolute path for your database file (pick one directory only)
const dbPath = process.env.NODE_ENV === 'production' ? path.resolve('/tmp', 'database.sqlite') : path.resolve(__dirname, 'config', 'database.sqlite');


// Log the path to the database for debugging purposes
console.log('Database Path:', dbPath);

// Initialize SQLite Database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create Users Table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);
});

export default db;
