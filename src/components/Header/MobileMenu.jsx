import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Loader2 } from "lucide-react";
import { useCategories } from "../../context/CategoryContext";
import { fetchParentCategory } from "../../services/api";

const MobileMenu = ({ isOpen, onClose }) => {
  const { parentCategories } = useCategories();
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] =
    useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState(null);
  const [activeCategoryData, setActiveCategoryData] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Cache for fetched details
  const categoryCache = useRef({});

  const handleCategoryExpand = async (category) => {
    if (mobileActiveCategory === category.id) {
      setMobileActiveCategory(null);
      return;
    }

    setMobileActiveCategory(category.id);

    // Check cache
    if (categoryCache.current[category.id]) {
      setActiveCategoryData(categoryCache.current[category.id]);
      return;
    }

    setIsLoadingDetails(true);
    try {
      const response = await fetchParentCategory(category.id);
      if (response.success) {
        categoryCache.current[category.id] = response.data;
        setActiveCategoryData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch category details", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg absolute w-full left-0 animate-fade-in-down h-[calc(100vh-80px)] overflow-y-auto z-40">
        <div className="flex flex-col space-y-4">
          {["Home", "Shop", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-gray-600 hover:text-lagoon-600 font-medium text-lg"
              onClick={onClose}
            >
              {item}
            </Link>
          ))}

          {/* Mobile Categories Expansion */}
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={() =>
                setMobileCategoriesExpanded(!mobileCategoriesExpanded)
              }
              className="flex items-center justify-between w-full text-gray-900 font-bold text-lg mb-2"
            >
              Categories
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  mobileCategoriesExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileCategoriesExpanded && (
              <div className="pl-4 space-y-3">
                {parentCategories.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryExpand(item);
                      }}
                      className="flex items-center justify-between w-full text-gray-600 font-medium py-1"
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileActiveCategory === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Subcategories for Mobile */}
                    {mobileActiveCategory === item.id && (
                      <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-100">
                        {isLoadingDetails ? (
                          <div className="flex items-center text-lagoon-600">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                            Loading...
                          </div>
                        ) : activeCategoryData?.id === item.id ? (
                          <>
                            <Link
                              to={`/category/${item.slug}`}
                              className="block text-sm text-lagoon-600 font-semibold mb-2"
                              onClick={onClose}
                            >
                              View All {item.name}
                            </Link>
                            {activeCategoryData.categories?.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/category/${item.slug}/${sub.slug}`}
                                className="block text-sm text-gray-500 hover:text-lagoon-600"
                                onClick={onClose}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
