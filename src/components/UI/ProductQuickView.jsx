import React from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const ProductQuickView = ({ product, onClose }) => {
  if (!product) return null;

  const discountPercentage =
    product.discount_price &&
    parseFloat(product.discount_price) <
      parseFloat(product.regular_price || product.price)
      ? Math.round(
          ((parseFloat(product.regular_price || product.price) -
            parseFloat(product.discount_price)) /
            parseFloat(product.regular_price || product.price)) *
            100
        )
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in flex flex-col md:flex-row">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-gray-100 z-10 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-50 relative">
          <img
            src={product.image || product.primary_image}
            alt={product.name}
            className="w-full h-full object-cover aspect-square md:aspect-auto"
          />
          {discountPercentage && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <div className="mb-6">
            <span className="text-sm font-medium text-lagoon-600 mb-2 block">
              {product.category?.name}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                Tk {product.discount_price || product.price}
              </span>
              {discountPercentage && (
                <span className="text-lg text-gray-400 line-through">
                  Tk {product.regular_price || product.price}
                </span>
              )}
            </div>

            {/* Status */}
            <div className="mb-4">
              {product.stock_quantity > 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6 line-clamp-4">
              {product.short_description ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                />
              ) : (
                "No description available."
              )}
            </p>
          </div>

          <div className="mt-auto space-y-4">
            <Link
              to={`/product/${product.id}/${product.slug || "product"}`}
              className="block w-full text-center py-4 rounded-xl font-bold border-2 border-gray-100 text-gray-900 hover:border-gray-900 transition-colors"
              onClick={onClose}
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
