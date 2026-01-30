import React from 'react';
import { MessageCircle, Mail, AlertCircle, Clock, Inbox } from 'lucide-react';

export default function AdminMessages() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Support Messages</h1>
          <p className="text-sm text-slate-500">Manage customer inquiries</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-amber-600" />
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-slate-800 mb-3">
            Messages System Coming Soon
          </h3>
          
          {/* Description */}
          <p className="text-slate-500 mb-8">
            The support messages system is not yet implemented. This feature will allow you to manage user inquiries and support tickets directly from the dashboard.
          </p>
          
          {/* Feature List */}
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 text-left">
            <h4 className="font-semibold text-violet-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Planned Features
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Inbox className="w-3.5 h-3.5 text-violet-700" />
                </div>
                <div>
                  <div className="font-medium text-slate-700">Unified Inbox</div>
                  <div className="text-sm text-slate-500">All messages in one place</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="w-3.5 h-3.5 text-violet-700" />
                </div>
                <div>
                  <div className="font-medium text-slate-700">Real-time Chat</div>
                  <div className="text-sm text-slate-500">Live messaging with users</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-violet-700" />
                </div>
                <div>
                  <div className="font-medium text-slate-700">Email Integration</div>
                  <div className="text-sm text-slate-500">Respond via email</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
