import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Loader2,
  ShoppingBag,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchTopSellingProducts } from "../services/api";
import { useCart } from "../context/CartContext";

const BestSelling = () => {
  const { addToCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchTopSellingProducts(currentPage, 6);
        if (response.success && response.data) {
          const productList = response.data.data.map((p) => ({
            ...p,
            image: p.primary_image, // Map for consistency if we were using ProductCard, but here we might prefer inline or ProductCard.
            // Using inline to match Shop.jsx style or reused ProductCard?
            // Shop.jsx uses inline card implementation. I will stick to Shop.jsx style for consistency or reuse ProductCard.
            // Shop.jsx inline implementation checks for `primary_image`.
          }));

          setProducts(productList);
          setPagination({
            current_page: response.data.current_page,
            last_page: response.data.last_page,
            total: response.data.total,
          });
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
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setSearchParams({ page: newPage });
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    // Ensure product has 'image' property if Cart expects it, or use primary_image
    // The Cart context likely handles it or we might need to adapt.
    // Let's assume passed product object is stored.
    // If Shop.jsx passes 'product' directly, and 'product' has 'primary_image', we should check Cart implementation if needed.
    // But for now, I'll pass it as is, maybe adding 'image' alias if needed.
    addToCart({ ...product, image: product.primary_image });
    setIsCartOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Best Selling Products
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? "Updating..." : `${pagination.total} Products Found`}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 relative">
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
            <>
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

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex justify-center items-center mt-12 gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {[...Array(pagination.last_page)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === i + 1
                          ? "bg-lagoon-600 text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.last_page}
                    className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-32 bg-gray-50 rounded-3xl">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No products found
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSelling;
