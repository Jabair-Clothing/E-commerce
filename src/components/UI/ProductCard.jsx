import React from "react";
import { ShoppingCart, Eye } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          <button
            className="p-3 bg-white text-gray-800 rounded-full hover:bg-lagoon-500 hover:text-white transition-colors transform hover:scale-110 shadow-lg"
            title="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button
            className="p-3 bg-white text-gray-800 rounded-full hover:bg-lagoon-500 hover:text-white transition-colors transform hover:scale-110 shadow-lg"
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Discount Badge (Mock) */}
        {product.id % 3 === 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">Category</p>
        <h3 className="font-semibold text-gray-800 text-lg mb-2 truncate group-hover:text-lagoon-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            Tk {product.price.toFixed(2)}
          </span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`w-2 h-2 rounded-full ${
                  star <= 4 ? "bg-yellow-400" : "bg-gray-200"
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
