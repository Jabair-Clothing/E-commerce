import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Loader2, Trash2, ShoppingBag } from "lucide-react";
import { fetchWishlist, removeFromWishlist } from "../../services/api";

const Wishlist = ({ user }) => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWishlist(); // No userId needed
      if (response.success) {
        setWishlistItems(response.data);
      } else {
        if (response.status === 404) {
          setWishlistItems([]);
        } else {
          setError(response.message || "Failed to load wishlist.");
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setWishlistItems([]);
      } else {
        setError("Failed to load wishlist.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const handleRemoveFromWishlist = async (id) => {
    if (!window.confirm("Remove item?")) return;
    try {
      const res = await removeFromWishlist(id);
      if (res.success) {
        loadWishlist();
      } else {
        alert(res.message || "Failed to remove.");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing item.");
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-lagoon-600" />
        My Wishlist
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-lagoon-600" />
        </div>
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Your wishlist is empty
          </h3>
          <p className="max-w-xs mx-auto text-gray-500 mt-2 mb-6">
            Looks like you haven't added anything to your wishlist yet.
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 bg-lagoon-600 hover:bg-lagoon-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-lagoon-200"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.wishlistId}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all relative"
            >
              <button
                onClick={() => handleRemoveFromWishlist(item.wishlistId)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 z-10 transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <Link
                to={`/product/${item.product_id}/${item.product_slug}`}
                className="block relative aspect-[4/5] bg-gray-100 overflow-hidden"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}
              </Link>

              <div className="p-4">
                <Link
                  to={`/product/${item.product_id}/${item.product_slug}`}
                  className="block"
                >
                  <h3 className="font-semibold text-gray-900 mb-1 truncate hover:text-lagoon-600 transition-colors">
                    {item.name || "Product Name"}
                  </h3>
                </Link>
                <p className="font-bold text-gray-900">
                  {item.price ? `Tk ${item.price}` : "Price N/A"}
                </p>

                <button
                  onClick={() =>
                    navigate(`/product/${item.product_id}/${item.product_slug}`)
                  }
                  className="w-full mt-4 py-2 bg-gray-900 hover:bg-lagoon-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
