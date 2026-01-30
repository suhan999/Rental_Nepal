import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Home, MapPin, Bed, Bath, Square, Star, Phone, Mail, Menu, X, Check, 
  ArrowRight, Calendar, Users, Shield, Award, Filter, Search, Heart,
  Facebook, Instagram, Linkedin, Twitter, Play, Eye, ChevronLeft, ChevronRight, Building2, Mountain, Compass
} from 'lucide-react';

const RentalWebsite = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [animatedElements, setAnimatedElements] = useState(new Set());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const intervalRef = useRef({});
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = [
    { number: "500+", label: "Premium Listings", icon: Home },
    { number: "15+", label: "Years Experience", icon: Award },
    { number: "2000+", label: "Happy Customers", icon: Users },
    { number: "95%", label: "Satisfaction Rate", icon: Shield }
  ];

  const services = [
    "Houses, apartments & property rentals",
    "Quality furniture for rent",
    "Electronics & appliances rental",
    "24/7 dedicated customer support",
    "Flexible rental periods",
    "Verified sellers & secure transactions"
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Thamel Resident",
      text: "Found my dream apartment and rented furniture all in one place. Rental Nepal made moving so easy!",
      rating: 5
    },
    {
      name: "Rajesh Maharjan", 
      location: "Lazimpat Resident",
      text: "Rented electronics for my new office setup. Great quality products and excellent service!",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      location: "Expat Community",
      text: "As a foreigner, I rented everything I needed - house, furniture, and appliances. Highly recommended!",
      rating: 5
    }
  ];

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/properties');
        if (response.ok) {
          const data = await response.json();
          const properties = data.data || data;
          const formattedProperties = properties.map(property => ({
            id: property._id,
            price: `NPR ${property.price?.toLocaleString()}`,
            originalPrice: property.originalPrice ? `NPR ${property.originalPrice.toLocaleString()}` : null,
            location: property.location,
            beds: property.bedrooms,
            baths: property.bathrooms,
            sqft: property.area,
            rating: property.rating || 4.5,
            reviews: property.reviewCount || 0,
            images: property.images && property.images.length > 0 ? property.images.map(img => `http://localhost:4000/${img}`) : ['/house1.png'],
            features: property.amenities || [],
            type: property.type?.toLowerCase() || 'apartment',
            availableFrom: property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : 'Available Now',
            description: property.description || 'Beautiful property with modern amenities.'
          }));
          setProperties(formattedProperties);
        } else {
          console.error('Failed to fetch properties');
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    properties.forEach(property => {
      if (property.images.length > 1) {
        intervalRef.current[property.id] = setInterval(() => {
          setCurrentImageIndex(prev => ({
            ...prev,
            [property.id]: ((prev[property.id] || 0) + 1) % property.images.length
          }));
        }, 3000);
      }
    });

    return () => {
      Object.values(intervalRef.current).forEach(interval => clearInterval(interval));
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setAnimatedElements(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-amber-400 text-amber-400 opacity-50" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  const filteredProperties = properties.filter(property => {
    const matchesFilter = selectedFilter === 'all' || property.type === selectedFilter;
    const locationString = typeof property.location === 'string' 
      ? property.location 
      : property.location?.city || property.location?.address || '';
    const matchesSearch = locationString.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (property.features && property.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'house', label: 'Houses' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'other', label: 'Others' }
  ];

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
    updateUser();
    window.addEventListener('userLogin', updateUser);
    return () => window.removeEventListener('userLogin', updateUser);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('#user-dropdown-btn') && !e.target.closest('#user-dropdown-menu')) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userDropdownOpen]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          scrollY > 100 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-teal-100' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Mountain className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 bg-clip-text text-transparent tracking-tight">
                  RENTAL NEPAL
                </div>
                <div className="text-[10px] text-teal-600 font-medium tracking-widest uppercase">
                  Rent Everything You Need
                </div>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center space-x-1">
              <li>
                <button
                  onClick={() => navigate('/user/rental-houses')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    scrollY > 100 
                      ? 'text-slate-700 hover:bg-teal-50 hover:text-teal-600' 
                      : 'text-white/90 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/products')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    scrollY > 100 
                      ? 'text-slate-700 hover:bg-teal-50 hover:text-teal-600' 
                      : 'text-white/90 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  Explore
                </button>
              </li>
              {user ? (
                <li className="relative ml-2">
                  <button
                    id="user-dropdown-btn"
                    onClick={() => setUserDropdownOpen(v => !v)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </button>
                  {userDropdownOpen && (
                    <div id="user-dropdown-menu" className="absolute right-0 mt-2 w-48 bg-white border border-teal-100 rounded-2xl shadow-xl shadow-teal-500/10 overflow-hidden z-50">
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-teal-50 text-slate-700 font-medium transition-colors"
                        onClick={() => { setUserDropdownOpen(false); navigate('/profile'); }}
                      >
                        View Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-medium border-t border-teal-50 transition-colors"
                        onClick={() => { setUserDropdownOpen(false); localStorage.removeItem('user'); localStorage.removeItem('token'); window.dispatchEvent(new Event('userLogin')); navigate('/login'); }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                <li className="ml-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300"
                  >
                    Login / Register
                  </button>
                </li>
              )}
            </ul>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 rounded-xl transition-colors duration-300 ${
                scrollY > 100 ? 'hover:bg-teal-50 text-slate-700' : 'hover:bg-white/20 text-white'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-teal-200/50">
              <ul className="space-y-2 pt-4">
                <li>
                  <button
                    onClick={() => { navigate('/user/rental-houses'); setIsMenuOpen(false); }}
                    className="w-full text-left py-3 px-4 text-slate-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                  >
                    <Home className="w-5 h-5" />
                    Properties
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/products'); setIsMenuOpen(false); }}
                    className="w-full text-left py-3 px-4 text-slate-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                  >
                    <Compass className="w-5 h-5" />
                    Explore
                  </button>
                </li>
                {user ? (
                  <>
                    <li>
                      <button
                        onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                        className="w-full text-left py-3 px-4 text-slate-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl font-semibold transition-all duration-300"
                      >
                        Profile ({user.name})
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => { localStorage.removeItem('user'); localStorage.removeItem('token'); window.dispatchEvent(new Event('userLogin')); navigate('/login'); setIsMenuOpen(false); }}
                        className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all duration-300"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <button
                      onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                      className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold text-center"
                    >
                      Login / Register
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="home" 
        className="min-h-screen flex items-center justify-center text-center text-white relative overflow-hidden"
      >
        {/* Background with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/Background.png')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-emerald-900/70 to-slate-900/80"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div 
          className={`relative z-10 max-w-5xl px-4 transition-all duration-1000 ${
            animatedElements.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          data-animate
          id="hero"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Mountain className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-white/90">Nepal's Premier Rental Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Rent Anything
            <span className="block mt-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              You Need
            </span>
            <span className="block text-3xl md:text-4xl font-semibold mt-4 text-white/80">
              Houses • Furniture • Electronics
            </span>
          </h1>
          
          <p className="text-lg md:text-xl mb-10 text-white/80 max-w-2xl mx-auto leading-relaxed">
            From homes to furniture, electronics to appliances - find everything you need to rent 
            across Nepal with verified sellers and secure transactions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/user/rental-houses')}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 transform hover:scale-105 transition-all duration-300"
            >
              <Search className="w-5 h-5 mr-2" />
              Explore Properties
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Tour
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div 
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 ${
              animatedElements.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            data-animate
            id="stats"
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="group bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-100 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 transform hover:-translate-y-2 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-teal-500/30">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-slate-800 mb-2">{stat.number}</div>
                  <div className="text-slate-500 font-semibold">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              animatedElements.has('properties-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            data-animate
            id="properties-title"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-100 mb-4">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">Featured Listings</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
              Popular Rentals
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Browse our curated collection of houses, furniture, electronics and more available for rent
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-teal-200 rounded-full animate-spin border-t-teal-500"></div>
                <Mountain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-teal-500" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.slice(0, 4).map((property, index) => (
                <div
                  key={property.id}
                  className={`group bg-white rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-teal-500/10 transform hover:-translate-y-2 transition-all duration-500 border border-slate-100 ${
                    animatedElements.has(`property-${property.id}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  data-animate
                  id={`property-${property.id}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={property.images && property.images.length > 0 
                        ? (property.images[currentImageIndex[property.id] || 0]?.url || `http://localhost:4000${typeof property.images[currentImageIndex[property.id] || 0] === 'string' ? property.images[currentImageIndex[property.id] || 0] : ''}`) 
                        : '/house1.png'
                      } 
                      alt={typeof property.location === 'string' 
                        ? property.location 
                        : `${property.location?.address || ''}, ${property.location?.city || ''}, ${property.location?.state || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',') || 'Property'
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                    
                    <button
                      onClick={() => toggleFavorite(property.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                    >
                      <Heart className={`w-5 h-5 ${favorites.has(property.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                    </button>
                    
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg">
                      <div className="flex items-center space-x-1">
                        {renderStars(property.rating)}
                        <span className="text-sm font-bold text-slate-700 ml-1">{property.rating}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg">
                      {property.availableFrom}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-2xl font-black text-teal-600">{property.price}<span className="text-sm text-slate-400 font-medium">/mo</span></div>
                      </div>
                      {property.originalPrice && (
                        <div className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                          Save {Math.round(((parseInt(property.originalPrice?.replace(/[^\d]/g, '')) - parseInt(property.price.replace(/[^\d]/g, ''))) / parseInt(property.originalPrice?.replace(/[^\d]/g, '')) * 100) || 0)}%
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center text-slate-500 mb-4">
                      <MapPin className="w-4 h-4 mr-1.5 text-teal-500" />
                      <span className="text-sm font-medium truncate">
                        {typeof property.location === 'string' 
                          ? property.location 
                          : `${property.location?.address || ''}, ${property.location?.city || ''}, ${property.location?.state || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',')
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4 py-3 px-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center text-slate-600">
                        <Bed className="w-4 h-4 mr-1.5 text-teal-500" />
                        <span className="text-sm font-semibold">{property.beds}</span>
                      </div>
                      <div className="w-px h-4 bg-slate-200"></div>
                      <div className="flex items-center text-slate-600">
                        <Bath className="w-4 h-4 mr-1.5 text-teal-500" />
                        <span className="text-sm font-semibold">{property.baths}</span>
                      </div>
                      <div className="w-px h-4 bg-slate-200"></div>
                      <div className="flex items-center text-slate-600">
                        <Square className="w-4 h-4 mr-1.5 text-teal-500" />
                        <span className="text-sm font-semibold">{property.sqft}</span>
                      </div>
                    </div>
                    
                    {property.features && property.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {property.features.slice(0, 2).map((feature, featureIndex) => (
                          <span 
                            key={featureIndex}
                            className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg text-xs font-semibold"
                          >
                            {feature}
                          </span>
                        ))}
                        {property.features.length > 2 && (
                          <span className="text-teal-600 text-xs font-semibold px-2 py-1">+{property.features.length - 2}</span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/property/${property.id}`)}
                        className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/30 transform hover:scale-[1.02] transition-all duration-300"
                      >
                        View Details
                      </button>
                      <button className="px-4 py-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-teal-200 transition-all duration-300">
                        <Eye className="w-5 h-5 text-slate-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && properties.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/user/rental-houses')}
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/40 transform hover:scale-105 transition-all duration-300"
              >
                View All Properties
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          )}

          {!loading && properties.length === 0 && (
            <div className="text-center py-16">
              <Mountain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No properties available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div 
              className={`transition-all duration-1000 ${
                animatedElements.has('services-text') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
              data-animate
              id="services-text"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-white/90">Why Choose Us</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Your One-Stop
                <span className="block text-amber-400">Rental Solution</span>
              </h2>
              
              <p className="text-xl mb-8 text-white/80 leading-relaxed">
                We provide comprehensive rental services for all your needs. 
                From houses and apartments to furniture and electronics, find everything 
                you need to set up your perfect space.
              </p>
              
              <ul className="space-y-4">
                {services.map((service, index) => (
                  <li key={index} className="flex items-start group">
                    <div className="w-6 h-6 bg-amber-400 rounded-lg flex items-center justify-center mr-4 mt-0.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Check className="w-4 h-4 text-teal-800" />
                    </div>
                    <span className="text-lg text-white/90">{service}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-10 inline-flex items-center px-8 py-4 bg-white text-teal-700 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Learn More About Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            
            <div 
              className={`transition-all duration-1000 ${
                animatedElements.has('services-image') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
              data-animate
              id="services-image"
            >
              <div className="relative">
                <div className="h-[450px] bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                  <img 
                    src="/luxuryhouse.jpg" 
                    alt="Services" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/40">
                  <Mountain className="w-14 h-14 text-white" />
                </div>
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <div className="text-center">
                    <div className="text-2xl font-black text-teal-600">15+</div>
                    <div className="text-[10px] font-semibold text-slate-500">YEARS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-100 mb-4">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-sm font-semibold text-amber-700">Client Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-slate-500">
              Real experiences from real people who found their perfect home in Nepal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="group bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-500/10 border border-slate-100 hover:border-teal-200 transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-slate-600 mb-6 text-lg leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-teal-500/30">
                    <span className="text-white font-black text-lg">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-lg">{testimonial.name}</div>
                    <div className="text-sm text-teal-600 font-medium">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment Section */}
      <section id="comment" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-100 mb-4">
              <Mail className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">Share Your Thoughts</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">Leave a Comment</h2>
            <p className="text-slate-500">We value your feedback! Share your thoughts or experiences below.</p>
          </div>
          
          <form
            onSubmit={e => {
              e.preventDefault();
              if (commentInput.trim()) {
                setComments(prev => [commentInput.trim(), ...prev]);
                setCommentInput("");
              }
            }}
            className="mb-8"
          >
            <textarea
              className="w-full p-5 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 resize-none text-slate-700"
              rows={4}
              placeholder="Write your comment here..."
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full mt-4 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300"
            >
              Submit Comment
            </button>
          </form>
          
          <div>
            {comments.length === 0 ? (
              <div className="text-slate-400 text-center py-8">No comments yet. Be the first to comment!</div>
            ) : (
              <ul className="space-y-4">
                {comments.map((comment, idx) => (
                  <li key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="text-slate-700">{comment}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <Mountain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                    RENTAL NEPAL
                  </div>
                </div>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Your one-stop rental platform in Nepal. 
                Rent houses, furniture, electronics and more with verified sellers and secure transactions.
              </p>
              <div className="flex space-x-3">
                {[Facebook, Instagram, Linkedin, Twitter].map((Icon, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-teal-500 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5 text-slate-400 hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                {['Home', 'Properties', 'Services', 'About Us', 'Contact'].map(link => (
                  <li key={link}>
                    <button 
                      onClick={() => scrollToSection(link.toLowerCase().replace(' ', ''))}
                      className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center group font-medium"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start group">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mr-3 group-hover:bg-teal-500 transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-teal-400 group-hover:text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Durbar Marg, Kathmandu</div>
                    <div className="text-sm text-slate-400">Nepal 44600</div>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mr-3 group-hover:bg-emerald-500 transition-colors duration-300">
                    <Phone className="w-5 h-5 text-emerald-400 group-hover:text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">+977-1-4234567</div>
                    <div className="text-sm text-slate-400">24/7 Support</div>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mr-3 group-hover:bg-amber-500 transition-colors duration-300">
                    <Mail className="w-5 h-5 text-amber-400 group-hover:text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">info@rentalnepal.com</div>
                    <div className="text-sm text-slate-400">Get in touch</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Newsletter</h3>
              <p className="text-slate-400 mb-4">Subscribe for updates on new rentals and exclusive offers.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-l-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
                <button className="px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-r-xl font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-500 text-sm">
                © 2025 Rental Nepal. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-slate-500 hover:text-teal-400 transition-colors">Terms of Service</a>
                <a href="#" className="text-slate-500 hover:text-teal-400 transition-colors">Privacy Policy</a>
                <a href="#" className="text-slate-500 hover:text-teal-400 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RentalWebsite;
