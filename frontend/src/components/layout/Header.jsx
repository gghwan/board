// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search query:', searchQuery);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img 
                className="h-15 w-40 object-contain" 
                src="/src/assets/logo.png" 
                alt="Community Board"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-button focus:ring-custom focus:border-custom"
                placeholder="Search topics, posts, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <i className="fas fa-search text-gray-400"></i>
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/posts/new"
              className="!rounded-button bg-custom text-white px-4 py-2 hover:bg-custom/90"
            >
              <i className="fas fa-plus mr-2"></i>New Post
            </Link>
            <Link
              to="/login"
              className="!rounded-button border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              <i className="fas fa-user mr-2"></i>Login
            </Link>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex space-x-8 px-4 sm:px-6 lg:px-8 py-2">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/latest">Latest</NavLink>
          <NavLink to="/popular">Popular</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/members">Members</NavLink>
        </nav>
      </div>
    </header>
  );
};

// Custom NavLink component for consistent styling
const NavLink = ({ to, children }) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        isActive 
          ? "text-blue-600 font-medium" 
          : "text-gray-500 hover:text-blue-600 font-medium"
      }
    >
      {children}
    </RouterNavLink>
  );
};

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default Header;