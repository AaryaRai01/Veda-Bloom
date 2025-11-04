import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  // Hide navbar on the homepage and quiz for a full-screen experience
  if (['/', '/quiz'].includes(location.pathname)) {
    return null;
  }

  // Solid red-band navbar for all internal pages (Dashboard, FAQ, etc.)
  return (
    <nav className="bg-brand-red text-white shadow-lg fixed w-full z-10 top-0 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left Side: Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="font-serif">वेदा</span> BLOOM
          </Link>
          
          {/* Right Side: Navigation Links */}
          <div className="flex items-center space-x-4 text-md">
            <Link to="/dashboard" className="hover:bg-brand-dark-red px-3 py-2 rounded-md">Track my cycle</Link>
            <Link to="/faq" className="hover:bg-brand-dark-red px-3 py-2 rounded-md">Curious About...?</Link>
            <Link to="/history" className="hover:bg-brand-dark-red px-3 py-2 rounded-md">History</Link>
            <Link to="/login" className="bg-white text-brand-red font-bold py-2 px-4 rounded-full hover:bg-red-100 transition">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
