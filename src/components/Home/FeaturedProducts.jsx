import React, { useEffect, useState } from "react";
import { fetchTopSellingProducts } from "../../services/api";
import ProductCard from "../UI/ProductCard";
import { Link } from "react-router-dom";
import ProductQuickView from "../UI/ProductQuickView";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchTopSellingProducts();
        if (response.success && response.data && response.data.data) {
          // Map API data to ProductCard props and limit to 4
          const mappedProducts = response.data.data
            .slice(0, 4)
            .map((product) => ({
              ...product,
              image: product.primary_image, // Map primary_image to image
            }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  return (
    <section className="py-24 bg-primary-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 px-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-900 mb-6">
            Featured Products
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Exquisite craftsmanship meets modern design. Explore our latest
            manufacturing highlights tailored for global markets.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading Products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-block px-10 py-4 border border-primary-900 text-primary-900 font-bold uppercase tracking-[0.2em] hover:bg-primary-900 hover:text-white transition-all duration-300"
          >
            View Full Catalog
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default FeaturedProducts;
