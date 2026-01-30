import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff, Building, Mountain, ArrowLeft, Store } from 'lucide-react';

export default function SellerRegister() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("");

  const onSubmit = async (data) => {
    setSuccessMessage("");
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          address: data.address,
          role: 'seller'
        })
      });
      const result = await response.json();
      
      if (response.ok) {
        setMessageType("success");
        setSuccessMessage("Seller registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/seller-login");
        }, 2000);
      } else {
        setMessageType("error");
        setSuccessMessage(result.message || result.error || "Registration failed.");
      }
    } catch (error) {
      setMessageType("error");
      setSuccessMessage("Registration failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <img 
          src="/livingroom.jpg" 
          alt="Background" 
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 via-orange-900/80 to-slate-900/90" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
            Back to Login
          </Link>
        </div>
      </header>
      
      {/* Main Section */}
      <div className="flex-1 flex items-center justify-center w-full py-8 px-4 relative z-10">
        <div className="w-full max-w-lg">
          {/* Registration Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/30 mb-4">
                <Store className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-1">Seller Registration</h2>
              <p className="text-slate-500 text-sm">Start listing your properties today</p>
            </div>

            {/* Message Display */}
            {successMessage && (
              <div className={`mb-5 p-3 rounded-xl text-sm font-medium ${
                messageType === "success" 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {successMessage}
              </div>
            )}
            
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...register("name", { required: "Name is required" })}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-slate-700 font-medium bg-slate-50"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email"
                      }
                    })}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-slate-700 font-medium bg-slate-50"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
                    <Phone className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    {...register("phone", { required: "Phone number is required" })}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-slate-700 font-medium bg-slate-50"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
              </div>

              {/* Business Address Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
                    <Building className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your business address"
                    {...register("address", { required: "Address is required" })}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-slate-700 font-medium bg-slate-50"
                  />
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address.message}</p>}
              </div>

              {/* Password Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" }
                      })}
                      className="w-full pl-12 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-slate-700 font-medium bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm password"
                      {...register("confirmPassword", {
                        required: "Please confirm password",
                        validate: (value) => value === watch("password") || "Passwords do not match"
                      })}
                      className="w-full pl-12 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-slate-700 font-medium bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>}
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  'Register as Seller'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-sm text-slate-400 font-medium">or</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Links */}
            <div className="space-y-2 text-center">
              <p className="text-slate-600 text-sm">
                Already have a seller account?{' '}
                <Link to="/seller-login" className="font-bold text-amber-600 hover:text-amber-700 transition-colors">
                  Sign In
                </Link>
              </p>
              <p className="text-slate-600 text-sm">
                Want to register as user?{' '}
                <Link to="/user-register" className="font-bold text-teal-600 hover:text-teal-700 transition-colors">
                  User Registration
                </Link>
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
