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
