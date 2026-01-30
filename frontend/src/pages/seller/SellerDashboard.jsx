import React, { useState } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Building2, Receipt, Settings, LogOut, Plus, Bell, X, ShoppingCart, Menu, Mountain, ChevronDown } from 'lucide-react';
import SellerDashboardHome from './SellerDashboardHome';
import SellerProperties from './SellerProperties';
import SellerTransactions from './SellerTransactions';
import SellerSettings from './SellerSettings';
import PurchaseRequests from './PurchaseRequests';
import LogoutHandler from '../../components/LogoutHandler';

const navLinks = [
  { to: '/seller/dashboard', label: 'Dashboard', icon: Home },
  { to: '/seller/properties', label: 'My Listings', icon: Building2 },
  { to: '/seller/purchase-requests', label: 'Rental Requests', icon: ShoppingCart },
  { to: '/seller/transactions', label: 'Transactions', icon: Receipt },
  { to: '/seller/settings', label: 'Settings', icon: Settings },
];

const initialForm = { 
  title: '', 
  propertyType: '', 
  price: '', 
  status: 'active', 
  description: '', 
  address: '', 
  city: '', 
  state: '', 
  bedrooms: 1, 
  bathrooms: 1, 
  sqft: '' 
};

const SellerDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  let userName = 'Seller';
  let userEmail = '';
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) userName = user.name;
    if (user && user.email) userEmail = user.email;
  } catch {}

  const handleOpenModal = () => {
    setForm(initialForm);
    setImage(null);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = e => setImage(e.target.files[0]);
  
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      let imageUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        
        const res = await fetch('http://localhost:4000/api/file/upload', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
          body: formData,
        });
        
        const data = await res.json();
        if (res.ok && data.file) {
          imageUrl = `/uploads/${data.file.filename}`;
        } else {
          throw new Error(data.message || 'Image upload failed');
        }
      }
      
      const propertyData = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        location: {
          address: form.address,
          city: form.city,
          state: form.state
        },
        propertyType: form.propertyType.toLowerCase(),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        sqft: Number(form.sqft),
        status: form.status,
        isAvailable: form.status === 'active'
      };
      
      if (imageUrl) {
        propertyData.images = [{
          url: imageUrl,
          description: form.title || 'Property image'
        }];
      }
      
      const res = await fetch('http://localhost:4000/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(propertyData),
      });
      
      if (res.ok) {
        alert('Property added successfully!');
        setShowModal(false);
        setForm(initialForm);
        setImage(null);
        window.location.reload();
      } else {
        const responseData = await res.json();
        if (responseData.errors) {
          alert(`Validation errors: ${responseData.errors.map(err => err.msg).join(', ')}`);
        } else {
          alert(responseData.message || 'Failed to add property.');
        }
      }
    } catch (err) {
      alert('Failed to add property.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-amber-600 via-amber-600 to-orange-700 text-white z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-amber-500/30">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">RENTAL NEPAL</h1>
              <p className="text-xs text-amber-200">Seller Panel</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-amber-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-500/30">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{userName}</p>
              <p className="text-xs text-amber-200 truncate">{userEmail}</p>
            </div>
          </div>
          <NavLink
            to="/seller/logout"
            className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-amber-100 hover:bg-red-500/20 hover:text-white transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-slate-600" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Welcome back, {userName}!</h2>
                <p className="text-sm text-slate-500">Manage your listings and transactions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Add Property Button */}
              <button
                onClick={handleOpenModal}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition"
              >
                <Plus className="w-5 h-5" />
                Add Listing
              </button>
              
              {/* Notification */}
              <button className="relative p-2.5 hover:bg-slate-100 rounded-xl transition">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-xl transition"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
                </button>
                
                {userDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-semibold text-slate-800">{userName}</p>
                        <p className="text-sm text-slate-500">{userEmail}</p>
                      </div>
                      <NavLink to="/seller/settings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700">
                        <Settings className="w-4 h-4" />
                        Settings
                      </NavLink>
                      <NavLink to="/seller/logout" className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </NavLink>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Add Button */}
          <div className="sm:hidden px-4 pb-4">
            <button
              onClick={handleOpenModal}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl"
            >
              <Plus className="w-5 h-5" />
              Add Listing
            </button>
          </div>
        </header>

        {/* Add Property Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-bold text-slate-800">Add New Listing</h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="Item title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <select
                      name="propertyType"
                      value={form.propertyType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      <option value="">Select category</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="furniture">Furniture</option>
                      <option value="electronics">Electronics</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Price (NPR/month)</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="Monthly rent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="Street address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="State/Province"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={form.bedrooms}
                      onChange={handleChange}
                      min="1"
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={form.bathrooms}
                      onChange={handleChange}
                      min="1"
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Square Feet</label>
                    <input
                      type="number"
                      name="sqft"
                      value={form.sqft}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="Area in sq ft"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="Describe your property..."
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Property Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 file:font-medium"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition"
                  >
                    Add Property
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="p-4 lg:p-8">
          <Routes>
            <Route path="/dashboard" element={<SellerDashboardHome />} />
            <Route path="/properties" element={<SellerProperties />} />
            <Route path="/purchase-requests" element={<PurchaseRequests />} />
            <Route path="/transactions" element={<SellerTransactions />} />
            <Route path="/settings" element={<SellerSettings />} />
            <Route path="/logout" element={<LogoutHandler />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<SellerDashboardHome />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;
