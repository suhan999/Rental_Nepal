const Comment = require('../models/Comment');
const Property = require('../models/Property');
const { validationResult } = require('express-validator');

const commentController = {
  getPropertyComments: async (req, res) => {
    try {
      const { propertyId } = req.params;
      const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
      
      const skip = (page - 1) * limit;
      const sortOrder = order === 'asc' ? 1 : -1;
      
      const comments = await Comment.find({ 
        property: propertyId, 
        parentComment: null,
        isApproved: true 
      })
      .populate('user', 'name profileImage')
      .populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: 'name profileImage'
        }
      })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));
      
      const total = await Comment.countDocuments({ 
        property: propertyId, 
        parentComment: null,
        isApproved: true 
      });
      
      res.json({
        success: true,
        data: {
          comments,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  createComment: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }
      
      const { propertyId } = req.params;
      const { content, rating, parentComment } = req.body;
      
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ 
          success: false, 
          message: 'Property not found' 
        });
      }
      
      if (parentComment) {
        const parentCommentDoc = await Comment.findById(parentComment);
        if (!parentCommentDoc) {
          return res.status(404).json({ 
            success: false, 
            message: 'Parent comment not found' 
          });
        }
      }
      
      const comment = new Comment({
        user: req.user.id,
        property: propertyId,
        content,
        rating: parentComment ? undefined : rating,
        parentComment: parentComment || null
      });
      
      await comment.save();
      
      if (parentComment) {
        await Comment.findByIdAndUpdate(parentComment, {
          $push: { replies: comment._id }
        });
      } else {
        await Property.findByIdAndUpdate(propertyId, {
          $push: { comments: comment._id }
        });
      }
      
      await comment.populate('user', 'name profileImage');
      
      res.status(201).json({
        success: true,
        data: comment,
        message: 'Comment created successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  updateComment: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }
      
      const { commentId } = req.params;
      const { content } = req.body;
      
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ 
          success: false, 
          message: 'Comment not found' 
        });
      }
      
      if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to edit this comment' 
        });
      }
      
      comment.content = content;
      comment.isEdited = true;
      comment.editedAt = new Date();
      
      await comment.save();
      await comment.populate('user', 'name profileImage');
      
      res.json({
        success: true,
        data: comment,
        message: 'Comment updated successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ 
          success: false, 
          message: 'Comment not found' 
        });
      }
      
      if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to delete this comment' 
        });
      }
      
      if (comment.parentComment) {
        await Comment.findByIdAndUpdate(comment.parentComment, {
          $pull: { replies: commentId }
        });
      } else {
        await Property.findByIdAndUpdate(comment.property, {
          $pull: { comments: commentId }
        });
      }
      
      await Comment.findByIdAndDelete(commentId);
      await Comment.deleteMany({ parentComment: commentId });
      
      res.json({ 
        success: true, 
        message: 'Comment deleted successfully' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  toggleLike: async (req, res) => {
    try {
      const { commentId } = req.params;
      
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ 
          success: false, 
          message: 'Comment not found' 
        });
      }
      
      const isLiked = comment.likes.includes(req.user.id);
      
      if (isLiked) {
        comment.likes = comment.likes.filter(like => like.toString() !== req.user.id);
      } else {
        comment.likes.push(req.user.id);
      }
      
      await comment.save();
      
      res.json({ 
        success: true,
        data: {
          liked: !isLiked, 
          likeCount: comment.getLikeCount()
        },
        message: isLiked ? 'Comment unliked' : 'Comment liked'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  getUserComments: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      
      const comments = await Comment.find({ user: req.user.id })
      .populate('property', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
      const total = await Comment.countDocuments({ user: req.user.id });
      
      res.json({
        success: true,
        data: {
          comments,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  approveComment: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Admin access required' 
        });
      }
      
      const { commentId } = req.params;
      const { isApproved } = req.body;
      
      const comment = await Comment.findByIdAndUpdate(
        commentId,
        { isApproved },
        { new: true }
      ).populate('user', 'name profileImage');
      
      if (!comment) {
        return res.status(404).json({ 
          success: false, 
          message: 'Comment not found' 
        });
      }
      
      res.json({
        success: true,
        data: comment,
        message: `Comment ${isApproved ? 'approved' : 'disapproved'} successfully`
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  }
};

module.exports = commentController;