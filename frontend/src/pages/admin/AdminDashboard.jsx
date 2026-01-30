// AdminDashboard component - Main admin dashboard for site administration
// Provides access to user management, property moderation, and analytics
import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { Home, Building2, Users, Receipt, User, LogOut, Mountain, Menu, X, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboardHome from './AdminDashboardHome';
import AdminProperties from './AdminProperties';
import AdminUsers from './AdminUsers';
import AdminTransactions from './AdminTransactions';
import AdminProfile from './AdminProfile';

// Navigation links for admin dashboard
const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { to: '/admin/properties', label: 'Listings', icon: Building2 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/transactions', label: 'Transactions', icon: Receipt },
  { to: '/admin/profile', label: 'Profile', icon: User },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-gradient-to-b from-violet-900 via-purple-900 to-violet-950 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-black text-white">RENTAL NEPAL</span>
                <div className="text-[9px] text-violet-300 font-medium tracking-widest uppercase">Admin Panel</div>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="text-white font-bold">{currentUser?.name || 'Admin'}</div>
              <div className="text-violet-300 text-sm">Administrator</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-violet-900 shadow-lg shadow-white/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 font-medium transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-600 hover:text-slate-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-sm text-slate-500">Manage your rental platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-xl transition"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {currentUser?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold text-slate-700">{currentUser?.name || 'Admin'}</div>
                    <div className="text-xs text-slate-500">{currentUser?.email || 'admin@rentalnepal.com'}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <NavLink 
                      to="/admin/profile" 
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </NavLink>
                    <hr className="my-2 border-slate-100" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Routes>
            <Route path="/dashboard" element={<AdminDashboardHome />} />
            <Route path="/properties" element={<AdminProperties />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/transactions" element={<AdminTransactions />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="*" element={<AdminDashboardHome />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
