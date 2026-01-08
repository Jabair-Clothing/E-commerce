import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Newsletter */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-lagoon-400 mb-4">
              jabaibgroup
            </h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Elevating your style with sustainable, modern fashion essentials.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-lagoon-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-lagoon-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-lagoon-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  to="/shop"
                  className="hover:text-lagoon-300 transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-lagoon-300 transition-colors"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-lagoon-300 transition-colors"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-lagoon-300 transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Help</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-lagoon-300 transition-colors"
                >
                  Customer Service
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-lagoon-300 transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-lagoon-300 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-lagoon-300 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Stay in the Loop</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe for exclusive offers and updates.
            </p>
            <form className="flex flex-col space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded focus:outline-none focus:border-lagoon-500 text-sm"
                />
              </div>
              <button className="bg-lagoon-600 hover:bg-lagoon-500 text-white font-medium py-2 px-4 rounded transition-colors text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://napver.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lagoon-500 transition-colors"
            >
              Napver
            </a>
            . All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
