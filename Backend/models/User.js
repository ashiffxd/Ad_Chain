
import mongoose from 'mongoose';

const platformEnum = ['Instagram', 'YouTube', 'TikTok'];
const categoryEnum = ['Fashion', 'Fitness', 'Travel', 'Tech', 'Food'];

const userSchema = new mongoose.Schema({
  role: { 
    type: String, 
    required: [true, 'Role is required'], 
    enum: {
      values: ['company', 'influencer'],
      message: 'Role must be either "company" or "influencer"',
    },
  },
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true },
  password: { type: String, required: [true, 'Password is required'] },
  contactInfo: { type: String, required: [true, 'Contact information is required'] },
  industry: { type: String }, // Company-specific
  companySize: { type: String }, // Company-specific
  website: { type: String }, // Company-specific
  socialMedia: [
    {
      platform: { 
        type: String, 
        enum: {
          values: platformEnum,
          message: 'Platform must be one of: Instagram, YouTube, TikTok',
        }, 
        required: true 
      },
      followers: { type: Number, required: true, min: [0, 'Followers must be a positive number'] },
    },
  ], // Influencer-specific
  description: { type: String },
  categories: { 
    type: [{ 
      type: String, 
      enum: {
        values: categoryEnum,
        message: 'Category must be one of: Fashion, Fitness, Travel, Tech, Food',
      },
    }], 
    default: [] 
  }, // Influencer-specific
  notifications: [
    {
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ], // For notifications (e.g., "Your ad has been accepted")
});

const User = mongoose.model('User', userSchema);

export default User;