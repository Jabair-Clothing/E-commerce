import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onQuickView }) => {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Link to={`/product/${product.id}/${product.slug}`}>
          <img
            src={product.image || product.primary_image}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </Link>

        {/* Discount Badge */}
        {product.discount_price &&
          parseFloat(product.discount_price) <
            parseFloat(product.regular_price || product.price) && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10">
              {Math.round(
                ((parseFloat(product.regular_price || product.price) -
                  parseFloat(product.discount_price)) /
                  parseFloat(product.regular_price || product.price)) *
                  100
              )}
              % OFF
            </span>
          )}
      </div>

      {/* Product Details */}
      <div className="p-6 bg-white">
        <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
          {product.category?.name || "Collection"}
        </p>
        <h3 className="font-serif font-bold text-primary-900 text-lg mb-3 truncate group-hover:text-accent-600 transition-colors">
          <Link to={`/product/${product.id}/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {/* Price or 'By Request' depends on B2B nature, keeping price for now but styled elegantly */}
              Tk {product.discount_price || product.price}
            </span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
            <Link
              to={`/product/${product.id}/${product.slug}`}
              className="text-accent-600"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
