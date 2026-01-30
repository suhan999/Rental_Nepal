import React, { useState, useEffect } from 'react';
import { Receipt, Search, Filter, Calendar, DollarSign, ChevronLeft, ChevronRight, Home, User } from 'lucide-react';

export default function SellerTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revenue, setRevenue] = useState({ total: 0, monthly: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await fetch(`http://localhost:4000/api/bookings/seller/transactions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data || []);
        setRevenue(data.revenue || { total: 0, monthly: 0 });
        setTotalPages(data.totalPages || 1);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (err) {
      setError('Error loading transactions');
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(t =>
    (t.property?.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.user?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">My Transactions</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl"></div>
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
            <Receipt className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Transactions</h1>
            <p className="text-sm text-slate-500">Track your bookings and earnings</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white w-64 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-sm font-medium text-slate-600 outline-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold mt-1">NPR {revenue.total?.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold mt-1">NPR {revenue.monthly?.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          {error}
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Property</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        <Receipt className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No transactions found</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((t) => (
                      <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white">
                              <Receipt className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-mono text-sm font-semibold text-slate-800">#{t._id?.slice(-8)}</div>
                              <div className="text-xs text-slate-500">{formatDate(t.createdAt)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-teal-600" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{t.user?.name || '-'}</div>
                              <div className="text-sm text-slate-500">{t.user?.email || '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                              <Home className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{t.property?.title || '-'}</div>
                              <div className="text-sm text-slate-500">{t.property?.location?.city || '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-slate-500">In:</span>
                              <span className="font-medium text-slate-700">{formatDate(t.checkIn)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-slate-500">Out:</span>
                              <span className="font-medium text-slate-700">{formatDate(t.checkOut)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-lg font-bold text-emerald-600">NPR {t.totalAmount?.toLocaleString() || '-'}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize ${getStatusBadge(t.status)}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
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
        </>
      )}
    </div>
  );
}
