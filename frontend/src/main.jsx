// Main entry point for Rental Nepal application
// Initializes React root and sets up global providers
import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Create React root and render the application
// Wrapped with Router for navigation and AuthProvider for authentication
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>
);