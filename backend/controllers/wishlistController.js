const Wishlist = require('../models/Wishlist');
const Property = require('../models/Property');
const { validationResult } = require('express-validator');

const wishlistController = {
  getMyWishlist: async (req, res) => {
    try {
      let wishlist = await Wishlist.findOne({ user: req.user.id })
        .populate({
          path: 'properties.property',
          select: 'title description price location images propertyType bedrooms bathrooms squareFootage rating availability status'
        });
      
      if (!wishlist) {
        wishlist = new Wishlist({ user: req.user.id });
        await wishlist.save();
      }
      
      const activeProperties = wishlist.properties.filter(item => 
        item.property && item.property.status === 'active'
      );
      
      res.json({
        success: true,
        wishlist: {
          ...wishlist.toObject(),
          properties: activeProperties
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

  addProperty: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }
      
      const { propertyId, notes = '', priority = 'medium' } = req.body;
      
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ 
          success: false, 
          message: 'Property not found' 
        });
      }
      
      if (property.status !== 'active') {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot add inactive property to wishlist' 
        });
      }
      
      let wishlist = await Wishlist.findOne({ user: req.user.id });
      if (!wishlist) {
        wishlist = new Wishlist({ user: req.user.id });
      }
      
      if (wishlist.hasProperty(propertyId)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Property already in wishlist' 
        });
      }
      
      await wishlist.addProperty(propertyId, notes, priority);
      
      await wishlist.populate({
        path: 'properties.property',
        select: 'title description price location images propertyType bedrooms bathrooms squareFootage rating availability status'
      });
      
      res.status(201).json({ 
        success: true,
        data: wishlist,
        message: 'Property added to wishlist successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  removeProperty: async (req, res) => {
    try {
      const { propertyId } = req.params;
      
      const wishlist = await Wishlist.findOne({ user: req.user.id });
      if (!wishlist) {
        return res.status(404).json({ 
          success: false, 
          message: 'Wishlist not found' 
        });
      }
      
      if (!wishlist.hasProperty(propertyId)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Property not in wishlist' 
        });
      }
      
      await wishlist.removeProperty(propertyId);
      
      await wishlist.populate({
        path: 'properties.property',
        select: 'title description price location images propertyType bedrooms bathrooms squareFootage rating availability status'
      });
      
      res.json({ 
        success: true,
        data: wishlist,
        message: 'Property removed from wishlist successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  updateProperty: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }
      
      const { propertyId } = req.params;
      const { notes, priority } = req.body;
      
      const wishlist = await Wishlist.findOne({ user: req.user.id });
      if (!wishlist) {
        return res.status(404).json({ 
          success: false, 
          message: 'Wishlist not found' 
        });
      }
      
      const propertyIndex = wishlist.properties.findIndex(
        p => p.property.toString() === propertyId
      );
      
      if (propertyIndex === -1) {
        return res.status(400).json({ 
          success: false, 
          message: 'Property not in wishlist' 
        });
      }
      
      if (notes !== undefined) {
        wishlist.properties[propertyIndex].notes = notes;
      }
      if (priority !== undefined) {
        wishlist.properties[propertyIndex].priority = priority;
      }
      
      await wishlist.save();
      
      await wishlist.populate({
        path: 'properties.property',
        select: 'title description price location images propertyType bedrooms bathrooms squareFootage rating availability status'
      });
      
      res.json({ 
        success: true,
        data: wishlist,
        message: 'Property updated in wishlist successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  updateSettings: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }
      
      const { name, description, isPublic } = req.body;
      
      let wishlist = await Wishlist.findOne({ user: req.user.id });
      if (!wishlist) {
        wishlist = new Wishlist({ user: req.user.id });
      }
      
      if (name !== undefined) wishlist.name = name;
      if (description !== undefined) wishlist.description = description;
      if (isPublic !== undefined) wishlist.isPublic = isPublic;
      
      await wishlist.save();
      
      res.json({ 
        success: true,
        data: wishlist,
        message: 'Wishlist settings updated successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  getPublicWishlist: async (req, res) => {
    try {
      const { userId } = req.params;
      
      const wishlist = await Wishlist.findOne({ user: userId, isPublic: true })
        .populate('user', 'name')
        .populate({
          path: 'properties.property',
          select: 'title description price location images propertyType bedrooms bathrooms squareFootage rating availability status'
        });
      
      if (!wishlist) {
        return res.status(404).json({ 
          success: false, 
          message: 'Public wishlist not found' 
        });
      }
      
      const activeProperties = wishlist.properties.filter(item => 
        item.property && item.property.status === 'active'
      );
      
      res.json({
        success: true,
        wishlist: {
          ...wishlist.toObject(),
          properties: activeProperties
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

  checkProperty: async (req, res) => {
    try {
      const { propertyId } = req.params;
      
      const wishlist = await Wishlist.findOne({ user: req.user.id });
      const inWishlist = wishlist ? wishlist.hasProperty(propertyId) : false;
      
      res.json({ 
        success: true,
        data: { inWishlist }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  getStats: async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ user: req.user.id });
      
      if (!wishlist) {
        return res.json({
          success: true,
          data: {
            totalProperties: 0,
            priorityBreakdown: { low: 0, medium: 0, high: 0 },
            averagePrice: 0,
            priceRange: { min: 0, max: 0 }
          }
        });
      }
      
      await wishlist.populate({
        path: 'properties.property',
        select: 'price status'
      });
      
      const activeProperties = wishlist.properties.filter(item => 
        item.property && item.property.status === 'active'
      );
      
      const priorityBreakdown = {
        low: activeProperties.filter(p => p.priority === 'low').length,
        medium: activeProperties.filter(p => p.priority === 'medium').length,
        high: activeProperties.filter(p => p.priority === 'high').length
      };
      
      const prices = activeProperties
        .map(p => p.property.price)
        .filter(price => price != null);
      
      const averagePrice = prices.length > 0 ? 
        prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
      
      const priceRange = prices.length > 0 ? {
        min: Math.min(...prices),
        max: Math.max(...prices)
      } : { min: 0, max: 0 };
      
      res.json({
        success: true,
        data: {
          totalProperties: activeProperties.length,
          priorityBreakdown,
          averagePrice: Math.round(averagePrice),
          priceRange
        }
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

module.exports = wishlistController;