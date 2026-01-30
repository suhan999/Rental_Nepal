const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const wishlistController = require('../controllers/wishlistController');
const { auth } = require('../middleware/auth');

router.get('/my-wishlist', auth, wishlistController.getMyWishlist);

router.post('/add-property', [
  auth,
  body('propertyId').isMongoId().withMessage('Invalid property ID'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high')
], wishlistController.addProperty);

router.delete('/remove-property/:propertyId', auth, wishlistController.removeProperty);

router.put('/update-property/:propertyId', [
  auth,
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high')
], wishlistController.updateProperty);

router.put('/settings', [
  auth,
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean')
], wishlistController.updateSettings);

router.get('/public/:userId', wishlistController.getPublicWishlist);

router.get('/check-property/:propertyId', auth, wishlistController.checkProperty);

router.get('/stats', auth, wishlistController.getStats);

module.exports = router;