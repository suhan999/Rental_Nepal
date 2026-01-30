import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Clock, User, MapPin, DollarSign, Calendar, ShoppingCart, ChevronLeft, ChevronRight, Building2, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PurchaseRequests = () => {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPurchaseRequests();
  }, [currentPage, filter]);

  const fetchPurchaseRequests = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filter !== 'all' && { status: filter })
      });

      const response = await fetch(`http://localhost:4000/api/bookings/purchase-requests?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRequests(data.data || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching purchase requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setProcessing(true);
      const response = await fetch(`http://localhost:4000/api/bookings/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        alert('Rental request approved successfully!');
        fetchPurchaseRequests();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`http://localhost:4000/api/bookings/${selectedRequest._id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason })
      });
      
      if (response.ok) {
        alert('Rental request rejected successfully!');
        setShowModal(false);
        setRejectionReason('');
        setSelectedRequest(null);
        fetchPurchaseRequests();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (request, type) => {
    setSelectedRequest(request);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setModalType('');
    setRejectionReason('');
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const formatPrice = (price) => {
    return `NPR ${price?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Rental Requests</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-pulse">
              <div className="flex gap-6">
                <div className="w-48 h-36 bg-slate-200 rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
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
            <ShoppingCart className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Rental Requests</h1>
            <p className="text-sm text-slate-500">Manage booking requests for your listings</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => { setFilter(status); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl font-medium transition capitalize ${
              filter === status
                ? status === 'pending' ? 'bg-amber-500 text-white'
                : status === 'approved' ? 'bg-emerald-500 text-white'
                : status === 'rejected' ? 'bg-red-500 text-white'
                : 'bg-amber-500 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status === 'all' ? 'All Requests' : status}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Property Image */}
                <div className="lg:w-64 h-48 lg:h-auto bg-slate-100 flex-shrink-0">
                  {request.property?.images?.[0] ? (
                    <img
                      src={`http://localhost:4000${typeof request.property.images[0] === 'object' ? request.property.images[0].url || '' : `/uploads/${request.property.images[0]}`}`}
                      alt={request.property?.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{request.property?.title}</h3>
                      <div className="flex items-center text-slate-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>
                          {typeof request.property?.location === 'object' 
                            ? `${request.property.location.city}, ${request.property.location.state}`
                            : request.property?.location || 'N/A'
                          }
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize self-start ${getStatusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Buyer</div>
                        <div className="font-medium text-sm">{request.user?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Amount</div>
                        <div className="font-semibold text-sm text-emerald-600">{formatPrice(request.totalAmount)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Requested</div>
                        <div className="font-medium text-sm">{formatDate(request.createdAt)}</div>
                      </div>
                    </div>
                    {request.approvalDate && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                          <Check className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Approved</div>
                          <div className="font-medium text-sm">{formatDate(request.approvalDate)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {request.specialRequests && (
                    <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">Special Requests</p>
                      <p className="text-sm text-slate-700">{request.specialRequests}</p>
                    </div>
                  )}
                  
                  {request.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-50 rounded-xl">
                      <p className="text-xs text-red-500 mb-1">Rejection Reason</p>
                      <p className="text-sm text-red-700">{request.rejectionReason}</p>
                    </div>
                  )}
                  
                  {request.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleApprove(request._id)}
                        disabled={processing}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => openModal(request, 'reject')}
                        disabled={processing}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition disabled:opacity-50"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Clock className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No rental requests found</h3>
          <p className="text-slate-500">Requests will appear here when users want to rent your listings</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-100 px-6 py-4">
          <div className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-700">{currentPage}</span> of <span className="font-semibold text-slate-700">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showModal && modalType === 'reject' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">Reject Request</h3>
              <p className="text-sm text-slate-500 mt-1">Please provide a reason for rejection</p>
            </div>
            <div className="p-6">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                rows={4}
              />
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
                className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition disabled:opacity-50"
              >
                {processing ? 'Rejecting...' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseRequests;
