import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, fetchUserInfo } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await fetchUserInfo();
          if (userData.success) {
            setUser(userData.data);
          } else {
            console.error("Failed to fetch user info:", userData.message);
            logout(); // Invalid token
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      if (response.success && response.data.token) {
        const newToken = response.data.token;
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
        // User info might be in response or need separate fetch,
        // let's assume we need to fetch it or use what's returned.
        // If the login response doesn't have user details, the effect will fetch it.
        // But usually login returns user data.
        if (response.data.user) {
          setUser(response.data.user);
        }
        return { success: true };
      }
      return { success: false, message: response.message || "Login failed" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      // The registration API returns the user object but no token.
      // We return success so the calling component can handle next steps (e.g. login).
      if (response.success) {
        return { success: true };
      }
      return {
        success: false,
        message: response.message || "Registration failed",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
