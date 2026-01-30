const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  properties: [{
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      maxlength: 500,
      trim: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'My Wishlist',
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    trim: true
  }
}, {
  timestamps: true
});

wishlistSchema.methods.addProperty = function(propertyId, notes = '', priority = 'medium') {
  const existingProperty = this.properties.find(p => p.property.toString() === propertyId.toString());
  if (!existingProperty) {
    this.properties.push({
      property: propertyId,
      notes,
      priority,
      addedAt: new Date()
    });
  }
  return this.save();
};

wishlistSchema.methods.removeProperty = function(propertyId) {
  this.properties = this.properties.filter(p => p.property.toString() !== propertyId.toString());
  return this.save();
};

wishlistSchema.methods.getPropertyCount = function() {
  return this.properties.length;
};

wishlistSchema.methods.hasProperty = function(propertyId) {
  return this.properties.some(p => p.property.toString() === propertyId.toString());
};

module.exports = mongoose.model('Wishlist', wishlistSchema);