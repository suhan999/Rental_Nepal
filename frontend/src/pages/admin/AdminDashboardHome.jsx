import React, { useEffect, useState } from 'react';
import { Building2, Users, Receipt, DollarSign, Activity, User, Home, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminDashboardHome() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalProperties: 0,
      totalBookings: 0,
      totalRevenue: 0
    },
    recentBookings: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const stats = [
    { 
      label: 'Total Listings', 
      value: dashboardData.stats.totalProperties, 
      icon: Building2,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
      change: '+12%',
      positive: true
    },
    { 
      label: 'Total Users', 
      value: dashboardData.stats.totalUsers, 
      icon: Users,
      color: 'from-teal-500 to-emerald-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      change: '+8%',
      positive: true
    },
    { 
      label: 'Total Rentals', 
      value: dashboardData.stats.totalBookings, 
      icon: Receipt,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      change: '+23%',
      positive: true
    },
    { 
      label: 'Total Revenue', 
      value: formatCurrency(dashboardData.stats.totalRevenue), 
      icon: DollarSign,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      change: '+15%',
      positive: true
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse border border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
              </div>
              <div className="h-8 bg-slate-200 rounded mb-2 w-24"></div>
              <div className="h-4 bg-slate-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Error Loading Dashboard</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-violet-500/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back, Admin! 👋</h1>
            <p className="text-violet-100">Here's what's happening with your platform today.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
              <div className="text-sm text-violet-100">Today</div>
              <div className="font-bold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${stat.positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
            <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Platform Activity</h2>
              <p className="text-sm text-slate-500">Monthly overview</p>
            </div>
          </div>
          <select className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
        <div className="h-64 bg-gradient-to-br from-slate-50 to-violet-50 rounded-xl flex items-center justify-center border border-slate-100">
          <div className="text-center">
            <Activity className="w-12 h-12 text-violet-300 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">Chart visualization coming soon</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Recent Bookings</h2>
              </div>
              <span className="text-sm text-violet-600 font-medium cursor-pointer hover:underline">View all</span>
            </div>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {dashboardData.recentBookings.length > 0 ? (
              dashboardData.recentBookings.map((booking, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {booking.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {booking.user?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-slate-500">
                          {booking.property?.title || 'Property'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-emerald-600">{formatCurrency(booking.totalAmount)}</div>
                      <div className="text-xs text-slate-400">{formatTimeAgo(booking.createdAt)}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Home className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400">No recent bookings</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">New Users</h2>
              </div>
              <span className="text-sm text-violet-600 font-medium cursor-pointer hover:underline">View all</span>
            </div>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {dashboardData.recentUsers.length > 0 ? (
              dashboardData.recentUsers.map((user, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'seller' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role}
                      </span>
                      <div className="text-xs text-slate-400 mt-1">{formatTimeAgo(user.createdAt)}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <User className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400">No recent users</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
