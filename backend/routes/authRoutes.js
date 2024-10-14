import express from 'express';
import { signup, login} from '../controllers/authController.js';
import { authenticateToken, authorizeRole} from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/userpage', authenticateToken, (req, res) => {
  res.send('Welcome to the user page');
});

router.get('/adminpage', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.send('Welcome to the admin page');
});

export default router;
