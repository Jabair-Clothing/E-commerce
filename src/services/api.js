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

// Add response interceptor to handle 401 Unauthorized (Token Expiration)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("authToken");
            // Optional: You might want to remove user data too if stored in local storage
            // Redirect to home page
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

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

export const fetchOrderInfo = async () => {
    try {
        const response = await api.get("/orderinfo");
        return response.data;
    } catch (error) {
        console.error("Fetch order info error:", error);
        throw error;
    }
};

// Coupon API
export const checkCoupon = async (data) => {
    try {
        const response = await api.post("/check-coupon", data);
        return response.data;
    } catch (error) {
        console.error("Check coupon error:", error);
        throw error;
    }
};


// Order API
export const placeOrder = async (data) => {
    try {
        const response = await api.post("/orders/place-order", data);
        return response.data;
    } catch (error) {
        console.error("Place order error:", error);
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

export default api;
