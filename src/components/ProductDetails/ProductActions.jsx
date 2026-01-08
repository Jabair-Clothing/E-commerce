import React from "react";
import { ShoppingBag, Heart, Share2 } from "lucide-react";

const ProductActions = ({
  onAddToCart,
  onAddToWishlist,
  disabled,
  label,
  isWishlist,
}) => {
  return (
    <div className="flex gap-4 mb-8">
      <button
        onClick={onAddToCart}
        disabled={disabled}
        className="flex-1 bg-lagoon-600 text-white py-4 rounded-full font-bold hover:bg-lagoon-700 transition-all flex items-center justify-center shadow-lg shadow-lagoon-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingBag className="w-5 h-5 mr-2" />
        {label}
      </button>
      <button
        onClick={onAddToWishlist}
        className={`p-4 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors ${
          isWishlist
            ? "text-red-500 bg-red-50 border-red-200"
            : "text-gray-600 hover:text-red-500"
        }`}
      >
        <Heart className={`w-6 h-6 ${isWishlist ? "fill-current" : ""}`} />
      </button>
      <button className="p-4 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
        <Share2 className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ProductActions;
