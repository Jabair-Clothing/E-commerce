import React, { useEffect, useState } from "react";
import { fetchMostPopularProducts } from "../../services/api";
import ProductCard from "../UI/ProductCard";
import { Link } from "react-router-dom";
import ProductQuickView from "../UI/ProductQuickView";
import { useCart } from "../../context/CartContext";

const MostPopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchMostPopularProducts();
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

  const handleAddToCart = (product) => {
    addToCart({ ...product, image: product.primary_image || product.image });
    setIsCartOpen(true);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Most Popular
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover what everyone is raving about. Our most viewed items,
            curated just for you.
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
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/most-popular"
            className="inline-block px-8 py-3 border-2 border-lagoon-500 text-lagoon-600 font-semibold rounded-full hover:bg-lagoon-500 hover:text-white transition-all duration-300"
          >
            View All Popular
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

export default MostPopularProducts;
