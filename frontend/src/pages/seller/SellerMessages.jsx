import React, { useState, useEffect } from 'react';
import { MessageCircle, Mail, CheckCircle, XCircle } from 'lucide-react';

export default function SellerMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id || !token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/seller/messages/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMessages(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user?.id, token]);

  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await fetch(`/api/seller/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, status: 'Read' } : msg
        ));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/seller/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-4">
          <MessageCircle className="w-7 h-7 text-sky-500" />
          <h2 className="text-2xl font-bold text-sky-700">Messages</h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="bg-gray-200 h-4 w-12 rounded"></div>
                <div className="bg-gray-200 h-4 w-24 rounded"></div>
                <div className="bg-gray-200 h-4 w-48 rounded"></div>
                <div className="bg-gray-200 h-4 w-16 rounded"></div>
                <div className="bg-gray-200 h-4 w-24 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <MessageCircle className="w-7 h-7 text-sky-500" />
        <h2 className="text-2xl font-bold text-sky-700">Messages</h2>
      </div>
      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        {messages.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <tr className="bg-sky-100 text-sky-700">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">From</th>
                <th className="py-3 px-4 text-left">Subject</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className="even:bg-sky-50 hover:bg-sky-100 transition">
                  <td className="py-2 px-4">{m.id}</td>
                  <td className="py-2 px-4">{m.from}</td>
                  <td className="py-2 px-4">{m.subject}</td>
                  <td className="py-2 px-4">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${m.status === 'Read' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{m.status}</span>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    {m.status === 'Unread' && (
                      <button 
                        className="bg-green-400 hover:bg-green-600 text-white px-2 py-1 rounded transition" 
                        title="Mark as Read"
                        onClick={() => handleMarkAsRead(m.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      className="bg-red-400 hover:bg-red-600 text-white px-2 py-1 rounded transition" 
                      title="Delete"
                      onClick={() => handleDeleteMessage(m.id)}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button className="bg-sky-400 hover:bg-sky-600 text-white px-2 py-1 rounded transition" title="Reply">
                      <Mail className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No messages found</p>
            <p className="text-sm">Your messages will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}