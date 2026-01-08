import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../Auth/AuthModal";

const UserMenu = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className="relative" ref={userDropdownRef}>
        <button
          onClick={() => {
            if (isAuthenticated) {
              setIsUserDropdownOpen(!isUserDropdownOpen);
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          className="hidden md:flex items-center text-gray-600 hover:text-lagoon-600 transition-colors"
        >
          {isAuthenticated && user?.name ? (
            <div className="w-8 h-8 rounded-full bg-lagoon-100 flex items-center justify-center text-lagoon-700 font-bold text-xs ring-2 ring-transparent ring-offset-2 hover:ring-lagoon-200 transition-all">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User className="w-5 h-5" />
          )}
        </button>

        {/* User Dropdown */}
        {isUserDropdownOpen && isAuthenticated && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-down">
            <div className="p-4 border-b border-gray-50">
              <p className="font-bold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <Link
              to="/user/dashboard"
              onClick={() => setIsUserDropdownOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-lagoon-600 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default UserMenu;
