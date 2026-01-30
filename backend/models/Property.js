const mongoose = require('mongoose');
const { MockProperty } = require('../mock-database');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'studio'],
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  sqft: {
    type: Number,
    required: true
  },
  features: [{
    type: String
  }],
  images: [{
    url: String,
    description: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  totalReviews: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'rented'],
    default: 'active'
  }
}, {
  timestamps: true
});

propertySchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) return 0;
  
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
};

const MongooseProperty = mongoose.model('Property', propertySchema);

// Export MockProperty if MongoDB is not connected, otherwise export Mongoose model
module.exports = new Proxy(MockProperty, {
  get(target, prop) {
    // Always try MockProperty first for mock database fallback
    if (mongoose.connection.readyState === 1) {
      // If MongoDB is connected, use Mongoose
      return MongooseProperty[prop];
    }
    // Otherwise use MockProperty
    return MockProperty[prop];
  }
});