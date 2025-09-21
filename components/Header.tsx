import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Header: React.FC = () => {
  const activeLinkStyle = {
    color: '#1e40af',
    fontWeight: '600',
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <NavLink to="/" className="text-2xl font-bold text-blue-800">
                پرو مجازی
              </NavLink>
            </div>
            <nav className="hidden md:block mr-10">
              <div className="flex items-baseline space-x-4 space-x-reverse">
                <NavLink
                  to="/"
                  className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                >
                  استودیو پرو
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                >
                  داشبورد
                </NavLink>
                <NavLink
                  to="/pricing"
                  className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                >
                  پلن‌های اشتراک
                </NavLink>
              </div>
            </nav>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Link to="/login" className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                ورود
              </Link>
              <Link to="/register" className="mr-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                ثبت‌نام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;