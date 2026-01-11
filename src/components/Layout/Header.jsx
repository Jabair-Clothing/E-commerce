import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";

import MegaMenu from "../Header/MegaMenu";
import SearchBar from "../Header/SearchBar";
import UserMenu from "../Header/UserMenu";
import MobileMenu from "../Header/MobileMenu";
import MobileSearch from "../Header/MobileSearch";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { getCartCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-lagoon-700 tracking-tight"
        >
          NavClothing
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

          {["Shop", "About", "Returns", "Contact"].map((item) => (
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

          <button
            className="text-gray-600 hover:text-lagoon-600 transition-colors relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="w-5 h-5" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-lagoon-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>

          {/* User Menu - Desktop */}
          <UserMenu />

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
