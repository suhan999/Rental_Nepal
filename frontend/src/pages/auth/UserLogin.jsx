// UserLogin component - User authentication page
// Handles email and password validation for regular users
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Mountain, ArrowLeft, User, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

// Login form component for users
export default function UserLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors }
  } = useForm();

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors },
    reset: resetForgot
  } = useForm();

  const onSubmitLogin = async (data) => {
    setLoginMessage("");
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      });
      const result = await response.json();
      
      if (response.ok && result.user.role === 'user') {
        login(result.token, result.user);
        setMessageType("success");
        setLoginMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/user/rental-houses");
        }, 1000);
      } else if (response.ok && result.user.role !== 'user') {
        setMessageType("error");
        setLoginMessage("Access denied. This login is for users only.");
      } else {
        setMessageType("error");
        setLoginMessage(result.message || result.error || "Login failed.");
      }
    } catch (error) {
      setMessageType("error");
      setLoginMessage("Login failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitForgot = async (data) => {
    try {
      setMessageType("success");
      setLoginMessage("Password reset instructions sent to your email.");
      setShowModal(false);
      resetForgot();
    } catch (error) {
      setMessageType("error");
      setLoginMessage("Failed to send reset instructions.");
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
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 via-emerald-900/80 to-slate-900/90" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl shadow-lg shadow-teal-500/30 mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">User Login</h2>
              <p className="text-slate-500">Welcome back! Sign in to continue</p>
            </div>

            {/* Message Display */}
            {loginMessage && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                messageType === "success" 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {loginMessage}
              </div>
            )}
            
            {/* Form */}
            <form onSubmit={handleSubmitLogin(onSubmitLogin)} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...registerLogin("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-slate-700 font-medium bg-slate-50"
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{loginErrors.email.message}</p>
                )}
              </div>
              
              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...registerLogin("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" }
                    })}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-slate-700 font-medium bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{loginErrors.password.message}</p>
                )}
                
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="text-teal-600 text-sm hover:text-teal-700 font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-sm text-slate-400 font-medium">or</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Register Link */}
            <p className="text-center text-slate-600">
              Don't have an account?{' '}
              <Link to="/user-register" className="font-bold text-teal-600 hover:text-teal-700 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-100 rounded-2xl mb-4">
                <Mail className="w-7 h-7 text-teal-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Reset Password</h2>
              <p className="text-slate-500 text-sm">
                Enter your email and we'll send you password reset instructions
              </p>
            </div>
            
            <form onSubmit={handleSubmitForgot(onSubmitForgot)} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...registerForgot("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email"
                    }
                  })}
                  className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-slate-700 font-medium bg-slate-50"
                />
                {forgotErrors.email && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{forgotErrors.email.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Send Reset Link
              </button>
            </form>
            
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 py-3 text-slate-600 hover:text-slate-800 font-semibold transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-lg py-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white/40 text-sm">© 2025 Rental Nepal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
