import React from "react";

const ProductInfo = ({ product, activeSku, displayPrice }) => {
  return (
    <div className="mb-8">
      <div className="mb-2">
        <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
          {product.parent_category?.name} {product.parent_category && "•"}{" "}
          {product.category?.name}
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {product.name}
      </h1>
      {activeSku && (
        <div className="text-sm text-gray-500 font-medium mb-4 font-mono">
          SKU: {activeSku.sku}
        </div>
      )}

      <div className="flex items-center space-x-4 mb-6">
        <span className="text-3xl font-bold text-gray-900">
          Tk {displayPrice}
        </span>

        {/* Discount Logic */}
        {(() => {
          // Determine Original Price to show formatted
          const originalPrice = activeSku
            ? parseFloat(activeSku.price) >
              parseFloat(activeSku.final_price || activeSku.discount_price || 0)
              ? activeSku.price
              : null
            : parseFloat(product.regular_price || product.base_price) >
              parseFloat(
                product.discount_price || product.final_price || product.price
              )
            ? product.regular_price || product.base_price
            : null;

          // Only show if we have an original price and it's greater than display
          if (
            originalPrice &&
            parseFloat(originalPrice) > parseFloat(displayPrice)
          ) {
            return (
              <>
                <span className="text-lg text-gray-400 line-through">
                  Tk {originalPrice}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg">
                  {Math.round(
                    ((originalPrice - displayPrice) / originalPrice) * 100
                  )}
                  % OFF
                </span>
              </>
            );
          }
          return null;
        })()}

        {activeSku && activeSku.quantity < 10 && activeSku.quantity > 0 && (
          <span className="text-red-500 text-sm font-medium">
            Only {activeSku.quantity} items left!
          </span>
        )}
      </div>

      <div
        className="prose prose-sm text-gray-600 mb-8"
        dangerouslySetInnerHTML={{ __html: product.short_description }}
      />

      <div className="w-full h-px bg-gray-100 mb-8"></div>
    </div>
  );
};

export default ProductInfo;
