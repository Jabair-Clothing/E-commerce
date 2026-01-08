import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchParentCategories,
  fetchParentCategory,
  recordParentCategoryView,
} from "../services/api";
import { ArrowRight, Loader2 } from "lucide-react";

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        // 1. Fetch all parent categories to find the ID matching the slug
        const parentsResponse = await fetchParentCategories();
        if (parentsResponse.success) {
          const matchedParent = parentsResponse.data.find(
            (c) => c.slug === slug
          );

          if (matchedParent) {
            // Record View
            recordParentCategoryView(matchedParent.id);

            // 2. Fetch detailed info (subcategories) for this parent
            const detailResponse = await fetchParentCategory(matchedParent.id);
            if (detailResponse.success) {
              setCategory(detailResponse.data);
            } else {
              setError("Failed to load category details.");
            }
          } else {
            setError("Category not found.");
          }
        } else {
          setError("Failed to load categories.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadCategoryData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-lagoon-600 animate-spin" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Category Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the category you're looking for.
        </p>
        <Link
          to="/"
          className="bg-lagoon-600 text-white px-8 py-3 rounded-full font-bold hover:bg-lagoon-700 transition-all"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px]">
        <img
          src={category.image_url}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            {category.name}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 text-gray-100">
            Explore our latest collection of {category.name.toLowerCase()}.
            Quality, comfort, and style tailored just for you.
          </p>
          <Link
            to={`/shop?parent_category_id=${category.id}`}
            className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-lagoon-50 transition-all transform hover:-translate-y-1 shadow-xl flex items-center"
          >
            Browse Collection <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Subcategories Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            More from {category.name}
          </h2>
          <div className="h-1 w-20 bg-lagoon-500 rounded mx-auto"></div>
        </div>

        {category.categories && category.categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.categories.map((sub) => (
              <Link
                key={sub.id}
                to={`/shop?parent_category_id=${category.id}&category_id=${sub.id}`}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 block"
              >
                <img
                  src={
                    sub.image_url ||
                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800"
                  }
                  alt={sub.name}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
                    {sub.name}
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 italic">
            No subcategories found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
