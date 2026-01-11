import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchParentCategories } from "../../services/api";
import { ArrowRight } from "lucide-react";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchParentCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500">
        Loading Categories...
      </div>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-900 mb-4">
              Our Collections
            </h2>
            <div className="h-1 w-24 bg-accent-500"></div>
          </div>
          <Link
            to="/categories"
            className="hidden md:flex items-center text-primary-600 font-bold hover:text-accent-600 transition-colors uppercase tracking-widest text-sm"
          >
            All Categories <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              to={`/shop?parent_category_id=${category.id}`}
              key={category.id}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 block"
            >
              <img
                src={category.image_url}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              {/* Lagoon Overlay on Hover */}
              <div className="absolute inset-0 bg-lagoon-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>

              <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <span className="inline-flex items-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Explore <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
