import React from "react";

const ProductDescription = ({ description }) => {
  return (
    <div className="mt-12 pt-10 border-t border-gray-100">
      <h3 className="text-lg font-serif font-bold text-gray-900 mb-6 uppercase tracking-widest">
        Description
      </h3>
      <div
        className="prose prose-base text-gray-600 max-w-none font-light leading-relaxed"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

export default ProductDescription;
