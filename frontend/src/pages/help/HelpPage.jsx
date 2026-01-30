import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, ArrowLeft, Search, ChevronDown, ChevronUp, HelpCircle, User, Home, CreditCard, Shield, MessageSquare, Settings } from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { icon: User, title: 'Account', description: 'Registration, login, profile' },
    { icon: Home, title: 'Rentals', description: 'Browsing, booking, listings' },
    { icon: CreditCard, title: 'Payments', description: 'Transactions, refunds' },
    { icon: Shield, title: 'Security', description: 'Privacy, verification' },
    { icon: MessageSquare, title: 'Support', description: 'Contact, complaints' },
    { icon: Settings, title: 'Settings', description: 'Preferences, notifications' }
  ];

  const faqs = [
    {
      category: 'Account',
      question: 'How do I create an account?',
      answer: 'Click on the "Sign Up" or "Get Started" button on the homepage. Fill in your details including name, email, phone number, and password. You\'ll receive a confirmation email after registration. Verify your email to activate your account.'
    },
    {
      category: 'Account',
      question: 'I forgot my password. What should I do?',
      answer: 'Click on the "Forgot Password" link on the login page. Enter your registered email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
    },
    {
      category: 'Rentals',
      question: 'How do I rent an item?',
      answer: 'Browse available rentals using our search filters. Click on your preferred item to view details. Use the "Book Now" or "Rent" button to initiate the rental process. Complete the required information and confirm your booking.'
    },
    {
      category: 'Rentals',
      question: 'What types of items can I rent?',
      answer: 'Rental Nepal offers a wide variety of items including houses, apartments, furniture (sofas, beds, tables), electronics (TVs, laptops, appliances), and other household items. Use our category filters to find what you need.'
    },
    {
      category: 'Payments',
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including bank transfers, mobile wallets (eSewa, Khalti), and cash payments. The available options will be displayed during the checkout process.'
    },
    {
      category: 'Payments',
      question: 'Is my payment information secure?',
      answer: 'Absolutely! We use industry-standard encryption to protect your payment information. All transactions are processed through secure payment gateways, and we never store your complete payment details on our servers.'
    },
    {
      category: 'Security',
      question: 'How do you verify rental listings?',
      answer: 'All listings go through a verification process that includes document verification, quality inspection when possible, and seller identity verification. We display a "Verified" badge on listings that have passed our verification process.'
    },
    {
      category: 'Support',
      question: 'Who do I contact for support?',
      answer: 'You can reach us through multiple channels: Use the Contact Us page to send a message, email us at info@rentalnepal.com, or call our support line at +977 01-4567890. Our team is available Sunday to Friday, 9 AM to 6 PM.'
    },
    {
      category: 'Support',
      question: 'How can I become a seller/property owner?',
      answer: 'To list your properties on Rental Nepal, click on "Become a Seller" or register as a seller. Complete the seller registration form with your business details. Once verified, you can start listing your properties through the seller dashboard.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Help Center</h1>
            <p className="text-xl text-white/90 mb-8">
              Find answers to common questions and get the support you need
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-white/20 bg-white/95 backdrop-blur focus:ring-4 focus:ring-white/30 focus:border-white transition-all duration-300 text-slate-700 font-medium shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-black text-slate-800 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(cat.title)}
                className="p-4 bg-slate-50 rounded-2xl hover:bg-teal-50 hover:shadow-lg transition-all duration-300 group text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <cat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{cat.title}</h3>
                <p className="text-xs text-slate-500">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-black text-slate-800 mb-8 text-center">
            Frequently Asked Questions
            {searchQuery && <span className="text-teal-600"> - "{searchQuery}"</span>}
          </h2>
          
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">No results found</h3>
              <p className="text-slate-500">Try a different search term or browse by category</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-teal-600 font-semibold hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">
                        {faq.category}
                      </span>
                      <h3 className="font-bold text-slate-800">{faq.question}</h3>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaq === index ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {openFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>
                  
                  {openFaq === index && (
                    <div className="px-6 pb-5">
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Still Need Help?</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Can't find what you're looking for? Our support team is always ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="px-8 py-4 bg-white text-teal-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Contact Support
              </Link>
              <a 
                href="mailto:info@rentalnepal.com" 
                className="px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 transition-all duration-300"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 mt-auto">
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
