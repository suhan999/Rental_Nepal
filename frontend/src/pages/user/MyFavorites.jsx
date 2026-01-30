// MyFavorites component - Displays user's favorite properties
// Allows users to view, manage, and organize their saved properties
import React, { useState, useEffect } from 'react';
import { 
  Home, MapPin, Bed, Bath, Square, Star, Heart, Search, Filter,
  Trash2, ArrowLeft, Mountain, User, LogOut, Eye, X, ChevronDown
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

// Component for managing user's favorite properties
const MyFavorites = () => {
  const [favorites, setFavorites] = useState(new Set());
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('#user-dropdown-btn') && !event.target.closest('#user-dropdown-menu')) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view your favorites');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:4000/api/wishlist/my-wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.wishlist) {
          const wishlistProperties = data.wishlist.properties || [];
          const favoriteIds = new Set(wishlistProperties.map(item => item.property._id));
          const propertiesData = wishlistProperties.map(item => ({
            id: item.property._id,
            price: item.property.price,
            location: item.property.location,
            beds: item.property.bedrooms,
            baths: item.property.bathrooms,
            sqft: item.property.sqft,
            rating: item.property.rating || 4.5,
            reviews: item.property.totalReviews || 0,
            images: item.property.images && item.property.images.length > 0 ? item.property.images : [],
            type: item.property.propertyType,
            title: item.property.title,
            description: item.property.description
          }));
          
          setFavorites(favoriteIds);
          setProperties(propertiesData);
        } else {
          setProperties([]);
          setFavorites(new Set());
        }
      } else {
        throw new Error('Failed to fetch wishlist');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError('Failed to load favorites. Please try again.');
      setProperties([]);
      setFavorites(new Set());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromFavorites = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to manage favorites');
        return;
      }

      const response = await fetch(`http://localhost:4000/api/wishlist/remove-property/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const newFavorites = new Set(favorites);
        newFavorites.delete(propertyId);
        setFavorites(newFavorites);
        setProperties(properties.filter(property => property.id !== propertyId));
      } else {
        throw new Error('Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setError('Failed to remove from favorites. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('userLogin'));
    navigate('/login');
  };

  const formatPrice = (price) => `NPR ${price?.toLocaleString() || '0'}`;

  const getPropertyImage = (property) => {
    if (property.images && property.images.length > 0) {
      const imageUrl = property.images[0]?.url || property.images[0];
      return imageUrl ? `http://localhost:4000${imageUrl}` : '/house1.png';
    }
    return '/house1.png';
  };

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'apartment', label: 'Apartments' },
    { value: 'house', label: 'Houses' },
    { value: 'villa', label: 'Villas' }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesFilter = selectedFilter === 'all' || property.type === selectedFilter;
    const locationString = typeof property.location === 'object' 
      ? `${property.location.address || ''} ${property.location.city || ''}`.trim()
      : (property.location || '');
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         locationString.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">RENTAL NEPAL</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/properties" className="text-slate-600 hover:text-teal-600 font-medium transition">Rentals</Link>
              <Link to="/favorites" className="text-teal-600 font-medium">Favorites</Link>
              <Link to="/order-history" className="text-slate-600 hover:text-teal-600 font-medium transition">Orders</Link>
            </nav>
            
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    id="user-dropdown-btn"
                    onClick={() => setUserDropdownOpen(v => !v)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-700">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>
                  {userDropdownOpen && (
                    <div id="user-dropdown-menu" className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      <button
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-50 text-slate-700 transition"
                        onClick={() => { setUserDropdownOpen(false); navigate('/profile'); }}
                      >
                        <User className="w-4 h-4" />
                        View Profile
                      </button>
                      <button
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-50 text-red-600 border-t border-slate-100 transition"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-teal-600 font-medium mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">My Favorites</h1>
              <p className="text-slate-500">
                {favorites.size} {favorites.size === 1 ? 'property' : 'properties'} saved
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500 fill-current" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-medium">Loading your favorites...</p>
          </div>
        )}

        {/* Search and Filter */}
        {!loading && properties.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search your favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`px-5 py-3.5 rounded-xl font-medium whitespace-nowrap transition ${
                    selectedFilter === option.value
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/25'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-500 hover:text-teal-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && filteredProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative h-56 bg-slate-100">
                  <img 
                    src={getPropertyImage(property)} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <button
                    onClick={() => removeFromFavorites(property.id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm font-semibold text-slate-700">{property.rating?.toFixed(1)}</span>
                  </div>

                  <span className="absolute bottom-3 left-3 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-semibold capitalize">
                    {property.type}
                  </span>
                </div>
                
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-slate-800 mb-2 line-clamp-1">{property.title}</h3>
                  
                  <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    <span className="line-clamp-1">
                      {typeof property.location === 'object' 
                        ? `${property.location.city || ''}, ${property.location.state || ''}`.replace(/^,\s*|,\s*$/g, '')
                        : property.location || 'Location not specified'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-600 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4 text-slate-400" />
                      <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4 text-slate-400" />
                      <span>{property.baths}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4 text-slate-400" />
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-xl font-bold text-teal-600">{formatPrice(property.price)}</span>
                      <span className="text-slate-400 text-sm">/month</span>
                    </div>
                    <button 
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-gradient-to-r hover:from-teal-500 hover:to-emerald-500 text-slate-600 hover:text-white rounded-lg font-medium transition"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State - No favorites */}
        {!loading && favorites.size === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No Favorites Yet</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Start exploring rentals and save your favorites by clicking the heart icon. 
              Your saved items will appear here.
            </p>
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-teal-500/25 hover:scale-105 transition-all"
            >
              <Home className="w-5 h-5 mr-2" />
              Explore Rentals
            </button>
          </div>
        )}

        {/* Empty State - No matches */}
        {!loading && favorites.size > 0 && filteredProperties.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No Matching Favorites</h3>
            <p className="text-slate-500 mb-8">
              No favorites match your search or filter criteria.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedFilter('all'); }}
              className="inline-flex items-center px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-semibold transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">RENTAL NEPAL</span>
            </div>
            <div className="text-slate-400 text-sm text-center">
              44800, Bhaktapur, Srijana Nagar, Kathmandu Valley, Nepal
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Rental Nepal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyFavorites;
