import axios from "axios";
import config from "../config/config";

const api = axios.create({
    baseURL: config.API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Helper to filter active items
const filterActive = (items) => items.filter((item) => item.status === 1);

export const fetchParentCategories = async () => {
    try {
        const response = await api.get("/categories/parents");
        if (response.data.success) {
            return {
                ...response.data,
                data: filterActive(response.data.data),
            };
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching parent categories:", error);
        throw error;
    }
};

export const fetchParentCategory = async (id) => {
    try {
        const response = await api.get(`/categories/parents/${id}`);
        if (response.data.success) {
            // The single category object is in data.
            // We also want to filter its 'categories' (sub-categories) if they exist.
            const categoryData = response.data.data;
            if (categoryData.categories && Array.isArray(categoryData.categories)) {
                categoryData.categories = filterActive(categoryData.categories);
            }
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error(`Error fetching parent category ${id}:`, error);
        throw error;
    }
};

export const fetchAllCategories = async () => {
    try {
        const response = await api.get("/categories");
        if (response.data.success) {
            return {
                ...response.data,
                data: filterActive(response.data.data),
            };
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching all categories:", error);
        throw error;
    }
};

export const fetchProducts = async (params = {}) => {
    try {
        const response = await api.get("/products", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const fetchProduct = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
    }
};

export const recordProductView = async (productId) => {
    try {
        const response = await api.post("/products/view", { product_id: productId });
        return response.data;
    } catch (error) {
        console.error("Error recording product view:", error);
        // We don't throw here to prevent blocking the UI for tracking fails
        return null;
    }
};

export const recordParentCategoryView = async (id) => {
    try {
        const response = await api.post("/categories/parents/view", { parent_category_id: id });
        return response.data;
    } catch (error) {
        console.error("Error recording parent category view:", error);
        return null; // Silent fail
    }
};

export const recordCategoryView = async (id) => {
    try {
        const response = await api.post("/categories/view", { category_id: id });
        return response.data;
    } catch (error) {
        console.error("Error recording category view:", error);
        return null; // Silent fail
    }
};

// Keeping mock product service for now as no API was provided for products
export const fetchFeaturedProducts = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                status: 200,
                message: "Products retrieved successfully.",
                data: [
                    {
                        id: 1,
                        name: "Essential Cotton T-Shirt",
                        price: 29.99,
                        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
                        category_id: 1
                    },
                    {
                        id: 2,
                        name: "Classic Denim Jacket",
                        price: 89.99,
                        image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
                        category_id: 1
                    },
                    // ... keeping a few mock products
                    {
                        id: 3,
                        name: "Summer Floral Dress",
                        price: 59.99,
                        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800",
                        category_id: 2
                    }
                ]
            });
        }, 500);
    });
};

export const submitContactForm = async (data) => {
    try {
        const response = await api.post("/contact", data);
        return response.data;
    } catch (error) {
        console.error("Contact form submission error:", error);
        throw error;
    }
};

export const fetchTopSellingProducts = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/products/top-selling?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Fetch top selling products error:", error);
        throw error;
    }
};

export const fetchMostPopularProducts = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/products/most-viewed?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Fetch most popular products error:", error);
        throw error;
    }
};

export default api;
