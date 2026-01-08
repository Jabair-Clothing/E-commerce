import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  // Using a high-quality fashion image from Unsplash
  const bgImage = "/family_fashion_hero.png";

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: "50% 40%",
        }}
      >
        {/* Lagoon Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-lagoon-900/80 via-lagoon-800/40 to-transparent mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-start text-white">
        <div className="max-w-2xl animate-fade-in-up">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase border border-white/30 rounded-full bg-white/10 backdrop-blur-sm">
            New Arrival
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            New Collection <br />
            <span className="text-lagoon-300">2026</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 font-light max-w-lg leading-relaxed">
            Discover the latest trends in sustainable fashion. Elegant choices
            for every season, designed to make you shine.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/shop"
              className="group flex items-center justify-center bg-lagoon-500 hover:bg-lagoon-400 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-lagoon-900/20"
            >
              Shop Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/categories"
              className="flex items-center justify-center bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold transition-all backdrop-blur-sm"
            >
              View Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
