// PropertyListing component - Displays all available properties with search and filter options
// Users can browse, search, and filter properties by various criteria
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Home, MapPin, Bed, Bath, Square, Star, Search, Filter, 
  Heart, Eye, ChevronLeft, ChevronRight, Building2, 
  ArrowLeft, SlidersHorizontal, User
} from 'lucide-react';

// Component for displaying property listings with advanced search and filtering
const PropertyListing = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const fetchProperties = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });

      if (filters.type) queryParams.append('type', filters.type);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms);
      if (filters.location || searchTerm) {
        queryParams.append('location', filters.location || searchTerm);
      }

      const response = await fetch(`/api/properties?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setProperties(data.data);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        setError('Failed to fetch properties');
      }
    } catch (err) {
      setError('Error loading properties: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:4000/api/wishlist/my-wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const favoriteIds = new Set(data.data.map(item => item.property._id));
        setFavorites(favoriteIds);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchFavorites();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchProperties(1);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filters]);

  useEffect(() => {
    const updateUser = () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    };
    
    updateUser();
    window.addEventListener('userLogin', updateUser);
    return () => window.removeEventListener('userLogin', updateUser);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('#user-dropdown-btn') && !e.target.closest('#user-dropdown-menu')) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userDropdownOpen]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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

  const toggleFavorite = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const isFavorite = favorites.has(propertyId);
      const endpoint = isFavorite 
        ? `/api/wishlist/remove-property/${propertyId}`
        : '/api/wishlist/add-property';
      
      const method = isFavorite ? 'DELETE' : 'POST';
      const body = isFavorite ? undefined : JSON.stringify({ propertyId });

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body
      });

      if (response.ok) {
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (isFavorite) {
            newFavorites.delete(propertyId);
          } else {
            newFavorites.add(propertyId);
          }
          return newFavorites;
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const nextImage = (propertyId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (propertyId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getPropertyImage = (property) => {
    if (property.images && property.images.length > 0) {
      const currentIndex = currentImageIndex[property._id] || 0;
      return property.images[currentIndex].url || '/house1.png';
    }
    return '/house1.png';
  };

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rentals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              RENTAL NEPAL
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6 text-gray-700 text-sm font-medium">
              <Link to="/" className="hover:text-blue-600 transition">Home</Link>
              <Link to="/favorites" className="hover:text-blue-600 transition">Favorites</Link>
              <Link to="/order-history" className="hover:text-blue-600 transition">Bookings</Link>
              <Link to="/profile" className="hover:text-blue-600 transition">Profile</Link>
            </nav>

            {user ? (
              <div className="relative">
                <button
                  id="user-dropdown-btn"
                  onClick={() => setUserDropdownOpen(v => !v)}
                  className="flex items-center space-x-2 text-blue-700 font-semibold px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </button>
                {userDropdownOpen && (
                  <div id="user-dropdown-menu" className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700"
                      onClick={() => { setUserDropdownOpen(false); navigate('/profile'); }}
                    >
                      View Profile
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 border-t border-gray-100"
                      onClick={() => { 
                        setUserDropdownOpen(false); 
                        localStorage.removeItem('user'); 
                        localStorage.removeItem('token'); 
                        window.dispatchEvent(new Event('userLogin')); 
                        navigate('/login'); 
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-blue-600 hover:text-blue-700 transition font-medium">
                Login
              </Link>
            )}

            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Rent <span className="text-teal-600">Everything You Need</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Discover houses, furniture, electronics and more for rent
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by location, city, or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">All Categories</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="furniture">Furniture</option>
                <option value="electronics">Electronics</option>
                <option value="other">Other</option>
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${properties.length} properties found`}
          </p>
          {totalPages > 1 && (
            <p className="text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Property Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {properties.map((property) => {
              const currentIndex = currentImageIndex[property._id] || 0;
              const hasMultipleImages = property.images && property.images.length > 1;
              
              return (
                <div key={property._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getPropertyImage(property)}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Image Navigation */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={() => prevImage(property._id, property.images.length)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => nextImage(property._id, property.images.length)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          {property.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                index === currentIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(property._id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          favorites.has(property._id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </button>

                    {/* Property Type Badge */}
                    <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold capitalize">
                      {property.propertyType}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                        {property.title}
                      </h3>
                      {property.rating > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-gray-600">{property.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm line-clamp-1">
                        {property.location.address}, {property.location.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        <span>{property.sqft} sqft</span>
                      </div>
                    </div>

                    {/* Features */}
                    {property.features && property.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {property.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {property.features.length > 3 && (
                          <span className="text-blue-600 text-xs">+{property.features.length - 3} more</span>
                        )}
                      </div>
                    )}

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(property.price)}
                        </span>
                        <span className="text-gray-500 text-sm">/month</span>
                        {property.originalPrice && property.originalPrice > property.price && (
                          <div className="text-sm text-gray-400 line-through">
                            {formatPrice(property.originalPrice)}
                          </div>
                        )}
                      </div>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                        Available
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/property/${property._id}`)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/booking/${property._id}`)}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h3>
              <p className="text-gray-500 mb-4">
                No properties match your current search criteria.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            </div>
          )
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => fetchProperties(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={page}
                  onClick={() => fetchProperties(page)}
                  className={`px-4 py-2 rounded-lg transition ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => fetchProperties(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListing;