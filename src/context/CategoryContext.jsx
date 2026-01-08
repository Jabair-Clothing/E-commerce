import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchParentCategories, fetchAllCategories } from "../services/api";

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchParentCategories();
        if (response.success) {
          setParentCategories(response.data);
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ parentCategories, loading, error }}>
      {children}
    </CategoryContext.Provider>
  );
};
