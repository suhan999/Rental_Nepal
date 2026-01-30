import React, { useEffect, useState } from 'react';
import { Home, Calendar, MapPin, Bed, Bath, Square, Eye, Mountain, User, LogOut, ChevronDown, ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const statusConfig = {
  pending: { 
    bg: 'bg-amber-50', 
    text: 'text-amber-700', 
    border: 'border-amber-200',
    icon: Clock,
    label: 'Pending'
  },
  confirmed: { 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700', 
    border: 'border-emerald-200',
    icon: CheckCircle,
    label: 'Confirmed'
  },
  approved: { 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700', 
    border: 'border-emerald-200',
    icon: CheckCircle,
    label: 'Approved'
  },
  cancelled: { 
    bg: 'bg-red-50', 
    text: 'text-red-700', 
    border: 'border-red-200',
    icon: XCircle,
    label: 'Cancelled'
  },
  rejected: { 
    bg: 'bg-red-50', 
    text: 'text-red-700', 
    border: 'border-red-200',
    icon: XCircle,
    label: 'Rejected'
  },
  completed: { 
    bg: 'bg-teal-50', 
    text: 'text-teal-700', 
    border: 'border-teal-200',
    icon: CheckCircle,
    label: 'Completed'
  }
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        if (data.data) {
          setBookings(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('userLogin'));
    navigate('/login');
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const getPropertyImage = (booking) => {
    if (booking.property?.images?.[0]?.url) {
      return `http://localhost:4000${booking.property.images[0].url}`;
    }
    if (booking.property?.images?.[0]) {
      return `http://localhost:4000${booking.property.images[0]}`;
    }
    return '/house1.png';
  };

  const getLocationString = (location) => {
    if (typeof location === 'object') {
      const parts = [location.address, location.city, location.state].filter(Boolean);
      return parts.join(', ') || 'Location not available';
    }
    return location || 'Location not available';
  };

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
              <Link to="/favorites" className="text-slate-600 hover:text-teal-600 font-medium transition">Favorites</Link>
              <Link to="/order-history" className="text-teal-600 font-medium">Orders</Link>
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
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">My Booking History</h1>
          <p className="text-slate-500">View and manage all your property bookings</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-medium">Loading your bookings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Error Loading Bookings</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Bookings Grid */}
        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">No Bookings Yet</h3>
                <p className="text-slate-500 mb-8">You haven't made any rental bookings yet. Start exploring!</p>
                <button
                  onClick={() => navigate('/properties')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-teal-500/25 hover:scale-105 transition-all"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Browse Rentals
                </button>
              </div>
            ) : (
              bookings.map(booking => {
                const status = statusConfig[booking.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                
                return (
                  <div
                    key={booking._id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-slate-100">
                      <img
                        src={getPropertyImage(booking)}
                        alt={booking.property?.title || 'Property'}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${status.bg} ${status.text} border ${status.border}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <h2 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">
                        {booking.property?.title || `Property #${booking.property?._id}`}
                      </h2>
                      
                      <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                        <MapPin className="w-4 h-4 text-teal-500" />
                        <span className="line-clamp-1">{getLocationString(booking.property?.location)}</span>
                      </div>
                      
                      {/* Property Details */}
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-slate-400" />
                          <span>{booking.property?.bedrooms || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4 text-slate-400" />
                          <span>{booking.property?.bathrooms || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="w-4 h-4 text-slate-400" />
                          <span>{booking.property?.sqft || '-'} sqft</span>
                        </div>
                      </div>
                      
                      {/* Booking Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Booked on</span>
                          <span className="font-medium text-slate-700">{formatDate(booking.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Check-in</span>
                          <span className="font-medium text-emerald-600">{formatDate(booking.checkIn)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Check-out</span>
                          <span className="font-medium text-red-600">{formatDate(booking.checkOut)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Total Amount</span>
                          <span className="font-bold text-teal-600">NPR {booking.totalAmount?.toLocaleString()}</span>
                        </div>
                        {booking.bookingType && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Type</span>
                            <span className="font-medium text-slate-700 capitalize">{booking.bookingType}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Rejection Reason */}
                      {booking.rejectionReason && (
                        <div className="bg-red-50 rounded-lg p-3 mb-4">
                          <p className="text-xs text-red-600 font-medium mb-1">Rejection Reason:</p>
                          <p className="text-sm text-red-700">{booking.rejectionReason}</p>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button 
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition"
                          onClick={() => navigate(`/property/${booking.property?._id}`)}
                        >
                          <Eye className="w-4 h-4" />
                          View Property
                        </button>
                        {(booking.status === 'confirmed' || (booking.bookingType === 'purchase' && booking.status === 'pending')) && (
                          <button className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition">
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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

export default OrderHistory;
