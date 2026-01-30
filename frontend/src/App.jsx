import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import LoginPage from './pages/auth/LoginPage';
import UserLogin from './pages/auth/UserLogin';
import SellerLogin from './pages/auth/SellerLogin';
import UserRegister from './pages/auth/UserRegister';
import SellerRegister from './pages/auth/SellerRegister';
import PropertyDetail from './pages/user/PropertyDetail';
import RentalWebsite from './pages/RentalWebsite';
import MyFavorites from './pages/user/MyFavorites';
import AdminDashboard from './pages/admin/AdminDashboard';
import Reseller from './components/Reseller';
import OrderHistory from './pages/user/OrderHistory';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminProperties from './pages/admin/AdminProperties';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminReports from './pages/admin/AdminReports';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerDashboardHome from './pages/seller/SellerDashboardHome';
import SellerProperties from './pages/seller/SellerProperties';
import SellerTransactions from './pages/seller/SellerTransactions';
import SellerMessages from './pages/seller/SellerMessages';
import SellerSettings from './pages/seller/SellerSettings';
import SellerProfile from './pages/seller/SellerProfile';
import PropertyListing from './pages/user/PropertyListing';
import RentalHouses from './pages/user/RentalHouses';
import BookingPage from './BookingPage';
import AboutPage from './pages/about/AboutPage';
import ContactPage from './pages/contact/ContactPage';
import HelpPage from './pages/help/HelpPage';
import LogoutHandler from './components/LogoutHandler';
import AdminLogin from './pages/auth/AdminLogin';
import User from './pages/user/User';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import { useAuth } from './context/AuthContext';
import ProductPage from './pages/user/ProductPage';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated()) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === 'seller') {
      return <Navigate to="/seller/dashboard" replace />;
    } else if (user?.role === 'user') {
      return <Navigate to="/user/rental-houses" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RentalWebsite />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/products" element={<ProductPage />} />
      
      {/* Auth Routes - Redirect if already logged in */}
      <Route path="/signup" element={<AuthGuard><SignUp /></AuthGuard>} />
      <Route path="/login" element={<AuthGuard><LoginPage /></AuthGuard>} />
      <Route path="/user-login" element={<AuthGuard><UserLogin /></AuthGuard>} />
      <Route path="/seller-login" element={<AuthGuard><SellerLogin /></AuthGuard>} />
      <Route path="/admin-login" element={<AuthGuard><AdminLogin /></AuthGuard>} />
      <Route path="/user-register" element={<AuthGuard><UserRegister /></AuthGuard>} />
      <Route path="/seller-register" element={<AuthGuard><SellerRegister /></AuthGuard>} />
      
      {/* Protected User Routes */}
      <Route path="/user/rental-houses" element={
        <ProtectedRoute requiredRole="user">
          <RentalHouses />
        </ProtectedRoute>
      } />
      <Route path="/user/favorites" element={
        <ProtectedRoute requiredRole="user">
          <MyFavorites />
        </ProtectedRoute>
      } />
      <Route path="/user/order-history" element={
        <ProtectedRoute requiredRole="user">
          <OrderHistory />
        </ProtectedRoute>
      } />
      <Route path="/user/profile" element={
        <ProtectedRoute requiredRole="user">
          <User />
        </ProtectedRoute>
      } />
      
    
      
      {/* Protected Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardHome />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="logout" element={<LogoutHandler />} />
      </Route>
      
      {/* Protected Seller Routes */}
      <Route path="/seller/*" element={
        <ProtectedRoute requiredRole="seller">
          <SellerDashboard />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SellerDashboardHome />} />
        <Route path="properties" element={<SellerProperties />} />
        <Route path="transactions" element={<SellerTransactions />} />
        <Route path="messages" element={<SellerMessages />} />
        <Route path="settings" element={<SellerSettings />} />
        <Route path="profile" element={<SellerProfile />} />
      </Route>
      
    </Routes>
  );
}

export default App;