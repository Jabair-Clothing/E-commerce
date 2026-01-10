import React from "react";
import Hero from "../components/Home/Hero";
import CategorySection from "../components/Home/CategorySection";
import FeaturedProducts from "../components/Home/FeaturedProducts";
import MostPopularProducts from "../components/Home/MostPopularProducts";

const Home = () => {
  return (
    <div className="animate-fade-in">
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <MostPopularProducts />
    </div>
  );
};

export default Home;
