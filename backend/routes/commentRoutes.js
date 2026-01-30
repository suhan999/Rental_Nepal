const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

router.get('/property/:propertyId', commentController.getPropertyComments);

router.post('/property/:propertyId', [
  auth,
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Content must be between 1 and 1000 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('parentComment').optional().isMongoId().withMessage('Invalid parent comment ID')
], commentController.createComment);

router.put('/:commentId', [
  auth,
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Content must be between 1 and 1000 characters')
], commentController.updateComment);

router.delete('/:commentId', auth, commentController.deleteComment);

router.post('/:commentId/like', auth, commentController.toggleLike);

router.get('/user/my-comments', auth, commentController.getUserComments);

router.put('/:commentId/approve', auth, commentController.approveComment);

module.exports = router;