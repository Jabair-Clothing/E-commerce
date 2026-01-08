import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Home from "./pages/Home";
import { CategoryProvider } from "./context/CategoryContext";
import CategoryPage from "./pages/CategoryPage";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/Cart/CartDrawer";
import { AuthProvider } from "./context/AuthContext";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";

const App = () => {
  return (
    <Router>
      <CartProvider>
        <CategoryProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-grow">
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route
                      path="/product/:id/:slug"
                      element={<ProductDetails />}
                    />
                    <Route path="/category/:slug" element={<CategoryPage />}>
                      <Route path=":subSlug" element={<CategoryPage />} />
                    </Route>
                    {/* User Routes */}
                    <Route
                      path="/user/dashboard"
                      element={
                        <ProtectedRoute>
                          <UserDashboard />
                        </ProtectedRoute>
                      }
                    />
                    {/* Redirect /account to /user/dashboard for now */}
                    <Route
                      path="/account"
                      element={<Navigate to="/user/dashboard" replace />}
                    />
                  </Routes>
                </main>
              </div>
              <Footer />
            </div>
            <CartDrawer />
          </AuthProvider>
        </CategoryProvider>
      </CartProvider>
    </Router>
  );
};

export default App;
