import React, { useState, useEffect } from 'react';
import { Building2, Search, Edit2, Trash2, Eye, MapPin, Bed, Bath, Square, X } from 'lucide-react';

export default function SellerProperties() {
  const [search, setSearch] = useState('');
  const [properties, setProperties] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user?.id || !token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/properties?userId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setProperties(data.data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [user?.id, token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        setProperties(props => props.filter(p => p._id !== id));
        alert('Listing deleted successfully!');
      } else {
        alert('Failed to delete listing.');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete listing.');
    }
  };

  const openEditModal = (property) => {
    setEditForm(property);
    setEditModal(true);
  };
  
  const closeEditModal = () => setEditModal(false);
  
  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  
  const handleEditSubmit = async e => {
    e.preventDefault();
    
    try {
      const res = await fetch(`/api/properties/${editForm._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm),
      });
      
      if (res.ok) {
        setProperties(props => props.map(p => p._id === editForm._id ? { ...p, ...editForm } : p));
        closeEditModal();
        alert('Listing updated successfully!');
      } else {
        alert('Failed to update listing.');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update listing.');
    }
  };

  const filtered = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const total = properties.length;
  const active = properties.filter(p => p.status === 'active').length;
  const inactive = total - active;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">My Listings</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Listings</h1>
            <p className="text-sm text-slate-500">Manage all your rental listings</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white w-64 text-sm"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="text-2xl font-bold text-slate-800">{total}</div>
          <div className="text-sm text-slate-500">Total</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="text-2xl font-bold text-emerald-600">{active}</div>
          <div className="text-sm text-slate-500">Active</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="text-2xl font-bold text-amber-600">{inactive}</div>
          <div className="text-sm text-slate-500">Inactive</div>
        </div>
      </div>

      {/* Properties Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <div key={property._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition group">
              {/* Image */}
              <div className="relative h-48 bg-slate-100">
                {property.images?.[0]?.url ? (
                  <img
                    src={`http://localhost:4000${property.images[0].url}`}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-slate-300" />
                  </div>
                )}
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                  property.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  {property.status}
                </span>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg text-slate-800 mb-2 line-clamp-1">{property.title}</h3>
                
                <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{property.location?.city || 'N/A'}, {property.location?.state || ''}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {property.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-4 h-4" />
                    {property.sqft} sqft
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-xl font-bold text-amber-600">
                    NPR {property.price?.toLocaleString()}
                    <span className="text-sm font-normal text-slate-500">/mo</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(property)}
                      className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No properties found</h3>
          <p className="text-slate-500">Add your first property to get started</p>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800">Edit Property</h2>
              <button onClick={closeEditModal} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Property Type</label>
                  <select
                    name="propertyType"
                    value={editForm.propertyType || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price (NPR)</label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={editForm.status || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
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
                    value={editForm.bedrooms || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={editForm.bathrooms || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Square Feet</label>
                  <input
                    type="number"
                    name="sqft"
                    value={editForm.sqft || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={editForm.location?.address || ''}
                    onChange={(e) => setEditForm({...editForm, location: {...editForm.location, address: e.target.value}})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <input
                    type="text"
                    value={editForm.location?.city || ''}
                    onChange={(e) => setEditForm({...editForm, location: {...editForm.location, city: e.target.value}})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <input
                    type="text"
                    value={editForm.location?.state || ''}
                    onChange={(e) => setEditForm({...editForm, location: {...editForm.location, state: e.target.value}})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition"
                >
                  Update Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
