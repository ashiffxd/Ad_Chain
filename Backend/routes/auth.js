// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// const router = express.Router();

// // Signup Route
// router.post('/signup', async (req, res) => {
//   try {
//     const { role, name, email, password, contactInfo, industry, companySize, website, socialMedia, description, categories } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       role,
//       name,
//       email,
//       password: hashedPassword,
//       contactInfo,
//       industry: role === 'company' ? industry : undefined,
//       companySize: role === 'company' ? companySize : undefined,
//       website: role === 'company' ? website : undefined,
//       socialMedia: role === 'influencer' ? socialMedia : undefined,
//       description,
//       categories: role === 'influencer' ? categories : undefined,
//     });

//     await user.save();

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     const userResponse = user.toObject();
//     delete userResponse.password;
//     res.status(201).json({
//       token,
//       user: userResponse,
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Login Route
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     const userResponse = user.toObject();
//     delete userResponse.password;
//     res.json({
//       token,
//       user: userResponse,
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Get Profile Route
// router.get('/profile', async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(user);
//   } catch (err) {
//     res.status(401).json({ message: 'Invalid token', error: err.message });
//   }
// });

// // Update Profile Route
// router.put('/profile', async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const { name, contactInfo, industry, companySize, website, socialMedia, description, categories } = req.body;

//     if (name !== undefined) user.name = name;
//     if (contactInfo !== undefined) user.contactInfo = contactInfo;
//     if (user.role === 'company') {
//       if (industry !== undefined) user.industry = industry;
//       if (companySize !== undefined) user.companySize = companySize;
//       if (website !== undefined) user.website = website;
//     } else if (user.role === 'influencer') {
//       if (socialMedia !== undefined) user.socialMedia = socialMedia;
//       if (categories !== undefined) user.categories = categories;
//     }
//     if (description !== undefined) user.description = description;

//     await user.save();

//     const userResponse = user.toObject();
//     delete userResponse.password;
//     res.json(userResponse);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Get Notifications Route
// router.get('/notifications', async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId).select('notifications');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(user.notifications);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// export default router;
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request body:', req.body); // Log request body for debugging

    const { role, name, email, password, contactInfo, industry, companySize, website, socialMedia, description, categories } = req.body;

    // Basic input validation
    if (!role || !name || !email || !password || !contactInfo) {
      return res.status(400).json({ message: 'Missing required fields: role, name, email, password, and contactInfo are required' });
    }

    if (!['company', 'influencer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "company" or "influencer"' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      role,
      name,
      email,
      password: hashedPassword,
      contactInfo,
      industry: role === 'company' ? industry : undefined,
      companySize: role === 'company' ? companySize : undefined,
      website: role === 'company' ? website : undefined,
      socialMedia: role === 'influencer' ? socialMedia : undefined,
      description,
      categories: role === 'influencer' ? categories : undefined,
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Prepare response (remove password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error('Signup error:', err); // Log error for debugging
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Profile Route
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
});

// Update Profile Route
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, contactInfo, industry, companySize, website, socialMedia, description, categories } = req.body;

    if (name !== undefined) user.name = name;
    if (contactInfo !== undefined) user.contactInfo = contactInfo;
    if (user.role === 'company') {
      if (industry !== undefined) user.industry = industry;
      if (companySize !== undefined) user.companySize = companySize;
      if (website !== undefined) user.website = website;
    } else if (user.role === 'influencer') {
      if (socialMedia !== undefined) user.socialMedia = socialMedia;
      if (categories !== undefined) user.categories = categories;
    }
    if (description !== undefined) user.description = description;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Notifications Route
router.get('/notifications', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('notifications');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.notifications);
  } catch (err) {
    console.error('Notifications fetch error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;