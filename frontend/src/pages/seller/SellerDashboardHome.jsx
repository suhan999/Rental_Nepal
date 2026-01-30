import React, { useState, useEffect } from 'react';
import { Building2, DollarSign, TrendingUp, Activity, ArrowUpRight, Eye, Clock } from 'lucide-react';

export default function SellerDashboardHome() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    totalEarnings: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id || !token) {
        setLoading(false);
        return;
      }

      try {
        const statsResponse = await fetch(`/api/seller/stats/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.success) {
            setStats({
              totalProperties: statsData.data.totalProperties || 0,
              activeListings: statsData.data.activeListings || 0,
              totalEarnings: statsData.data.totalEarnings || 0
            });
          }
        }

        const activityResponse = await fetch(`/api/seller/activity/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          if (activityData.success) {
            setRecentActivity(activityData.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id, token]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-6 w-16 bg-slate-200 rounded"></div>
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: 'Total Listings',
      value: stats.totalProperties,
      icon: Building2,
      gradient: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      trend: '+12%'
    },
    {
      label: 'Active Listings',
      value: stats.activeListings,
      icon: Eye,
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      trend: '+8%'
    },
    {
      label: 'Total Earnings',
      value: `NPR ${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
      trend: '+24%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome to Your Dashboard!</h1>
          <p className="text-amber-100 text-lg">Manage your listings and track your earnings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.trend}
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
              <div className="text-slate-500 font-medium">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Earnings Chart Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Earnings Overview</h2>
            <p className="text-sm text-slate-500">Your monthly revenue trends</p>
          </div>
        </div>
        <div className="h-48 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center border border-amber-100">
          <div className="text-center">
            <Activity className="w-12 h-12 text-amber-300 mx-auto mb-2" />
            <p className="text-amber-600 font-medium">Chart Coming Soon</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
            <p className="text-sm text-slate-500">Latest updates on your properties</p>
          </div>
        </div>
        
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-slate-500" />
                  </div>
                  <span className="text-slate-700">{item.action}</span>
                </div>
                <span className="text-sm text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No recent activity</p>
            <p className="text-sm text-slate-400">Your activity will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
