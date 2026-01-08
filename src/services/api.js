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

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Auth APIs
export const loginUser = async (email, password) => {
    try {
        const response = await api.post("/users/login", { email, password });
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post("/users/register", userData);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

export const fetchUserInfo = async () => {
    try {
        const response = await api.get("/users/info");
        return response.data;
    } catch (error) {
        console.error("Fetch user info error:", error);
        throw error;
    }
};

export const fetchUserDashboard = async () => {
    try {
        const response = await api.get("/users/dashboard");
        return response.data;
    } catch (error) {
        console.error("Fetch dashboard error:", error);
        throw error;
    }
};

export const updateUserInfo = async (userData) => {
    try {
        const response = await api.put("/update-user-info", userData);
        return response.data;
    } catch (error) {
        console.error("Update user info error:", error);
        throw error;
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await api.post("/change-password", passwordData);
        return response.data;
    } catch (error) {
        console.error("Change password error:", error);
        throw error;
    }
};

// Shipping Address APIs
export const fetchUserOrders = async (page = 1, limit = 10, search = "") => {
    try {
        const response = await api.get(`/orders/users?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchOrderDetails = async (invoiceCode) => {
    try {
        const response = await api.get(`/orders/users/${invoiceCode}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};



// Wishlist APIs
export const fetchWishlist = async () => {
    try {
        const response = await api.get("/wishlist");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addToWishlist = async (data) => {
    try {
        const response = await api.post("/wishlist", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeFromWishlist = async (wishlistId) => {
    try {
        const response = await api.delete(`/wishlist/${wishlistId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchShippingAddresses = async () => {
    try {
        const response = await api.get("/shipping-addresses");
        return response.data;
    } catch (error) {
        console.error("Fetch shipping addresses error:", error);
        throw error;
    }
};

export const addShippingAddress = async (addressData) => {
    try {
        const response = await api.post("/shipping-addresses", addressData);
        return response.data;
    } catch (error) {
        console.error("Add shipping address error:", error);
        throw error;
    }
};

export const updateShippingAddress = async (id, addressData) => {
    try {
        const response = await api.put(`/shipping-addresses/${id}`, addressData);
        return response.data;
    } catch (error) {
        console.error(`Update shipping address ${id} error:`, error);
        throw error;
    }
};

export const deleteShippingAddress = async (id) => {
    try {
        const response = await api.delete(`/shipping-addresses/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Delete shipping address ${id} error:`, error);
        throw error;
    }
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

export const submitRating = async (data) => {
    try {
        const response = await api.post("/ratings", data);
        return response.data;
    } catch (error) {
        console.error("Submit rating error:", error);
        throw error;
    }
};

export default api;
