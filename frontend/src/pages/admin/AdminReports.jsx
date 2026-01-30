import React, { useEffect, useState } from 'react';
import { BarChart2, Building2, Users, DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminReports() {
  const [analyticsData, setAnalyticsData] = useState({
    bookingStats: [],
    propertyStats: [],
    userGrowth: []
  });
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalRevenue: 0,
    totalBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const [analyticsResponse, dashboardResponse] = await Promise.all([
          fetch(`http://localhost:4000/api/admin/analytics?period=${selectedPeriod}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }),
          fetch('http://localhost:4000/api/admin/dashboard', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          })
        ]);

        if (!analyticsResponse.ok || !dashboardResponse.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const analyticsData = await analyticsResponse.json();
        const dashboardData = await dashboardResponse.json();
        
        setAnalyticsData(analyticsData);
        setDashboardStats(dashboardData.stats);
      } catch (err) {
        setError(err.message);
        console.error('Analytics data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const formatCurrency = (amount) => {
    return `NPR ${amount?.toLocaleString() || '0'}`;
  };

  const getTotalRevenue = () => {
    return analyticsData.bookingStats.reduce((total, stat) => {
      return stat._id === 'completed' ? total + stat.revenue : total;
    }, 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-emerald-100 text-emerald-700',
      confirmed: 'bg-blue-100 text-blue-700',
      pending: 'bg-amber-100 text-amber-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          Error loading analytics data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
            <p className="text-sm text-slate-500">Track your platform performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-600 outline-none"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-violet-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
              12%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-800">{dashboardStats.totalProperties}</div>
            <div className="text-slate-500 text-sm font-medium">Total Properties</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
              8%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-800">{dashboardStats.totalUsers}</div>
            <div className="text-slate-500 text-sm font-medium">Total Users</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
              24%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(getTotalRevenue())}</div>
            <div className="text-slate-500 text-sm font-medium">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Booking Statistics */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Booking Statistics</h2>
        </div>
        {analyticsData.bookingStats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.bookingStats.map((stat, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${getStatusColor(stat._id)}`}>
                    {stat._id}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{stat.count}</div>
                <div className="text-sm text-emerald-600 font-medium">{formatCurrency(stat.revenue)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">No booking data available</div>
        )}
      </div>

      {/* Property Statistics */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-violet-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Property Types</h2>
        </div>
        {analyticsData.propertyStats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.propertyStats.map((stat, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-sm text-slate-500 font-medium capitalize mb-2">{stat._id || 'Unknown'}</div>
                <div className="text-2xl font-bold text-slate-800">{stat.count}</div>
                <div className="text-sm text-emerald-600 font-medium">Avg: {formatCurrency(stat.avgPrice || 0)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">No property data available</div>
        )}
      </div>

      {/* User Growth */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">User Growth</h2>
        </div>
        {analyticsData.userGrowth.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase">New Users</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase">New Sellers</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.userGrowth.slice(-10).map((growth, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {growth._id.year}-{String(growth._id.month).padStart(2, '0')}-{String(growth._id.day).padStart(2, '0')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg text-sm font-medium">
                        <Users className="w-3.5 h-3.5" />
                        {growth.users}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-sm font-medium">
                        <Building2 className="w-3.5 h-3.5" />
                        {growth.sellers}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">No user growth data available</div>
        )}
      </div>
    </div>
  );
}
