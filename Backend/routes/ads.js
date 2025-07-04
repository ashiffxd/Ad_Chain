// import express from 'express';
// import jwt from 'jsonwebtoken';
// import Ad from '../models/Ad.js';
// import User from '../models/User.js';

// const router = express.Router();

// // Create Ad (Company only)
// router.post('/', async (req, res) => {
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

//     if (user.role !== 'company') {
//       return res.status(403).json({ message: 'Only companies can create ads' });
//     }

//     const { title, description, budget, category } = req.body;

//     const ad = new Ad({
//       title,
//       description,
//       budget,
//       category,
//       companyId: user._id,
//     });

//     await ad.save();

//     res.status(201).json(ad);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Get Ads for Influencers (Matching Categories)
// router.get('/', async (req, res) => {
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

//     if (user.role !== 'influencer') {
//       return res.status(403).json({ message: 'Only influencers can view ads' });
//     }

//     // Find ads where the ad's category matches one of the influencer's categories
//     const ads = await Ad.find({
//       category: { $in: user.categories },
//       status: 'pending',
//     }).populate('companyId', 'name');

//     res.json(ads);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Get Ads Created by Company
// router.get('/my-ads', async (req, res) => {
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

//     if (user.role !== 'company') {
//       return res.status(403).json({ message: 'Only companies can view their ads' });
//     }

//     const ads = await Ad.find({ companyId: user._id }).populate('acceptedBy', 'name');
//     res.json(ads);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Accept Ad (Influencer only)
// router.post('/:adId/accept', async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const influencer = await User.findById(decoded.userId);
//     if (!influencer) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (influencer.role !== 'influencer') {
//       return res.status(403).json({ message: 'Only influencers can accept ads' });
//     }

//     const ad = await Ad.findById(req.params.adId);
//     if (!ad) {
//       return res.status(404).json({ message: 'Ad not found' });
//     }

//     if (ad.status !== 'pending') {
//       return res.status(400).json({ message: 'Ad is already accepted or rejected' });
//     }

//     ad.status = 'accepted';
//     ad.acceptedBy = influencer._id;
//     await ad.save();

//     // Notify the company
//     const company = await User.findById(ad.companyId);
//     company.notifications.push({
//       message: `Your ad "${ad.title}" has been accepted by ${influencer.name}.`,
//     });
//     await company.save();

//     res.json({ message: 'Ad accepted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// export default router;

import express from 'express';
import jwt from 'jsonwebtoken';
import Ad from '../models/Ad.js';
import User from '../models/User.js';

const router = express.Router();

// Create Ad (Company only)
router.post('/', async (req, res) => {
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

    if (user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can create ads' });
    }

    const { title, description, budget, category } = req.body;

    const ad = new Ad({
      title,
      description,
      budget,
      category,
      companyId: user._id,
    });

    await ad.save();

    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Ads for Influencers (Matching Categories)
router.get('/', async (req, res) => {
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

    if (user.role !== 'influencer') {
      return res.status(403).json({ message: 'Only influencers can view ads' });
    }

    const ads = await Ad.find({
      category: { $in: user.categories },
      status: 'pending',
    }).populate('companyId', 'name');

    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Ads Created by Company
router.get('/my-ads', async (req, res) => {
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

    if (user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can view their ads' });
    }

    const ads = await Ad.find({ companyId: user._id }).populate('acceptedBy', 'name');
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Accepted Ads for Influencer
router.get('/accepted', async (req, res) => {
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

    if (user.role !== 'influencer') {
      return res.status(403).json({ message: 'Only influencers can view their accepted ads' });
    }

    const ads = await Ad.find({
      acceptedBy: user._id,
      status: 'accepted',
    }).populate('companyId', 'name');

    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Accept Ad (Influencer only)
router.post('/:adId/accept', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const influencer = await User.findById(decoded.userId);
    if (!influencer) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (influencer.role !== 'influencer') {
      return res.status(403).json({ message: 'Only influencers can accept ads' });
    }

    const ad = await Ad.findById(req.params.adId);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    if (ad.status !== 'pending') {
      return res.status(400).json({ message: 'Ad is already accepted or rejected' });
    }

    ad.status = 'accepted';
    ad.acceptedBy = influencer._id;
    await ad.save();

    // Check if the company has already been notified for this ad
    const company = await User.findById(ad.companyId);
    const notificationExists = company.notifications.some(
      (notif) => notif.message.includes(`Your ad "${ad.title}" has been accepted by ${influencer.name}`)
    );

    if (!notificationExists) {
      company.notifications.push({
        message: `Your ad "${ad.title}" has been accepted by ${influencer.name}.`,
      });
      await company.save();
    }

    res.json({ message: 'Ad accepted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Submit Proof for Accepted Ad (Influencer only)
router.post('/:adId/submit-proof', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const influencer = await User.findById(decoded.userId);
    if (!influencer) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (influencer.role !== 'influencer') {
      return res.status(403).json({ message: 'Only influencers can submit proof' });
    }

    const ad = await Ad.findById(req.params.adId);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    if (ad.acceptedBy.toString() !== influencer._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to submit proof for this ad' });
    }

    if (ad.proof && ad.proof.submittedAt) {
      return res.status(400).json({ message: 'Proof has already been submitted for this ad' });
    }

    const { link, description } = req.body;

    ad.proof = {
      link,
      description,
      submittedAt: new Date(),
    };
    await ad.save();

    res.json({ message: 'Proof submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;