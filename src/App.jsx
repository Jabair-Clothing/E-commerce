import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Home from "./pages/Home";
import { CategoryProvider } from "./context/CategoryContext";
import CategoryPage from "./pages/CategoryPage";
import AllCategories from "./pages/AllCategories";
import Shop from "./pages/Shop";
import BestSelling from "./pages/BestSelling";
import MostPopular from "./pages/MostPopular";
import ProductDetails from "./pages/ProductDetails";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Contact from "./pages/Contact";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

const App = () => {
  return (
    <Router>
      <CategoryProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-grow">
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/best-selling" element={<BestSelling />} />
                <Route path="/most-popular" element={<MostPopular />} />
                <Route path="/categories" element={<AllCategories />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />

                <Route path="/product/:id/:slug" element={<ProductDetails />} />
                <Route path="/category/:slug" element={<CategoryPage />}>
                  <Route path=":subSlug" element={<CategoryPage />} />
                </Route>
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </CategoryProvider>
    </Router>
  );
};

export default App;
