import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  // Using a high-quality fashion image from Unsplash
  const bgImage = "/luxury_hero.png";

  return (
    <div className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: "50% 40%",
        }}
      >
        {/* Dark Luxury Overlay - Stronger for text contrast */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-start text-white">
        <div className="max-w-4xl animate-fade-in-up">
          <span className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase border border-accent-400 text-accent-400 rounded-sm bg-black/20 backdrop-blur-sm">
            Est. 2026
          </span>
          <h1 className="text-5xl md:text-8xl font-serif font-bold leading-tight mb-8">
            Premium Garment <br />
            <span className="text-accent-400 italic">Manufacturing</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 font-light max-w-xl leading-relaxed tracking-wide">
            Global export quality standards. Sustainable production. Crafting
            the future of fashion for leading brands worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              to="/contact"
              className="group flex items-center justify-center bg-accent-600 hover:bg-accent-500 text-white px-10 py-4 rounded-sm font-bold tracking-widest uppercase transition-all transform hover:translate-y-[-2px] shadow-xl"
            >
              Request Quote
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/categories"
              className="flex items-center justify-center bg-transparent border border-white/50 hover:bg-white/10 hover:border-white text-white px-10 py-4 rounded-sm font-bold tracking-widest uppercase transition-all backdrop-blur-sm"
            >
              View Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
