import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Loader2 } from "lucide-react";
import { useCategories } from "../../context/CategoryContext";
import { fetchParentCategory } from "../../services/api";

const MegaMenu = () => {
  const { parentCategories, loading } = useCategories();
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Cache to store fetched category details: { [id]: categoryData }
  const categoryCache = useRef({});

  // Initialize with first category
  useEffect(() => {
    const initCategory = async () => {
      if (parentCategories && parentCategories.length > 0) {
        const firstCat = parentCategories[0];
        // If we haven't fetched details for the first category yet, do it
        await handleCategoryHover(firstCat);
      }
    };
    initCategory();
  }, [parentCategories]);

  // Update preview image when active category changes
  useEffect(() => {
    if (activeCategory) {
      setPreviewImage(activeCategory.image_url);
    }
  }, [activeCategory]);

  const handleCategoryHover = async (category) => {
    // If we're already showing this category, do nothing
    if (activeCategory?.id === category.id) return;

    // Check cache first
    if (categoryCache.current[category.id]) {
      setActiveCategory(categoryCache.current[category.id]);
      return;
    }

    // Set temporary active state while loading (keeps title visible)
    setActiveCategory(category);
    setIsLoadingDetails(true);

    try {
      const response = await fetchParentCategory(category.id);
      if (response.success) {
        const detailedCategory = response.data;
        // Update cache
        categoryCache.current[category.id] = detailedCategory;
        // Update state
        setActiveCategory(detailedCategory);
      }
    } catch (error) {
      console.error("Failed to fetch category details", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="relative group">
      <button className="flex items-center text-gray-600 hover:text-lagoon-600 font-medium transition-colors py-4">
        Categories
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      <div className="absolute left-0 top-full w-[800px] bg-white border border-gray-100 shadow-xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
        <div className="flex h-[400px]">
          {/* Sidebar: Parent Categories */}
          <div className="w-1/4 bg-gray-50 py-4 overflow-y-auto">
            {!loading &&
              parentCategories.map((category) => (
                <div
                  key={category.id}
                  onMouseEnter={() => handleCategoryHover(category)}
                  className={`px-6 py-3 cursor-pointer text-sm font-medium transition-colors flex items-center justify-between ${
                    activeCategory?.id === category.id
                      ? "bg-white text-lagoon-600 border-l-4 border-lagoon-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-lagoon-600"
                  }`}
                >
                  {category.name}
                </div>
              ))}
          </div>

          {/* Content Area: Subcategories & Image */}
          <div className="flex-1 flex p-8 bg-white relative min-h-[300px]">
            {activeCategory ? (
              isLoadingDetails ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                  <Loader2 className="w-8 h-8 text-lagoon-600 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="flex-1 pr-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      {activeCategory.name}
                      <Link
                        to={`/shop?parent_category_id=${activeCategory.id}`}
                        className="ml-4 text-xs font-medium text-lagoon-600 hover:text-lagoon-700 underline"
                      >
                        View All
                      </Link>
                    </h3>

                    {/* Note: API returns 'categories' for subcategories */}
                    {activeCategory.categories &&
                    activeCategory.categories.length > 0 ? (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {activeCategory.categories.map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/shop?parent_category_id=${activeCategory.id}&category_id=${sub.id}`}
                            onMouseEnter={() => setPreviewImage(sub.image_url)}
                            onMouseLeave={() =>
                              setPreviewImage(activeCategory.image_url)
                            }
                            className="text-sm text-gray-600 hover:text-lagoon-600 hover:translate-x-1 transition-all block"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No subcategories available.
                      </p>
                    )}
                  </div>

                  <div className="w-64 relative rounded-xl overflow-hidden shadow-md group/image">
                    <img
                      src={
                        previewImage ||
                        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
                      }
                      alt={activeCategory.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2 py-1 rounded-sm">
                        Featured
                      </span>
                    </div>
                  </div>
                </>
              )
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Hover over a category to see details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
