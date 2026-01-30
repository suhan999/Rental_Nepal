const express = require('express');
const { body, validationResult } = require('express-validator');
const Property = require('../models/Property');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, minPrice, maxPrice, location, bedrooms, userId } = req.query;
    
    const filter = {};
    
    // If userId is provided, filter by owner (for seller's own properties)
    if (userId) {
      filter.owner = userId;
    } else {
      // Default filter for public property listings
      filter.status = 'active';
      filter.isAvailable = true;
    }
    
    if (type) filter.propertyType = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (location) {
      filter.$or = [
        { 'location.address': { $regex: location, $options: 'i' } },
        { 'location.city': { $regex: location, $options: 'i' } }
      ];
    }
    if (bedrooms) filter.bedrooms = Number(bedrooms);

    const properties = await Property.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(filter);

    res.json({
      success: true,
      data: properties,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('reviews.user', 'name');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, authorize('seller', 'admin'), [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.state').trim().notEmpty().withMessage('State is required'),
  body('propertyType').isIn(['apartment', 'house', 'villa', 'studio']).withMessage('Invalid property type'),
  body('bedrooms').isInt({ min: 1 }).withMessage('Bedrooms must be at least 1'),
  body('bathrooms').isInt({ min: 1 }).withMessage('Bathrooms must be at least 1'),
  body('sqft').isNumeric().withMessage('Square feet must be a number')
], async (req, res) => {
  console.log('=== PROPERTY CREATION REQUEST RECEIVED ===');
  console.log('Request headers:', req.headers);
  console.log('Request user:', req.user ? req.user._id : 'No user');
  console.log('Request body:', req.body);
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const propertyData = {
      ...req.body,
      owner: req.user._id
    };
    
    console.log('Property data to save:', propertyData);

    const property = new Property(propertyData);
    await property.save();
    console.log('Property saved successfully:', property._id);

    await property.populate('owner', 'name email phone');
    console.log('Property populated with owner data');

    const responseData = {
      message: 'Property created successfully',
      property
    };
    
    console.log('Sending successful response for property creation');
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Property creation error:', error);
    const errorResponse = { message: 'Server error', error: error.message };
    console.log('Sending error response:', errorResponse);
    res.status(500).json(errorResponse);
  }
});

router.put('/:id', auth, authorize('seller', 'admin'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.json({
      message: 'Property updated successfully',
      property: updatedProperty
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, authorize('seller', 'admin'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/reviews', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 5 }).withMessage('Comment must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const existingReview = property.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this property' });
    }

    property.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    property.totalReviews = property.reviews.length;
    property.rating = property.calculateAverageRating();

    await property.save();
    await property.populate('reviews.user', 'name');

    res.status(201).json({
      message: 'Review added successfully',
      property
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const user = await User.findById(req.user._id);
    const isFavorite = user.favorites.includes(req.params.id);

    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== req.params.id);
      await user.save();
      res.json({ message: 'Property removed from favorites', isFavorite: false });
    } else {
      user.favorites.push(req.params.id);
      await user.save();
      res.json({ message: 'Property added to favorites', isFavorite: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;