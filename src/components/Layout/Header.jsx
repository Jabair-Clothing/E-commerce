import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Loader2,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useCategories } from "../../context/CategoryContext";
import { fetchParentCategory, fetchProducts } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../Auth/AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { parentCategories, loading } = useCategories();
  const { getCartCount, setIsCartOpen } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        setIsSearchOpen(true);
        try {
          const response = await fetchProducts({ search: searchQuery });
          if (response.success) {
            setSearchResults(response.data.data || []);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Mobile State
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] =
    useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState(null);

  // Cache to store fetched category details: { [id]: categoryData }
  const categoryCache = useRef({});

  // Initialize with first category
  useEffect(() => {
    const initCategory = async () => {
      if (parentCategories && parentCategories.length > 0) {
        const firstCat = parentCategories[0];
        // If we haven't fetched details for the first category yet, do it
        await handleCategoryHover(firstCat);
      }
    };
    initCategory();
  }, [parentCategories]);

  // Update preview image when active category changes
  useEffect(() => {
    if (activeCategory) {
      setPreviewImage(activeCategory.image_url);
    }
  }, [activeCategory]);

  const handleCategoryHover = async (category) => {
    // If we're already showing this category, do nothing
    if (activeCategory?.id === category.id) return;

    // Check cache first
    if (categoryCache.current[category.id]) {
      setActiveCategory(categoryCache.current[category.id]);
      return;
    }

    // Set temporary active state while loading (keeps title visible)
    // We mix the basic category info with a loading flag if needed,
    // but here we just set it and show a loader in the content area.
    setActiveCategory(category);
    setIsLoadingDetails(true);

    try {
      const response = await fetchParentCategory(category.id);
      if (response.success) {
        const detailedCategory = response.data;
        // Update cache
        categoryCache.current[category.id] = detailedCategory;
        // Update state
        setActiveCategory(detailedCategory);
      }
    } catch (error) {
      console.error("Failed to fetch category details", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-lagoon-700 tracking-tight"
          >
            jabaibgroup
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-lagoon-600 font-medium transition-colors"
            >
              Home
            </Link>

            {/* Categories Mega Menu */}
            <div className="relative group">
              <button className="flex items-center text-gray-600 hover:text-lagoon-600 font-medium transition-colors py-4">
                Categories
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              <div className="absolute left-0 top-full w-[800px] bg-white border border-gray-100 shadow-xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                <div className="flex h-[400px]">
                  {/* Sidebar: Parent Categories */}
                  <div className="w-1/4 bg-gray-50 py-4 overflow-y-auto">
                    {!loading &&
                      parentCategories.map((category) => (
                        <div
                          key={category.id}
                          onMouseEnter={() => handleCategoryHover(category)}
                          className={`px-6 py-3 cursor-pointer text-sm font-medium transition-colors flex items-center justify-between ${
                            activeCategory?.id === category.id
                              ? "bg-white text-lagoon-600 border-l-4 border-lagoon-600 shadow-sm"
                              : "text-gray-600 hover:bg-gray-100 hover:text-lagoon-600"
                          }`}
                        >
                          {category.name}
                        </div>
                      ))}
                  </div>

                  {/* Content Area: Subcategories & Image */}
                  <div className="flex-1 flex p-8 bg-white relative min-h-[300px]">
                    {activeCategory ? (
                      isLoadingDetails ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                          <Loader2 className="w-8 h-8 text-lagoon-600 animate-spin" />
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 pr-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                              {activeCategory.name}
                              <Link
                                to={`/shop?parent_category_id=${activeCategory.id}`}
                                className="ml-4 text-xs font-medium text-lagoon-600 hover:text-lagoon-700 underline"
                              >
                                View All
                              </Link>
                            </h3>

                            {/* Note: API returns 'categories' for subcategories */}
                            {activeCategory.categories &&
                            activeCategory.categories.length > 0 ? (
                              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                {activeCategory.categories.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    to={`/shop?parent_category_id=${activeCategory.id}&category_id=${sub.id}`}
                                    onMouseEnter={() =>
                                      setPreviewImage(sub.image_url)
                                    }
                                    onMouseLeave={() =>
                                      setPreviewImage(activeCategory.image_url)
                                    }
                                    className="text-sm text-gray-600 hover:text-lagoon-600 hover:translate-x-1 transition-all block"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm">
                                No subcategories available.
                              </p>
                            )}
                          </div>

                          <div className="w-64 relative rounded-xl overflow-hidden shadow-md group/image">
                            <img
                              src={
                                previewImage ||
                                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
                              }
                              alt={activeCategory.name}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2 py-1 rounded-sm">
                                Featured
                              </span>
                            </div>
                          </div>
                        </>
                      )
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-400">
                        Hover over a category to see details
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

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

          {/* Search Bar - Hidden on small mobile */}
          <div ref={searchRef} className="hidden md:flex flex-col relative">
            <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-lagoon-400 w-64 transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.length > 0) setIsSearchOpen(true);
                }}
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
              />
              {isSearching && (
                <Loader2 className="w-4 h-4 text-lagoon-600 animate-spin ml-2" />
              )}
            </div>

            {/* Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full text-left mt-2 w-[400px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 right-0">
                {searchResults.length > 0 ? (
                  <div className="max-h-[70vh] overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}/${product.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={
                              product.primary_image ||
                              "https://dummyimage.com/100x100/f3f4f6/9ca3af&text=Image"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-bold text-lagoon-700">
                              Tk {product.price}
                            </span>
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              Quantity: {product.stock_quantity}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.length > 0 && !isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No products found.
                  </div>
                ) : null}
              </div>
            )}
          </div>

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

            {/* User Icon / Dropdown */}
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
                    <p className="font-bold text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
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
        {isMobileSearchOpen && (
          <div
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-md p-4 animate-fade-in-down z-40"
            ref={mobileSearchRef}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 outline-none focus:border-lagoon-500 text-sm"
                autoFocus
              />
              {isSearching ? (
                <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-lagoon-600 animate-spin" />
              ) : (
                <button
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {searchQuery.length > 0 && (
              <div className="mt-2 max-h-[60vh] overflow-y-auto bg-white rounded-lg border border-gray-100 shadow-sm">
                {searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}/${product.slug}`}
                        onClick={() => {
                          setIsMobileSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center p-3 border-b border-gray-50 last:border-none active:bg-gray-50"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={
                              product.primary_image ||
                              "https://dummyimage.com/100x100/f3f4f6/9ca3af&text=Image"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center mt-1">
                            <span className="text-xs font-bold text-lagoon-700">
                              Tk {product.price}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  !isSearching && (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No products found.
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg absolute w-full left-0 animate-fade-in-down h-[calc(100vh-80px)] overflow-y-auto z-40">
            <div className="flex flex-col space-y-4">
              {["Home", "Shop", "About", "Returns", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-lagoon-600 font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
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
                            if (mobileActiveCategory === item.id) {
                              setMobileActiveCategory(null);
                            } else {
                              setMobileActiveCategory(item.id);
                              // Trigger fetch if not cached (reusing logic or just relies on effect/cache check)
                              // We can reuse handleCategoryHover logic but tailored for click
                              handleCategoryHover(item);
                            }
                          }}
                          className="flex items-center justify-between w-full text-gray-600 font-medium py-1"
                        >
                          {item.name}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              mobileActiveCategory === item.id
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>

                        {/* Subcategories for Mobile */}
                        {mobileActiveCategory === item.id && (
                          <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-100">
                            {isLoadingDetails &&
                            activeCategory?.id === item.id ? (
                              <div className="flex items-center text-lagoon-600">
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                                Loading...
                              </div>
                            ) : activeCategory?.id === item.id ? (
                              <>
                                <Link
                                  to={`/category/${item.slug}`}
                                  className="block text-sm text-lagoon-600 font-semibold mb-2"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  View All {item.name}
                                </Link>
                                {activeCategory.categories?.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    to={`/category/${item.slug}/${sub.slug}`}
                                    className="block text-sm text-gray-500 hover:text-lagoon-600"
                                    onClick={() => setIsMenuOpen(false)}
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
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-600 hover:text-lagoon-600 mb-3"
                    >
                      <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center text-red-500 hover:text-red-700 w-full text-left"
                    >
                      <LogOut className="w-5 h-5 mr-3" /> Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
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
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
