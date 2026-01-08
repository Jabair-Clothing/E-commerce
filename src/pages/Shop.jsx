import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Loader2,
  ShoppingBag,
  Search,
  X,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  fetchProducts,
  fetchParentCategories,
  fetchParentCategory,
  recordCategoryView,
  recordParentCategoryView,
} from "../services/api";

import { useCart } from "../context/CartContext";

const Shop = () => {
  const { addToCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Metadata
  const [searchParams] = useSearchParams();

  // Filters & Metadata
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    parent_category_id: searchParams.get("parent_category_id")
      ? parseInt(searchParams.get("parent_category_id"))
      : null,
    category_id: searchParams.get("category_id")
      ? parseInt(searchParams.get("category_id"))
      : null,
  });

  // Sync state when URL params change (e.g. navigation)
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      parent_category_id: searchParams.get("parent_category_id")
        ? parseInt(searchParams.get("parent_category_id"))
        : null,
      category_id: searchParams.get("category_id")
        ? parseInt(searchParams.get("category_id"))
        : null,
    });

    // Also update selectedParent so subcategories sidebar can open consistently
    if (searchParams.get("parent_category_id")) {
      setSelectedParent(parseInt(searchParams.get("parent_category_id")));
    }
  }, [searchParams]);

  const [showFilters, setShowFilters] = useState(false);

  // Debounce Search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // 1. Fetch Parent Categories on Mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchParentCategories();
        if (response.success) {
          setParentCategories(response.data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);

  // 2. Fetch Active Parent Details (to get Subcategories) when a parent is selected
  useEffect(() => {
    const loadSubCategories = async () => {
      if (!filters.parent_category_id) {
        setSubCategories([]);
        return;
      }
      try {
        const response = await fetchParentCategory(filters.parent_category_id);
        if (response.success && response.data.categories) {
          setSubCategories(response.data.categories);
        } else {
          setSubCategories([]);
        }
      } catch (err) {
        console.error("Failed to load subcategories", err);
      }
    };
    loadSubCategories();
  }, [filters.parent_category_id]);

  // 3. Main Product Fetcher
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {
          status: 1, // Always active
          search: debouncedSearch,
          parent_category_id: filters.parent_category_id,
          category_id: filters.category_id,
        };

        // Clear undefined/null/empty params
        Object.keys(params).forEach((key) => {
          if (
            params[key] === null ||
            params[key] === "" ||
            params[key] === undefined
          ) {
            delete params[key];
          }
        });

        const response = await fetchProducts(params);
        if (response.success) {
          // Double check is_active on frontend as safeguard
          const activeProducts = response.data.data.filter((p) => p.is_active);
          setProducts(activeProducts);
          setError(null);
        } else {
          setProducts([]);
          setError("Failed to load products.");
        }
      } catch (err) {
        setProducts([]);
        setError("An error occurred while loading products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [debouncedSearch, filters.parent_category_id, filters.category_id]);

  // 4. Track Category Views
  useEffect(() => {
    if (filters.category_id) {
      recordCategoryView(filters.category_id);
    } else if (filters.parent_category_id) {
      recordParentCategoryView(filters.parent_category_id);
    }
  }, [filters.category_id, filters.parent_category_id]);

  // Handlers
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleParentCategoryClick = (id) => {
    if (filters.parent_category_id === id) {
      // Deselect if already selected
      setFilters((prev) => ({
        ...prev,
        parent_category_id: null,
        category_id: null,
      }));
      setSelectedParent(null);
    } else {
      setFilters((prev) => ({
        ...prev,
        parent_category_id: id,
        category_id: null,
      }));
      setSelectedParent(id);
    }
  };

  const handleSubCategoryClick = (id) => {
    setFilters((prev) => ({
      ...prev,
      category_id: prev.category_id === id ? null : id, // Toggle
    }));
  };

  const clearFilters = () => {
    setFilters({ search: "", parent_category_id: null, category_id: null });
    setSelectedParent(null);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Top Bar: Title & Mobile Filter Toggle (Future) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? "Updating..." : `${products.length} Products Found`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-lagoon-500 transition-colors"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden flex items-center px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Mobile Filter Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
            showFilters
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
          onClick={() => setShowFilters(false)}
        />

        {/* Sidebar Filters */}
        <aside
          className={`
            fixed lg:static top-0 left-0 h-full lg:h-auto w-80 lg:w-64 bg-white lg:bg-transparent z-50 
            p-6 lg:p-0 overflow-y-auto lg:overflow-visible transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
            ${
              showFilters
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
        `}
        >
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 text-gray-500 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Clear Filters Button (only if filters active) */}
            {(filters.parent_category_id || filters.search) && (
              <button
                onClick={() => {
                  clearFilters();
                  setShowFilters(false);
                }}
                className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center"
              >
                <X className="w-4 h-4 mr-1" /> Clear All Filters
              </button>
            )}

            {/* Departments (Parent Categories) */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Filter className="w-4 h-4 mr-2" /> Departments
              </h3>
              <ul className="space-y-2">
                {parentCategories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleParentCategoryClick(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                        filters.parent_category_id === cat.id
                          ? "bg-lagoon-50 text-lagoon-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {cat.name}
                      {filters.parent_category_id === cat.id && (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {/* Nested Subcategories (Only show if parent selected) */}
                    {filters.parent_category_id === cat.id &&
                      subCategories.length > 0 && (
                        <ul className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-2">
                          {subCategories.map((sub) => (
                            <li key={sub.id}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubCategoryClick(sub.id);
                                }}
                                className={`text-sm block w-full text-left py-1 transition-colors ${
                                  filters.category_id === sub.id
                                    ? "text-lagoon-600 font-semibold"
                                    : "text-gray-500 hover:text-lagoon-500"
                                }`}
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-lagoon-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-2xl text-red-600">
              {error}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                    <img
                      src={
                        product.primary_image ||
                        "https://dummyimage.com/600x800/f3f4f6/9ca3af&text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm">
                        {product.stock_quantity > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Link
                        to={`/product/${product.id}/${product.slug}`}
                        className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl hover:bg-lagoon-50"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-xs text-gray-500 mb-1">
                      {product.category?.name}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 hover:text-lagoon-600 transition-colors">
                      <Link to={`/product/${product.id}/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        Tk {product.price}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="p-2 rounded-full bg-gray-50 hover:bg-lagoon-100 text-gray-600 hover:text-lagoon-600 transition-colors"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-gray-50 rounded-3xl">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto mb-6">
                We couldn't find any products matching your filters. Try
                clearing them to see more.
              </p>
              <button
                onClick={clearFilters}
                className="text-lagoon-600 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
