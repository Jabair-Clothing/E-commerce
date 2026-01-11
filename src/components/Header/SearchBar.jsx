import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { fetchProducts } from "../../services/api";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
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

  return (
    <div ref={searchRef} className="hidden md:flex flex-col relative">
      <div className="flex items-center bg-white rounded-sm px-4 py-2 border border-gray-200 focus-within:border-accent-400 w-64 transition-all">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="SEARCH"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchQuery.length > 0) setIsSearchOpen(true);
          }}
          className="bg-transparent border-none outline-none text-xs w-full text-gray-700 placeholder-gray-400 tracking-widest font-bold"
        />
        {isSearching && (
          <Loader2 className="w-4 h-4 text-accent-600 animate-spin ml-2" />
        )}
      </div>

      {/* Search Dropdown */}
      {isSearchOpen && (
        <div className="absolute top-full text-left mt-2 w-[400px] bg-white rounded-none shadow-2xl border border-gray-100 overflow-hidden z-50 right-0">
          {searchResults.length > 0 ? (
            <div className="max-h-[70vh] overflow-y-auto">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}/${product.slug}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
                >
                  <div className="w-12 h-16 bg-gray-100 flex-shrink-0">
                    <img
                      src={
                        product.primary_image ||
                        "https://dummyimage.com/100x100/f3f4f6/9ca3af&text=Image"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1 uppercase tracking-wider">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-gray-900">
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
  );
};

export default SearchBar;
