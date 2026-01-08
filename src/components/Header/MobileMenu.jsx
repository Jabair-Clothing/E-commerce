import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Loader2,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../context/CategoryContext";
import { fetchParentCategory } from "../../services/api";
import AuthModal from "../Auth/AuthModal";

const MobileMenu = ({ isOpen, onClose }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { parentCategories } = useCategories();
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] =
    useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState(null);
  const [activeCategoryData, setActiveCategoryData] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Cache for fetched details
  const categoryCache = useRef({});

  const handleLogout = () => {
    logout();
    onClose();
    // navigate("/"); // Parent handles navigation usually, or we can use hook here if needed
    window.location.href = "/";
  };

  const handleCategoryExpand = async (category) => {
    if (mobileActiveCategory === category.id) {
      setMobileActiveCategory(null);
      return;
    }

    setMobileActiveCategory(category.id);

    // Check cache
    if (categoryCache.current[category.id]) {
      setActiveCategoryData(categoryCache.current[category.id]);
      return;
    }

    setIsLoadingDetails(true);
    try {
      const response = await fetchParentCategory(category.id);
      if (response.success) {
        categoryCache.current[category.id] = response.data;
        setActiveCategoryData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch category details", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg absolute w-full left-0 animate-fade-in-down h-[calc(100vh-80px)] overflow-y-auto z-40">
        <div className="flex flex-col space-y-4">
          {["Home", "Shop", "About", "Returns", "Contact"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-gray-600 hover:text-lagoon-600 font-medium text-lg"
              onClick={onClose}
            >
              {item}
            </Link>
          ))}

          {/* Mobile Categories Expansion */}
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={() =>
                setMobileCategoriesExpanded(!mobileCategoriesExpanded)
              }
              className="flex items-center justify-between w-full text-gray-900 font-bold text-lg mb-2"
            >
              Categories
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  mobileCategoriesExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileCategoriesExpanded && (
              <div className="pl-4 space-y-3">
                {parentCategories.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryExpand(item);
                      }}
                      className="flex items-center justify-between w-full text-gray-600 font-medium py-1"
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileActiveCategory === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Subcategories for Mobile */}
                    {mobileActiveCategory === item.id && (
                      <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-100">
                        {isLoadingDetails ? (
                          <div className="flex items-center text-lagoon-600">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                            Loading...
                          </div>
                        ) : activeCategoryData?.id === item.id ? (
                          <>
                            <Link
                              to={`/category/${item.slug}`}
                              className="block text-sm text-lagoon-600 font-semibold mb-2"
                              onClick={onClose}
                            >
                              View All {item.name}
                            </Link>
                            {activeCategoryData.categories?.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/category/${item.slug}/${sub.slug}`}
                                className="block text-sm text-gray-500 hover:text-lagoon-600"
                                onClick={onClose}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-gray-100 pb-8">
            {isAuthenticated ? (
              <>
                <div className="flex items-center text-gray-900 font-bold mb-4">
                  <div className="w-8 h-8 rounded-full bg-lagoon-100 flex items-center justify-center text-lagoon-700 font-bold text-xs mr-3">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {user.name}
                </div>
                <Link
                  to="/user/dashboard"
                  onClick={onClose}
                  className="flex items-center text-gray-600 hover:text-lagoon-600 mb-3"
                >
                  <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-700 w-full text-left"
                >
                  <LogOut className="w-5 h-5 mr-3" /> Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  // onClose(); // Dont close menu, just open modal? Or close menu?
                  // UX: Close menu so modal is visible clearly
                  // But we need to pass open state to local modal or use global?
                  // The header uses local modal. MobileMenu needs its own or prop.
                  // Let's use local state here.
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center text-gray-600 hover:text-lagoon-600 mb-3"
              >
                <User className="w-5 h-5 mr-3" /> Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default MobileMenu;
