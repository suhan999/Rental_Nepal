const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MockUser } = require('../mock-database');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  notifications: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const MongooseUser = mongoose.model('User', userSchema);

// Export MockUser if MongoDB is not connected, otherwise export Mongoose model
module.exports = new Proxy(MockUser, {
  get(target, prop) {
    // Always return MockUser methods if called directly
    // MongoDB will only work if explicitly connected
    if (mongoose.connection.readyState === 1) {
      // If MongoDB is connected, use Mongoose
      return MongooseUser[prop];
    }
    // Otherwise use MockUser
    return MockUser[prop];
  }
});