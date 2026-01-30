import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Mountain, ArrowLeft, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoginMessage, setAdminLoginMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmitAdminLogin = async (data) => {
    setAdminLoginMessage("");
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.adminEmail,
          password: data.adminPassword
        })
      });
      let result = await response.json();
      
      if (response.ok && result.user.role === 'admin') {
        login(result.token, result.user);
        setMessageType("success");
        setAdminLoginMessage("Admin login successful! Redirecting...");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else if (response.ok && result.user.role !== 'admin') {
        setMessageType("error");
        setAdminLoginMessage("Access denied. This login is for admins only.");
      } else {
        setMessageType("error");
        setAdminLoginMessage(result.message || result.error || "Admin login failed.");
      }
    } catch (error) {
      setMessageType("error");
      setAdminLoginMessage("Admin login failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <img 
          src="/luxuryhouse.jpg" 
          alt="Background" 
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 via-purple-900/80 to-slate-900/90" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="w-full bg-white/10 backdrop-blur-lg border-b border-white/10 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-white">RENTAL NEPAL</span>
              <div className="text-[9px] text-teal-300 font-medium tracking-widest uppercase">Find Your Dream Home</div>
            </div>
          </Link>
          <Link 
            to="/login" 
            className="flex items-center gap-2 text-white/80 hover:text-white transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login Options
          </Link>
        </div>
      </header>
      
      {/* Main Section */}
      <div className="flex-1 flex items-center justify-center w-full py-12 px-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl shadow-lg shadow-violet-500/30 mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">Admin Login</h2>
              <p className="text-slate-500">Access the admin dashboard</p>
            </div>

            {/* Message Display */}
            {adminLoginMessage && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                messageType === "success" 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {adminLoginMessage}
              </div>
            )}
            
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmitAdminLogin)} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter admin email"
                    {...register("adminEmail", {
                      required: "Admin email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 text-slate-700 font-medium bg-slate-50"
                  />
                </div>
                {errors.adminEmail && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.adminEmail.message}</p>
                )}
              </div>
              
              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    {...register("adminPassword", {
                      required: "Admin password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" }
                    })}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 text-slate-700 font-medium bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.adminPassword && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.adminPassword.message}</p>
                )}
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In as Admin'
                )}
              </button>
            </form>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 text-center">
                <span className="font-semibold">🔒 Secure Access</span><br />
                This area is restricted to authorized administrators only.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-lg py-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white/40 text-sm">© 2025 Rental Nepal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
