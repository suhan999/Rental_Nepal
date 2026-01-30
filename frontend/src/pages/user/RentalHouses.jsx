import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Heart, Search, Filter, MapPin, Bed, Bath, Car, Star, ShoppingCart, Eye, Mountain, LogOut, User, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RentalHouses = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    location: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    fetchProperties();
    fetchWishlist();
  }, [currentPage, searchTerm, filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 12,
        search: searchTerm,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`http://localhost:4000/api/properties?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setProperties(data.data || []);
        setTotalPages(data.totalPages || 1);
        
        const imageIndexes = {};
        data.data?.forEach(property => {
          imageIndexes[property._id] = 0;
        });
        setCurrentImageIndex(imageIndexes);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/wishlist/my-wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.wishlist) {
        setWishlist(data.wishlist.properties.map(p => p.property._id));
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const toggleWishlist = async (propertyId) => {
    try {
      const isInWishlist = wishlist.includes(propertyId);
      const url = isInWishlist 
        ? `http://localhost:4000/api/wishlist/remove-property/${propertyId}`
        : 'http://localhost:4000/api/wishlist/add-property';
      
      const method = isInWishlist ? 'DELETE' : 'POST';
      const body = isInWishlist ? undefined : JSON.stringify({ propertyId });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body
      });
      
      if (response.ok) {
        setWishlist(prev => 
          isInWishlist 
            ? prev.filter(id => id !== propertyId)
            : [...prev, propertyId]
        );
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const handlePurchase = async (propertyId) => {
    try {
      const checkInDate = new Date();
      checkInDate.setDate(checkInDate.getDate() + 1);
      const checkOutDate = new Date();
      checkOutDate.setDate(checkOutDate.getDate() + 8);
      
      const response = await fetch('http://localhost:4000/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          property: propertyId,
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          guestDetails: {
            adults: 1,
            children: 0
          },
          specialRequests: 'Purchase request - awaiting seller approval'
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('Purchase request sent successfully! Awaiting seller approval.');
      } else {
        alert(data.message || 'Failed to send purchase request');
      }
    } catch (error) {
      console.error('Error creating purchase request:', error);
      alert('Failed to send purchase request');
    }
  };

  const nextImage = (propertyId, imagesLength) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] + 1) % imagesLength
    }));
  };

  const prevImage = (propertyId, imagesLength) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: prev[propertyId] === 0 ? imagesLength - 1 : prev[propertyId] - 1
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      location: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg shadow-slate-200/50 py-4 sticky top-0 z-30 border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">RENTAL NEPAL</span>
              <div className="text-[9px] text-teal-600 font-medium tracking-widest uppercase">Rent Everything You Need</div>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-2">
            <Link 
              to="/user/favorites" 
              className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-300 font-medium"
            >
              <Heart className="w-5 h-5" /> 
              <span className="hidden sm:inline">Favorites</span>
            </Link>
            <Link 
              to="/user/order-history" 
              className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-300 font-medium"
            >
              <ShoppingCart className="w-5 h-5" /> 
              <span className="hidden sm:inline">Orders</span>
            </Link>
            <Link 
              to="/user/profile" 
              className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-300 font-medium"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 font-semibold"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-100 mb-4">
            <Home className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-semibold text-teal-700">Rental Listings</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-2">Browse Rentals</h1>
          <p className="text-slate-500 text-lg">Find houses, furniture, electronics and more available for rent across Nepal</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by location, features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-slate-700 font-medium"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-2xl transition-all duration-300 flex items-center gap-2 font-semibold ${
                showFilters 
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' 
                  : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              <Filter className="w-5 h-5" /> 
              Filters
              {Object.values(filters).some(v => v) && (
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Filter Rentals</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-slate-700 font-medium"
                >
                  <option value="">All Categories</option>
                  <option value="house">Houses</option>
                  <option value="apartment">Apartments</option>
                  <option value="furniture">Furniture</option>
                  <option value="electronics">Electronics</option>
                  <option value="other">Others</option>
                </select>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-slate-700 font-medium"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-slate-700 font-medium"
                />
                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-slate-700 font-medium"
                >
                  <option value="">Any Bedrooms</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-slate-700 font-medium"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-teal-200 rounded-full animate-spin border-t-teal-500"></div>
              <Mountain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-teal-500" />
            </div>
            <p className="mt-4 text-slate-500 font-medium">Loading rentals...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {properties.map((property) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 border border-slate-100 hover:border-teal-200"
                >
                  {/* Image Section */}
                  <div className="relative h-52 overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <>
                        <img
                          src={`http://localhost:4000${property.images[currentImageIndex[property._id] || 0]?.url || (typeof property.images[currentImageIndex[property._id] || 0] === 'string' ? property.images[currentImageIndex[property._id] || 0] : '')}`}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {property.images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); prevImage(property._id, property.images.length); }}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-slate-700 p-2 rounded-xl hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); nextImage(property._id, property.images.length); }}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-slate-700 p-2 rounded-xl hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                              {property.images.map((_, idx) => (
                                <div 
                                  key={idx} 
                                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    idx === (currentImageIndex[property._id] || 0) 
                                      ? 'bg-white w-4' 
                                      : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <Home className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(property._id); }}
                      className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          wishlist.includes(property._id)
                            ? 'text-red-500 fill-red-500'
                            : 'text-slate-500'
                        }`}
                      />
                    </button>
                    
                    {/* Availability Badge */}
                    {property.isAvailable && (
                      <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg">
                        Available
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1">{property.title}</h3>
                    
                    <div className="flex items-center text-slate-500 mb-3">
                      <MapPin className="w-4 h-4 mr-1.5 text-teal-500 flex-shrink-0" />
                      <span className="text-sm line-clamp-1 font-medium">
                        {property.location && typeof property.location === 'object' 
                          ? `${property.location.address || ''}, ${property.location.city || ''}, ${property.location.state || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',') 
                          : property.location || 'Location not specified'
                        }
                      </span>
                    </div>
                    
                    {/* Property Features */}
                    <div className="flex items-center justify-between mb-4 py-3 px-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center text-slate-600">
                        <Bed className="w-4 h-4 mr-1.5 text-teal-500" />
                        <span className="text-sm font-semibold">{property.bedrooms}</span>
                      </div>
                      <div className="w-px h-4 bg-slate-200"></div>
                      <div className="flex items-center text-slate-600">
                        <Bath className="w-4 h-4 mr-1.5 text-teal-500" />
                        <span className="text-sm font-semibold">{property.bathrooms}</span>
                      </div>
                      {property.parking && (
                        <>
                          <div className="w-px h-4 bg-slate-200"></div>
                          <div className="flex items-center text-slate-600">
                            <Car className="w-4 h-4 mr-1.5 text-teal-500" />
                            <span className="text-sm font-semibold">Yes</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Price & Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-black text-teal-600">
                          {formatPrice(property.price)}
                        </div>
                        <span className="text-xs text-slate-400 font-medium">/month</span>
                      </div>
                      {property.rating && (
                        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-bold text-amber-700">{property.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/property/${property._id}`}
                        className="flex-1 bg-slate-100 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-200 transition-all duration-300 text-center text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> View
                      </Link>
                      <button
                        onClick={() => handlePurchase(property._id)}
                        disabled={!property.isAvailable}
                        className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 text-sm font-semibold disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" /> Purchase
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {properties.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Mountain className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-600 mb-2">No rentals found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your search criteria or filters</p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-3 bg-white text-slate-700 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold border border-slate-200 flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    const pageNum = currentPage <= 3 
                      ? idx + 1 
                      : currentPage >= totalPages - 2 
                        ? totalPages - 4 + idx 
                        : currentPage - 2 + idx;
                    
                    if (pageNum < 1 || pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-11 h-11 rounded-xl font-semibold transition-all duration-300 ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                            : 'bg-white text-slate-600 hover:bg-teal-50 border border-slate-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-5 py-3 bg-white text-slate-700 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold border border-slate-200 flex items-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">RENTAL NEPAL</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2025 Rental Nepal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RentalHouses;
