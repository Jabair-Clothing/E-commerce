import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Loader2, X } from "lucide-react";
import { fetchProducts } from "../../services/api";

const MobileSearch = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
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
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-md p-4 animate-fade-in-down z-40"
      ref={mobileSearchRef}
    >
      <div className="relative">
        <input
          type="text"
          placeholder="SEARCH"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-b-2 border-primary-900 rounded-none py-3 pl-4 pr-10 outline-none text-base font-serif font-bold uppercase tracking-widest"
          autoFocus
        />
        {isSearching ? (
          <Loader2 className="absolute right-3 top-3 w-5 h-5 text-accent-600 animate-spin" />
        ) : (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mobile Search Results */}
      {searchQuery.length > 0 && (
        <div className="mt-4 max-h-[60vh] overflow-y-auto bg-white rounded-none border-none">
          {searchResults.length > 0 ? (
            <div>
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}/${product.slug}`}
                  onClick={() => {
                    onClose();
                    setSearchQuery("");
                  }}
                  className="flex items-center p-4 border-b border-gray-50 last:border-none active:bg-gray-50"
                >
                  <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                    <img
                      src={
                        product.primary_image ||
                        "https://dummyimage.com/100x100/f3f4f6/9ca3af&text=Image"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate uppercase tracking-wide">
                      {product.name}
                    </h4>
                    <div className="flex items-center mt-2">
                      <span className="text-xs font-bold text-gray-900">
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
  );
};

export default MobileSearch;
