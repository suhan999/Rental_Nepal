// AboutPage component - Information about Rental Nepal platform
// Displays company mission, values, statistics, and team information
import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Users, Home, Award, Target, Heart, ArrowLeft, CheckCircle, Globe, Shield } from 'lucide-react';

// About page component with company info and mission
export default function AboutPage() {
  // Platform statistics
  const stats = [
    { number: '5000+', label: 'Happy Customers' },
    { number: '1200+', label: 'Items Listed' },
    { number: '50+', label: 'Cities Covered' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  // Company values and principles
  const values = [
    { icon: Heart, title: 'Customer First', description: 'We prioritize your needs and work tirelessly to exceed expectations.' },
    { icon: Shield, title: 'Trust & Security', description: 'Your safety and peace of mind are our top priorities.' },
    { icon: Globe, title: 'Local Expertise', description: 'Deep knowledge of Nepal\'s rental market across all categories.' },
    { icon: Award, title: 'Quality Assured', description: 'Every listing is verified and meets our high standards.' }
  ];

  const team = [
    { name: 'Rajesh Sharma', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
    { name: 'Priya Thapa', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
    { name: 'Anil Gurung', role: 'Lead Developer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-800">RENTAL NEPAL</span>
              <div className="text-[9px] text-teal-600 font-medium tracking-widest uppercase">Rent Everything You Need</div>
            </div>
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">About Rental Nepal</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your one-stop rental platform in Nepal. From houses and apartments to furniture and electronics - we're committed to making your rental journey seamless, transparent, and enjoyable.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-3xl md:text-4xl font-black text-teal-600 mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6">
                Making Rentals <span className="text-teal-600">Simple & Accessible</span>
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                At Rental Nepal, we believe everyone deserves access to quality rentals. Our platform connects renters with verified sellers, offering a wide range of houses, furniture, electronics, and more across Kathmandu Valley and beyond.
              </p>
              <ul className="space-y-3">
                {['Verified rental listings', 'Transparent pricing', '24/7 customer support', 'Secure transactions'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Modern Home"
                className="relative rounded-3xl shadow-2xl w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">The principles that guide everything we do at Rental Nepal</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Meet Our Team</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">The dedicated professionals behind Rental Nepal</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-teal-100"
                />
                <h3 className="text-lg font-bold text-slate-800">{member.name}</h3>
                <p className="text-teal-600 font-medium text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-white/90 text-lg mb-8">Join thousands of happy customers who found their perfect rental with us.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-8 py-4 bg-white text-teal-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white">RENTAL NEPAL</span>
          </div>
          <p className="text-slate-400 text-sm">© 2025 Rental Nepal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
