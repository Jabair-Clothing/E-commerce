import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

import MegaMenu from "../Header/MegaMenu";
import SearchBar from "../Header/SearchBar";

import MobileMenu from "../Header/MobileMenu";
import MobileSearch from "../Header/MobileSearch";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-lagoon-700 tracking-tight"
        >
          JABAIBGROUP
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-600 hover:text-lagoon-600 font-medium transition-colors"
          >
            Home
          </Link>

          <MegaMenu />

          {["Shop", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="text-gray-600 hover:text-lagoon-600 font-medium transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Search Bar - Desktop */}
        <SearchBar />

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Icon */}
          <button
            className="md:hidden text-gray-600 hover:text-lagoon-600"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-lagoon-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <MobileSearch
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />

      {/* Mobile Navigation */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;
