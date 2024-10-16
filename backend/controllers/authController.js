import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Signup route
export const signup = async (req, res) => {
  const { username, password, role = 'user' } = req.body;

  try {
    // Check if the user already exists
    User.findUserByUsername(username, async (err, existingUser) => {
      if (err) {
        console.error('Error checking if user exists:', err.message);
        return res.status(500).json({ message: 'Server error' });
      }

      // If user exists, return 400
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // If user doesn't exist, proceed with creation
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hashedPassword);

      // Save the new user to the database
      User.createUser(username, hashedPassword, role, (err) => {
        if (err) {
          console.error('Error inserting user:', err.message);
          return res.status(500).json({ message: 'Error creating user' });
        }
        res.status(201).json({
          message: 'User created',
          user: {
            username,
            role
          }
        });
      });
    });

  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error: error.message });
  }
};
// Login route
export const login = (req, res) => {
  const { username, password } = req.body;

  // Find user in the database
  User.findUserByUsername(username, async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'Invalid password' });
    }

    // Ensure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret key is missing' });
    }

    // Generate the JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role },  // Payload
      process.env.JWT_SECRET,                        // Secret key
      { expiresIn: '1h' }                            // Token expiration 
    );

    res.json({ token });
  });
};


