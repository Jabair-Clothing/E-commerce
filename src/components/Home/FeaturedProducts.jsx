import React, { useEffect, useState } from "react";
import { fetchFeaturedProducts } from "../../services/api";
import ProductCard from "../UI/ProductCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchFeaturedProducts();
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Collection
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Handpicked styles for the modern wardrobe. Quality, sustainability,
            and comfort in every piece.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading Products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-lagoon-500 text-lagoon-600 font-semibold rounded-full hover:bg-lagoon-500 hover:text-white transition-all duration-300">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
