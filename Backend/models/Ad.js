// import mongoose from 'mongoose';

// const categoryEnum = ['Fashion', 'Fitness', 'Travel', 'Tech', 'Food'];

// const adSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   budget: { type: Number, required: true, min: 0 },
//   category: { type: String, enum: categoryEnum, required: true },
//   companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
//   acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Influencer who accepted the ad
//   createdAt: { type: Date, default: Date.now },
// });

// const Ad = mongoose.model('Ad', adSchema);

// export default Ad;

import mongoose from 'mongoose';

const categoryEnum = ['Fashion', 'Fitness', 'Travel', 'Tech', 'Food'];

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true, min: 0 },
  category: { type: String, enum: categoryEnum, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  proof: {
    link: { type: String }, // URL to the posted content
    description: { type: String }, // Description of the proof
    submittedAt: { type: Date }, // Date of submission
  },
});

const Ad = mongoose.model('Ad', adSchema);

export default Ad;