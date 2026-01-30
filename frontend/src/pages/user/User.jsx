import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Edit, Save, X, Heart, Calendar, Home, ArrowLeft, Mountain, LogOut, ChevronDown, Shield, Camera } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const User = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalFavorites: 0,
    totalSpent: 0
  });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
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

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || ''
        });
      } else {
        setError('Failed to fetch user profile');
      }
    } catch (err) {
      setError('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/users/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsEditing(false);
        setError(null);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('userLogin'));
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

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
              <Link to="/order-history" className="text-slate-600 hover:text-teal-600 font-medium transition">Orders</Link>
            </nav>
            
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    id="user-dropdown-btn"
                    onClick={() => setUserDropdownOpen(v => !v)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-teal-700">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-teal-500" />
                  </button>
                  {userDropdownOpen && (
                    <div id="user-dropdown-menu" className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      <button
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-50 text-slate-700 transition"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <UserIcon className="w-4 h-4" />
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

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-teal-600 font-medium mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">My Profile</h1>
          <p className="text-slate-500">Manage your account information and settings</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-emerald-700">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-12 relative">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="relative">
                    <div className="w-28 h-28 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border-4 border-white/30">
                      <span className="text-4xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-teal-600 hover:text-teal-700 transition">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-white mb-1">{user?.name || 'User'}</h2>
                    <p className="text-teal-100 text-lg capitalize mb-2">{user?.role || 'Member'}</p>
                    <p className="text-teal-100/80">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white px-4 py-2 rounded-xl transition"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>
              </div>

              {/* Profile Form */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                        <UserIcon className="w-5 h-5 text-teal-500" />
                        <span className="text-slate-700">{user?.name || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                      <Mail className="w-5 h-5 text-teal-500" />
                      <span className="text-slate-700">{user?.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                        <Phone className="w-5 h-5 text-teal-500" />
                        <span className="text-slate-700">{user?.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                        placeholder="Enter address"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                        <MapPin className="w-5 h-5 text-teal-500" />
                        <span className="text-slate-700">{user?.address || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-5">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl border border-teal-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-slate-700">Total Bookings</span>
                  </div>
                  <span className="text-2xl font-bold text-teal-600">{stats.totalBookings}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-slate-700">Active Bookings</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">{stats.activeBookings}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-slate-700">Favorites</span>
                  </div>
                  <span className="text-2xl font-bold text-red-500">{stats.totalFavorites}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">₹</span>
                    </div>
                    <span className="font-medium text-slate-700">Total Spent</span>
                  </div>
                  <span className="text-xl font-bold text-amber-600">₹{stats.totalSpent?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-5">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/favorites')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-teal-50 rounded-xl transition group"
                >
                  <div className="w-10 h-10 bg-slate-100 group-hover:bg-teal-100 rounded-lg flex items-center justify-center transition">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="font-medium text-slate-700">View Favorites</span>
                </button>
                
                <button
                  onClick={() => navigate('/order-history')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-teal-50 rounded-xl transition group"
                >
                  <div className="w-10 h-10 bg-slate-100 group-hover:bg-teal-100 rounded-lg flex items-center justify-center transition">
                    <Calendar className="w-5 h-5 text-teal-500" />
                  </div>
                  <span className="font-medium text-slate-700">Booking History</span>
                </button>
                
                <button
                  onClick={() => navigate('/properties')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-teal-50 rounded-xl transition group"
                >
                  <div className="w-10 h-10 bg-slate-100 group-hover:bg-teal-100 rounded-lg flex items-center justify-center transition">
                    <Home className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="font-medium text-slate-700">Browse Rentals</span>
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default User;
