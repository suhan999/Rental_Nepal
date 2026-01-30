import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Home, Bed, Bath, Square, MapPin, Heart, ArrowLeft, Star, User, Mountain, Calendar, Check, Phone, Mail, Building2, ChevronLeft, ChevronRight, Share2, Shield } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImg, setMainImg] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setProperty(data);
        checkIfFavorite(data._id);
        fetchSimilarProperties(data.propertyType, data._id);
      } else {
        setError(data.message || 'Property not found');
      }
    } catch (err) {
      setError('Error loading property: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProperties = async (propertyType, currentId) => {
    try {
      const response = await fetch(`/api/properties?type=${propertyType}&limit=4`);
      const data = await response.json();
      
      if (data.success) {
        const filtered = data.data.filter(p => p._id !== currentId).slice(0, 4);
        setSimilarProperties(filtered);
      }
    } catch (err) {
      console.error('Error fetching similar properties:', err);
    }
  };

  const checkIfFavorite = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:4000/api/wishlist/my-wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const favoriteIds = data.data.map(item => item.property._id);
        setIsFavorite(favoriteIds.includes(propertyId));
      }
    } catch (err) {
      console.error('Error checking favorites:', err);
    }
  };

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const endpoint = isFavorite 
        ? `/api/wishlist/remove-property/${property._id}`
        : '/api/wishlist/add-property';
      
      const method = isFavorite ? 'DELETE' : 'POST';
      const body = isFavorite ? undefined : JSON.stringify({ propertyId: property._id });

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const formatPrice = (price) => {
    return `NPR ${price?.toLocaleString() || '0'}`;
  };

  const getPropertyImage = (index = 0) => {
    if (property?.images && property.images.length > 0) {
      const imageUrl = property.images[index]?.url || property.images[index];
      return imageUrl ? `http://localhost:4000${imageUrl}` : '/house1.png';
    }
    return '/house1.png';
  };

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Item Not Found</h2>
          <p className="text-slate-500 mb-6">{error || 'The item you are looking for does not exist or has been removed.'}</p>
          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition"
          >
            Browse Rentals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">RENTAL NEPAL</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/properties" className="text-slate-600 hover:text-teal-600 font-medium transition">Rentals</Link>
              <Link to="/about" className="text-slate-600 hover:text-teal-600 font-medium transition">About</Link>
              <Link to="/contact" className="text-slate-600 hover:text-teal-600 font-medium transition">Contact</Link>
            </nav>
            
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-teal-600 font-medium transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative rounded-2xl overflow-hidden bg-slate-200 aspect-[16/9] md:aspect-[21/9]">
            <img
              src={getPropertyImage(mainImg)}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={() => setMainImg(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-700" />
                </button>
                <button
                  onClick={() => setMainImg(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
                >
                  <ChevronRight className="w-6 h-6 text-slate-700" />
                </button>
              </>
            )}
            
            {/* Actions */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-600 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg text-slate-600 hover:text-teal-500 transition">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
              {mainImg + 1} / {property.images?.length || 1}
            </div>
          </div>
          
          {/* Thumbnails */}
          {property.images && property.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {property.images.map((img, idx) => {
                const imageUrl = img.url || img;
                return (
                  <button
                    key={idx}
                    onClick={() => setMainImg(idx)}
                    className={`flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition ${
                      mainImg === idx ? 'border-teal-500 ring-2 ring-teal-500/30' : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={imageUrl ? `http://localhost:4000${imageUrl}` : '/house1.png'}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-5 h-5 text-teal-500" />
                    <span>{property.location?.address}, {property.location?.city}, {property.location?.state}</span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  property.isAvailable 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {property.isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
              
              {/* Rating */}
              {property.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(property.rating) ? 'text-amber-400 fill-current' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-700">{property.rating.toFixed(1)}</span>
                  <span className="text-slate-500">({property.totalReviews || 0} reviews)</span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Property Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Bed className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-800">{property.bedrooms}</div>
                    <div className="text-sm text-slate-500">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Bath className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-800">{property.bathrooms}</div>
                    <div className="text-sm text-slate-500">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Square className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-800">{property.sqft || property.area}</div>
                    <div className="text-sm text-slate-500">Sq. Ft.</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-800 capitalize">{property.propertyType}</div>
                    <div className="text-sm text-slate-500">Type</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Description</h2>
              <p className="text-slate-600 leading-relaxed">
                {property.description || 'This beautifully furnished property is perfect for families looking for a spacious and peaceful living environment. It features modern amenities and is located in a safe neighborhood close to shops, schools, and hospitals.'}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-600">
                      <Check className="w-5 h-5 text-emerald-500" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <div className="mb-6">
                <span className="text-slate-500 text-sm">Monthly Rent</span>
                <div className="text-3xl font-bold text-teal-600">
                  {formatPrice(property.price)}
                  <span className="text-lg font-normal text-slate-500">/month</span>
                </div>
              </div>
              
              <button
                onClick={() => navigate(`/booking/${property._id}`)}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-teal-500/25 hover:scale-[1.02] transition-all text-lg mb-4"
              >
                Book Now
              </button>
              
              <button
                onClick={toggleFavorite}
                className={`w-full py-3 rounded-xl font-semibold border-2 transition ${
                  isFavorite 
                    ? 'bg-red-50 border-red-200 text-red-600' 
                    : 'border-slate-200 text-slate-600 hover:border-teal-500 hover:text-teal-600'
                }`}
              >
                <Heart className={`w-5 h-5 inline mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
              </button>
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span>Verified listing with secure booking</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            {property.seller && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Listed By</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {property.seller.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{property.seller.name}</div>
                    <div className="text-sm text-slate-500">Seller</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {property.seller.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-teal-500" />
                      <span>{property.seller.phone}</span>
                    </div>
                  )}
                  {property.seller.email && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4 text-teal-500" />
                      <span>{property.seller.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Rentals */}
        {similarProperties.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Similar Rentals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((home) => (
                <div
                  key={home._id}
                  onClick={() => navigate(`/property/${home._id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="relative h-48 bg-slate-100">
                    <img
                      src={home.images?.[0]?.url ? `http://localhost:4000${home.images[0].url}` : '/house1.png'}
                      alt={home.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-xs font-semibold text-teal-600 capitalize">
                      {home.propertyType}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{home.title}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{home.location?.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-teal-600">{formatPrice(home.price)}</span>
                      <span className="text-sm text-slate-500">/month</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">RENTAL NEPAL</span>
            </div>
            <div className="text-slate-400 text-sm text-center">
              44800, Bhaktapur, Srijana Nagar, Kathmandu Valley, Nepal<br />
              (977) 123-4567 | info@rentalnepal.com
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Rental Nepal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertyDetail;
