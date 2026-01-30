import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Mail, MapPin, Phone, User, CheckCircle, ArrowLeft, Calendar } from 'lucide-react';

const bgImage = '/luxuryhouse.jpg';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    contact: '',
  });
  const [isBooked, setIsBooked] = useState(false);
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('#user-dropdown-btn') && !event.target.closest('#user-dropdown-menu')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBook = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address || !formData.contact) {
      alert('Please fill all the fields!');
      return;
    }
    setIsBooked(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-100 via-white to-purple-100 overflow-hidden">
      {/* Background Image + Overlay */}
      <div className="absolute inset-0 -z-10">
        <img src={bgImage} alt="Luxury House" className="w-full h-full object-cover object-center opacity-60" />
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
          <div className="flex items-center space-x-6">
            <nav className="space-x-6 text-gray-700 text-sm font-medium hidden md:block">
              <Link to="/about" className="hover:text-blue-600 transition">About Us</Link>
              <Link to="/contact" className="hover:text-blue-600 transition">Contact Us</Link>
              <Link to="/help" className="hover:text-blue-600 transition">Help</Link>
            </nav>
            
            {/* User Section */}
            {user ? (
              <div className="relative">
                <button
                  id="user-dropdown-btn"
                  onClick={() => setUserDropdownOpen(v => !v)}
                  className="text-blue-700 font-semibold px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {user.name}
                </button>
                {userDropdownOpen && (
                  <div id="user-dropdown-menu" className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700"
                      onClick={() => { setUserDropdownOpen(false); navigate('/profile'); }}
                    >
                      View Profile
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 border-t border-gray-100"
                      onClick={() => { setUserDropdownOpen(false); localStorage.removeItem('user'); localStorage.removeItem('token'); window.dispatchEvent(new Event('userLogin')); navigate('/login'); }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors duration-300"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-lg bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-blue-100 relative"
        >
          <button onClick={() => window.history.back()} className="absolute left-6 top-6 text-blue-500 hover:text-blue-700 transition flex items-center gap-1 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex flex-col items-center mb-6">
            <Calendar className="w-12 h-12 text-teal-500 mb-2" />
            <h2 className="text-3xl font-extrabold text-teal-700 mb-1 text-center drop-shadow">Confirm Your Rental</h2>
            <p className="text-gray-600 text-center text-lg">Item <span className="font-bold text-teal-600">#{id}</span></p>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center mb-8">
            <div className={`flex-1 h-2 rounded-full ${isBooked ? 'bg-green-400' : 'bg-blue-300'} transition-all duration-500`}></div>
            <span className={`ml-3 text-xs font-semibold ${isBooked ? 'text-green-600' : 'text-blue-500'}`}>{isBooked ? 'Booked' : 'Fill Details'}</span>
          </div>

          {isBooked ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mb-2 animate-bounce" />
              <h3 className="text-green-700 text-2xl font-bold mb-2">Booked Successfully!</h3>
              <p className="text-gray-600 mb-4">Thank you for booking. We will contact you soon.</p>
              <Link to="/" className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition">Go to Home</Link>
            </motion.div>
          ) : (
            <form onSubmit={handleBook} className="w-full space-y-6">
              <div className="relative">
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-2"><User className="w-4 h-4 text-blue-400" /> Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-5 py-3 rounded-xl border border-blue-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 font-medium shadow-sm placeholder-gray-400"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>
              <div className="relative">
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" /> Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-5 py-3 rounded-xl border border-blue-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 font-medium shadow-sm placeholder-gray-400"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
              </div>
              <div className="relative">
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /> Address</label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-5 py-3 rounded-xl border border-blue-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 font-medium shadow-sm placeholder-gray-400"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your city or street"
                />
              </div>
              <div className="relative">
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" /> Contact Number</label>
                <input
                  type="text"
                  name="contact"
                  className="w-full px-5 py-3 rounded-xl border border-blue-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 font-medium shadow-sm placeholder-gray-400"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="+977 98XXXXXXXX"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition text-lg mt-2"
              >
                Book Now
              </motion.button>
            </form>
          )}
        </motion.div>
      </main>

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
};

export default BookingPage;
