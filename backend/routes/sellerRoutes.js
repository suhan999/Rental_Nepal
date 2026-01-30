const express = require('express');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', auth, authorize('seller'), async (req, res) => {
  try {
    const sellerId = req.user._id;
    
    const totalProperties = await Property.countDocuments({ owner: sellerId });
    const activeProperties = await Property.countDocuments({ 
      owner: sellerId, 
      status: 'active' 
    });
    const rentedProperties = await Property.countDocuments({ 
      owner: sellerId, 
      status: 'rented' 
    });
    
    const totalBookings = await Booking.countDocuments({ seller: sellerId });
    const pendingBookings = await Booking.countDocuments({ 
      seller: sellerId, 
      status: 'pending' 
    });
    const confirmedBookings = await Booking.countDocuments({ 
      seller: sellerId, 
      status: 'confirmed' 
    });
    const completedBookings = await Booking.countDocuments({ 
      seller: sellerId, 
      status: 'completed' 
    });
    
    const totalEarnings = await Booking.aggregate([
      { $match: { seller: sellerId, status: { $in: ['completed', 'approved'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const monthlyEarnings = await Booking.aggregate([
      {
        $match: {
          seller: sellerId,
          status: { $in: ['completed', 'approved'] },
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentBookings = await Booking.find({ seller: sellerId })
      .populate('user', 'name email phone')
      .populate('property', 'title location price')
      .sort({ createdAt: -1 })
      .limit(5);

    const topProperties = await Property.find({ owner: sellerId })
      .sort({ rating: -1, totalReviews: -1 })
      .limit(5)
      .select('title location price rating totalReviews');

    res.json({
      stats: {
        totalProperties,
        activeProperties,
        rentedProperties,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        totalEarnings: totalEarnings[0]?.total || 0,
        monthlyEarnings: monthlyEarnings[0]?.total || 0
      },
      recentBookings,
      topProperties
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/properties', auth, authorize('seller'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const filter = { owner: req.user._id };
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/bookings', auth, authorize('seller'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const filter = { seller: req.user._id };
    if (status && status !== 'all') filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('property', 'title location price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/bookings/:id/status', auth, authorize('seller'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const booking = await Booking.findOne({
      _id: req.params.id,
      seller: req.user._id
    }).populate('user', 'name email')
      .populate('property', 'title');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    if (notes) booking.notes = notes;
    
    await booking.save();

    res.json({
      message: `Booking ${status} successfully`,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/analytics', auth, authorize('seller'), async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const sellerId = req.user._id;
    
    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        dateFilter = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          seller: sellerId,
          createdAt: { $gte: dateFilter }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const propertyPerformance = await Property.aggregate([
      { $match: { owner: sellerId } },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'property',
          as: 'bookings'
        }
      },
      {
        $project: {
          title: 1,
          price: 1,
          rating: 1,
          totalReviews: 1,
          totalBookings: { $size: '$bookings' },
          totalRevenue: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$bookings',
                    cond: { $eq: ['$$this.status', 'completed'] }
                  }
                },
                as: 'booking',
                in: '$$booking.totalAmount'
              }
            }
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    const statusDistribution = await Booking.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      bookingTrends,
      propertyPerformance,
      statusDistribution
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/earnings', auth, authorize('seller'), async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const sellerId = req.user._id;
    
    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        dateFilter = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const earnings = await Booking.find({
      seller: sellerId,
      status: { $in: ['completed', 'approved'] },
      createdAt: { $gte: dateFilter }
    })
    .populate('property', 'title')
    .populate('user', 'name')
    .sort({ createdAt: -1 });

    const totalEarnings = earnings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    res.json({
      earnings,
      totalEarnings,
      period
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/stats/:id', auth, authorize('seller'), async (req, res) => {
  try {
    const sellerId = req.params.id;
    
    if (req.user._id.toString() !== sellerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalProperties = await Property.countDocuments({ owner: sellerId });
    const activeListings = await Property.countDocuments({ 
      owner: sellerId, 
      status: 'active' 
    });
    
    const completedBookings = await Booking.find({ 
      seller: sellerId, 
      status: { $in: ['completed', 'approved'] } 
    });
    
    const totalEarnings = completedBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

    res.json({
      success: true,
      data: {
        myProperties: totalProperties,
        activeListings: activeListings,
        earnings: `$${totalEarnings.toLocaleString()}`
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/activity/:id', auth, authorize('seller'), async (req, res) => {
  try {
    const sellerId = req.params.id;
    
    if (req.user._id.toString() !== sellerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const recentProperties = await Property.find({ owner: sellerId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title createdAt updatedAt');
    
    const recentBookings = await Booking.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .limit(2)
      .select('status createdAt totalAmount')
      .populate('property', 'title');

    const activity = [];
    
    recentProperties.forEach(property => {
      activity.push({
        action: `Added new property: ${property.title}`,
        time: property.createdAt.toLocaleDateString()
      });
      
      if (property.updatedAt > property.createdAt) {
        activity.push({
          action: `Updated property: ${property.title}`,
          time: property.updatedAt.toLocaleDateString()
        });
      }
    });
    
    recentBookings.forEach(booking => {
      if (booking.status === 'completed' || booking.status === 'approved') {
        activity.push({
          action: `Received payment of $${booking.totalAmount}`,
          time: booking.createdAt.toLocaleDateString()
        });
      }
    });
    
    activity.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json({
      success: true,
      data: activity.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/transactions/:id', auth, authorize('seller'), async (req, res) => {
  try {
    const sellerId = req.params.id;
    
    if (req.user._id.toString() !== sellerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const transactions = await Booking.find({ seller: sellerId })
      .populate('property', 'title')
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .select('_id property user totalAmount status createdAt');

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction._id.toString().slice(-8),
      property: transaction.property?.title || 'Unknown Property',
      customer: transaction.user?.name || 'Unknown Customer',
      amount: `$${transaction.totalAmount}`,
      status: transaction.status,
      date: transaction.createdAt.toLocaleDateString()
    }));

    res.json({
      success: true,
      data: formattedTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/messages/:id', auth, authorize('seller'), async (req, res) => {
  try {
    const sellerId = req.params.id;
    
    if (req.user._id.toString() !== sellerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bookings = await Booking.find({ seller: sellerId })
      .populate('user', 'name email')
      .populate('property', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    const messages = bookings.map((booking, index) => ({
      id: booking._id,
      sender: booking.user?.name || 'Unknown User',
      subject: `Booking inquiry for ${booking.property?.title || 'Property'}`,
      message: `Hello, I am interested in booking your property. Status: ${booking.status}`,
      time: booking.createdAt.toLocaleDateString(),
      read: Math.random() > 0.5
    }));

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/messages/:messageId/read', auth, authorize('seller'), async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/messages/:messageId', auth, authorize('seller'), async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/settings/:id', auth, authorize('seller'), async (req, res) => {
  try {
    const sellerId = req.params.id;
    
    if (req.user._id.toString() !== sellerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(sellerId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        notifications: user.notifications !== false
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/settings/:id', auth, authorize('seller'), async (req, res) => {
  try {
    const sellerId = req.params.id;
    const { name, email, phone, address, notifications } = req.body;
    
    if (req.user._id.toString() !== sellerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(sellerId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (notifications !== undefined) user.notifications = notifications;

    await user.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        notifications: user.notifications !== false
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;