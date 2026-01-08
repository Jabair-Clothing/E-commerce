import React from "react";

const ProductGallery = ({
  images,
  displayImage,
  setDisplayImage,
  stockQuantity,
  productName,
}) => {
  return (
    <div className="space-y-4">
      <div className="aspect-[4/5] w-full bg-gray-100 rounded-2xl overflow-hidden relative group">
        <img
          src={
            displayImage ||
            "https://dummyimage.com/600x800/f3f4f6/9ca3af&text=No+Image"
          }
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {stockQuantity === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {images?.map((img) => (
          <button
            key={img.id}
            onClick={() => setDisplayImage(img.url)}
            className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
              displayImage === img.url
                ? "border-lagoon-600 ring-2 ring-lagoon-100"
                : "border-transparent hover:border-gray-200"
            }`}
          >
            <img src={img.url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
