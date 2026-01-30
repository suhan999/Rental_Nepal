import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Globe, Save, CheckCircle, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      newUserAlerts: true,
      bookingAlerts: true,
      reportAlerts: false
    },
    system: {
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: false
    }
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleToggle = (category, key) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSuccessMessage('Settings saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button onClick={onToggle} className="relative">
      {enabled ? (
        <ToggleRight className="w-10 h-10 text-violet-600" />
      ) : (
        <ToggleLeft className="w-10 h-10 text-slate-300" />
      )}
    </button>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-sm text-slate-500">Manage system preferences</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-800">Email Notifications</div>
                <div className="text-sm text-slate-500">Receive email updates</div>
              </div>
              <ToggleSwitch 
                enabled={settings.notifications.emailNotifications} 
                onToggle={() => handleToggle('notifications', 'emailNotifications')} 
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-800">New User Alerts</div>
                <div className="text-sm text-slate-500">Notify when users register</div>
              </div>
              <ToggleSwitch 
                enabled={settings.notifications.newUserAlerts} 
                onToggle={() => handleToggle('notifications', 'newUserAlerts')} 
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-800">Booking Alerts</div>
                <div className="text-sm text-slate-500">Notify on new bookings</div>
              </div>
              <ToggleSwitch 
                enabled={settings.notifications.bookingAlerts} 
                onToggle={() => handleToggle('notifications', 'bookingAlerts')} 
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-slate-800">Report Alerts</div>
                <div className="text-sm text-slate-500">Weekly summary reports</div>
              </div>
              <ToggleSwitch 
                enabled={settings.notifications.reportAlerts} 
                onToggle={() => handleToggle('notifications', 'reportAlerts')} 
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-violet-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">System</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-800">Maintenance Mode</div>
                <div className="text-sm text-slate-500">Show maintenance page</div>
              </div>
              <ToggleSwitch 
                enabled={settings.system.maintenanceMode} 
                onToggle={() => handleToggle('system', 'maintenanceMode')} 
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-800">Allow Registration</div>
                <div className="text-sm text-slate-500">Users can create accounts</div>
              </div>
              <ToggleSwitch 
                enabled={settings.system.allowRegistration} 
                onToggle={() => handleToggle('system', 'allowRegistration')} 
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-slate-800">Email Verification</div>
                <div className="text-sm text-slate-500">Require email verification</div>
              </div>
              <ToggleSwitch 
                enabled={settings.system.requireEmailVerification} 
                onToggle={() => handleToggle('system', 'requireEmailVerification')} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition disabled:opacity-70"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-violet-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-violet-800">Admin Access</h3>
            <p className="text-sm text-violet-600 mt-1">
              These settings affect the entire platform. Changes will be applied immediately after saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
