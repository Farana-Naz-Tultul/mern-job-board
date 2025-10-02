import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// REGISTER route (POST /api/auth/register)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 2. Create new user
    const user = new User({ name, email, password, role });
    await user.save();

    // 3. Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // token expires in 7 days
    );

    // 4. Respond with user info + token
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN route (POST /api/auth/login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Generate a token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Respond with user info + token
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
