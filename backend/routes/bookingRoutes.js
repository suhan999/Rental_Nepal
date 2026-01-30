const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = {};
    
    if (req.user.role === 'user') {
      filter.user = req.user._id;
    } else if (req.user.role === 'seller') {
      filter.seller = req.user._id;
    }
    
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('property', 'title location price images')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      data: bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/purchase-requests', auth, authorize('seller'), async (req, res) => {
  try {
    console.log('Purchase Requests - User ID:', req.user._id);
    console.log('Purchase Requests - User Role:', req.user.role);
    
    const { page = 1, limit = 10, status } = req.query;
    console.log('Purchase Requests - Query params:', { page, limit, status });
    
    const filter = {
      seller: req.user._id,
      bookingType: 'purchase'
    };
    
    if (status) filter.status = status;
    console.log('Purchase Requests - Filter:', filter);

    const purchaseRequests = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('property', 'title location price images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    console.log('Purchase Requests - Found requests:', purchaseRequests.length);
    console.log('Purchase Requests - Requests data:', purchaseRequests);

    const total = await Booking.countDocuments(filter);
    console.log('Purchase Requests - Total count:', total);

    res.json({
      data: purchaseRequests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.log('Purchase Requests - Error occurred:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/all', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('property', 'title location price images')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      data: bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('property', 'title location price images owner')
      .populate('seller', 'name email phone');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && 
        booking.seller._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, [
  body('property').isMongoId().withMessage('Valid property ID is required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
  body('guestDetails.adults').isInt({ min: 1 }).withMessage('At least 1 adult is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { property: propertyId, checkIn, checkOut, guestDetails, specialRequests } = req.body;

    const property = await Property.findById(propertyId).populate('owner');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!property.isAvailable) {
      return res.status(400).json({ message: 'Property is not available for booking' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }

    const existingBooking = await Booking.findOne({
      property: propertyId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkIn: { $lte: checkInDate },
          checkOut: { $gt: checkInDate }
        },
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gte: checkOutDate }
        },
        {
          checkIn: { $gte: checkInDate },
          checkOut: { $lte: checkOutDate }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Property is already booked for the selected dates' });
    }

    const duration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = property.price * duration;

    const isPurchaseRequest = specialRequests && specialRequests.includes('Purchase request');
    
    const booking = new Booking({
      user: req.user._id,
      property: propertyId,
      seller: property.owner._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalAmount,
      guestDetails,
      specialRequests,
      bookingType: isPurchaseRequest ? 'purchase' : 'rental'
    });

    await booking.save();
    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'property', select: 'title location price images' },
      { path: 'seller', select: 'name email phone' }
    ]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed', 'approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('property', 'owner')
      .populate('seller', 'name')
      .populate('user', 'name');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role === 'user' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    if (req.user.role === 'seller' && booking.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    if (status === 'cancelled' && !cancellationReason) {
      return res.status(400).json({ message: 'Cancellation reason is required' });
    }

    if (status === 'rejected' && !req.body.rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    booking.status = status;
    if (cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }
    if (req.body.rejectionReason) {
      booking.rejectionReason = req.body.rejectionReason;
    }
    if (status === 'approved') {
      booking.approvalDate = new Date();
    }

    await booking.save();

    res.json({
      message: `Booking ${status} successfully`,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    if (booking.status === 'confirmed') {
      return res.status(400).json({ message: 'Cannot delete confirmed booking. Please cancel first.' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/seller/transactions', auth, authorize('seller'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    
    const filter = { seller: req.user._id };
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('property', 'title location price images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalRevenue = await Booking.aggregate([
      { $match: { seller: req.user._id, status: { $in: ['completed', 'approved'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const monthlyRevenue = await Booking.aggregate([
      { 
        $match: { 
          seller: req.user._id, 
          status: { $in: ['completed', 'approved'] },
          createdAt: { 
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
          }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const total = await Booking.countDocuments(filter);

    res.json({
      data: bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      revenue: {
        total: totalRevenue[0]?.total || 0,
        monthly: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/seller/stats', auth, authorize('seller'), async (req, res) => {
  try {
    const sellerId = req.user._id;
    
    const totalBookings = await Booking.countDocuments({ seller: sellerId });
    const pendingBookings = await Booking.countDocuments({ seller: sellerId, status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ seller: sellerId, status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ seller: sellerId, status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ seller: sellerId, status: 'cancelled' });
    
    const totalRevenue = await Booking.aggregate([
      { $match: { seller: sellerId, status: { $in: ['completed', 'approved'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const monthlyRevenue = await Booking.aggregate([
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
      .populate('user', 'name email')
      .populate('property', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/approve', auth, authorize('seller'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property', 'owner')
      .populate('user', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Purchase request not found' });
    }

    if (booking.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to approve this request' });
    }

    if (booking.bookingType !== 'purchase') {
      return res.status(400).json({ message: 'This is not a purchase request' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Purchase request has already been processed' });
    }

    booking.status = 'approved';
    booking.approvalDate = new Date();
    await booking.save();

    res.json({
      message: 'Purchase request approved successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/reject', auth, authorize('seller'), async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('property', 'owner')
      .populate('user', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Purchase request not found' });
    }

    if (booking.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    if (booking.bookingType !== 'purchase') {
      return res.status(400).json({ message: 'This is not a purchase request' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Purchase request has already been processed' });
    }

    booking.status = 'rejected';
    booking.rejectionReason = rejectionReason;
    await booking.save();

    res.json({
      message: 'Purchase request rejected successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;