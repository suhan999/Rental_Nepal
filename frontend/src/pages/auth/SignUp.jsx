

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Building, Home } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();

  const registrationOptions = [
    {
      title: "User Registration",
      description: "Register to browse and rent houses, furniture, electronics & more",
      icon: User,
      path: "/user-register",
      color: "from-teal-600 to-emerald-600",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600"
    },
    {
      title: "Seller Registration",
      description: "Register to list and manage your rental items",
      icon: Building,
      path: "/seller-register",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Blurred Background Image */}
      <div className="absolute inset-0 -z-20">
        <img src="/livingroom.jpg" alt="Background" className="w-full h-full object-cover object-center blur-[2px] scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-white/10 to-purple-900/40" />
      </div>
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow-md py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">RENTAL NEPAL</span>
          </Link>
          <nav className="space-x-6 text-gray-700 text-sm font-medium hidden md:block">
            <Link to="/about" className="hover:text-teal-600 transition">About Us</Link>
            <Link to="/contact" className="hover:text-teal-600 transition">Contact Us</Link>
            <Link to="/help" className="hover:text-teal-600 transition">Help</Link>
          </nav>
        </div>
      </header>
      {/* Main Section */}
      <div className="flex-1 flex items-center justify-center w-full py-16 px-2 md:px-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Account</h1>
            <p className="text-xl text-gray-600">Choose your registration type to get started</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {registrationOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={index}
                  className={`${option.bgColor} rounded-2xl p-8 border-2 border-transparent hover:border-gray-200 transition-all duration-300 cursor-pointer transform hover:scale-105`}
                  onClick={() => navigate(option.path)}
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${option.iconColor} bg-white rounded-full mb-6 shadow-lg`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{option.title}</h3>
                    <p className="text-gray-600 mb-6">{option.description}</p>
                    <button
                      className={`w-full bg-gradient-to-r ${option.color} text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 font-medium`}
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Need admin access?{' '}
              <Link to="/admin-login" className="text-purple-600 hover:text-purple-700 font-medium">
                Admin Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md py-8 border-t border-teal-100 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">RENTAL NEPAL</span>
          </div>
          <div className="text-gray-500 text-sm text-center md:text-left">
            44800, Bhaktapur, Srijana Nagar, Kathmandu Valley, Nepal<br />
            (123) 456-7890 | rentalnepal@gmail.com
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-teal-500 transition"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-teal-500 transition"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-teal-500 transition"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="hover:text-teal-500 transition"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; 2025 RENTAL NEPAL. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
