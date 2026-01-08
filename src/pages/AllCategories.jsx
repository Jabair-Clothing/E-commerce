import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchParentCategories, fetchParentCategory } from "../services/api";

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllCategories = async () => {
      try {
        // 1. Fetch all parent categories
        const parentsResponse = await fetchParentCategories();
        if (parentsResponse.success) {
          const parents = parentsResponse.data;

          // 2. Fetch details for each parent to get subcategories (parallel)
          const detailedCategories = await Promise.all(
            parents.map(async (parent) => {
              try {
                const detailResponse = await fetchParentCategory(parent.id);
                if (detailResponse.success) {
                  return detailResponse.data;
                }
                return parent; // Fallback to basic info if fetch fails
              } catch (e) {
                return parent;
              }
            })
          );
          setCategories(detailedCategories);
        }
      } catch (error) {
        console.error("Failed to load all categories", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-lagoon-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
        All Categories
      </h1>
      <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
        Explore our comprehensive collection. From trending styles to timeless
        classics, find everything you need right here.
      </p>

      <div className="space-y-20">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`flex flex-col md:flex-row gap-8 lg:gap-16 items-center ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Category Image */}
            <div className="w-full md:w-1/2 h-[400px] relative group rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={category.image_url}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-3xl font-bold mb-2">{category.name}</h2>
                <Link
                  to={`/category/${category.slug}`}
                  className="inline-flex items-center text-sm font-semibold hover:underline"
                >
                  Browse Collection <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Subcategories List */}
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-1 bg-lagoon-500 rounded mr-4"></span>
                {category.name} Collection
              </h3>

              {category.categories && category.categories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {category.categories.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/category/${category.slug}/${sub.slug}`}
                      className="group flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100"
                    >
                      <div className="w-16 h-16 mb-3 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={
                            sub.image_url ||
                            "https://dummyimage.com/100x100/e0e0e0/ffffff&text=Img"
                          }
                          alt={sub.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-lagoon-600 text-center">
                        {sub.name}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">
                  No subcategories available at the moment.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCategories;
