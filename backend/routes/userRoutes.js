const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().trim().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('address').optional().trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, address, profileImage } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, profileImage },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: {
        path: 'owner',
        select: 'name email phone'
      }
    });

    res.json({
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/favorites/:propertyId', auth, async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const user = await User.findById(req.user._id);
    const isFavorite = user.favorites.includes(propertyId);

    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
      await user.save();
      res.json({ message: 'Property removed from favorites', isFavorite: false });
    } else {
      user.favorites.push(propertyId);
      await user.save();
      res.json({ message: 'Property added to favorites', isFavorite: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/favorites/:propertyId', auth, async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
    await user.save();

    res.json({ message: 'Property removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const totalBookings = await Booking.countDocuments({ user: userId });
    const activeBookings = await Booking.countDocuments({ 
      user: userId, 
      status: { $in: ['pending', 'confirmed'] } 
    });
    const completedBookings = await Booking.countDocuments({ 
      user: userId, 
      status: 'completed' 
    });
    
    const user = await User.findById(userId);
    const totalFavorites = user.favorites.length;
    
    const recentBookings = await Booking.find({ user: userId })
      .populate('property', 'title location price images')
      .sort({ createdAt: -1 })
      .limit(5);

    const totalSpent = await Booking.aggregate([
      { $match: { user: userId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      stats: {
        totalBookings,
        activeBookings,
        completedBookings,
        totalFavorites,
        totalSpent: totalSpent[0]?.total || 0
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/change-password', auth, [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;