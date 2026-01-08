import React from "react";

const ProductDescription = ({ description }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <h3 className="font-bold text-gray-900 mb-2">Description</h3>
      <div
        className="prose prose-sm text-gray-600 max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

export default ProductDescription;
