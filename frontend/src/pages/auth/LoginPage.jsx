// LoginPage component - Role-based login selection page
// Allows users to choose login type: User, Seller, or Admin
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Building2, Shield, Mountain, ArrowRight, Sparkles } from 'lucide-react';

// Login page that presents different login options based on user role
export default function LoginPage() {
  const navigate = useNavigate();

  // Configuration for different login options
  const loginOptions = [
    {
      title: "User Login",
      description: "Browse and rent premium properties across Nepal",
      icon: User,
      path: "/user-login",
      gradient: "from-teal-500 to-emerald-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      shadowColor: "shadow-teal-500/20"
    },
    {
      title: "Seller Login",
      description: "Manage your property listings and bookings",
      icon: Building2,
      path: "/seller-login",
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      shadowColor: "shadow-amber-500/20"
    },
    {
      title: "Admin Login",
      description: "Access the admin dashboard and controls",
      icon: Shield,
      path: "/admin-login",
      gradient: "from-slate-600 to-slate-800",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      shadowColor: "shadow-slate-500/20"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      {/* Background Image with Overlay */}
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl"></div>
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
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-white/80 hover:text-white transition font-medium">About Us</Link>
            <Link to="/contact" className="text-white/80 hover:text-white transition font-medium">Contact</Link>
            <Link to="/help" className="text-white/80 hover:text-white transition font-medium">Help</Link>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <div className="flex-1 flex items-center justify-center w-full py-12 px-4 relative z-10">
        <div className="w-full max-w-4xl">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium text-white/90">Welcome to Rental Nepal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
              Choose Your
              <span className="block mt-1 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Account Type
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-md mx-auto">
              Select how you'd like to access Nepal's premier property platform
            </p>
          </div>
          
          {/* Login Options Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {loginOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate(option.path)}
                  className="group cursor-pointer"
                >
                  <div className={`bg-white rounded-3xl p-8 shadow-2xl ${option.shadowColor} border-2 border-transparent hover:border-teal-300 transition-all duration-500 h-full flex flex-col items-center text-center transform hover:scale-105 hover:-translate-y-2`}>
                    {/* Icon */}
                    <div className={`${option.iconBg} mb-6 p-5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-10 h-10 ${option.iconColor}`} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-black mb-3 text-slate-800">
                      {option.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-slate-500 mb-6 leading-relaxed flex-1">
                      {option.description}
                    </p>
                    
                    {/* Button */}
                    <button className={`w-full py-3.5 bg-gradient-to-r ${option.gradient} text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3`}>
                      Continue
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Sign Up Link */}
          <div className="text-center mt-10">
            <p className="text-lg text-white/80">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-4">
                Sign Up Here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-lg py-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">RENTAL NEPAL</span>
            </div>
            <div className="text-white/50 text-sm text-center">
              Durbar Marg, Kathmandu, Nepal | +977-1-4234567 | info@rentalnepal.com
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-white/40">
            © 2025 Rental Nepal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
