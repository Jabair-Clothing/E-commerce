import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const About = () => {
  return (
    <div className="bg-white animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-black text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <span className="text-accent-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
            Since 2026
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
            The Art of <span className="text-accent-500 italic">Fabric.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Redefining fashion manufacturing with uncompromising quality,
            sustainable practices, and a legacy of excellence.
          </p>
        </div>
      </div>
      ...
      <div className="space-y-8">
        <h2 className="text-4xl font-serif font-bold text-black">
          Our Heritage
        </h2>
        <div className="w-20 h-1 bg-accent-500"></div>
        <p className="text-gray-600 leading-relaxed text-lg font-light">
          Founded in the heart of Dhaka, JABAIBGROUP began with a singular
          vision: to bridge the gap between world-class manufacturing and
          sustainable fashion. What started as a modest workshop has evolved
          into a powerhouse of garment production.
        </p>
        <p className="text-gray-600 leading-relaxed text-lg font-light">
          We believe that true luxury lies in the details. From the selection of
          the finest raw cotton to the final stitch, our process is governed by
          a relentless pursuit of perfection.
        </p>
        <div className="grid grid-cols-2 gap-8 pt-6">
          <div className="p-6 bg-gray-50 border border-gray-100 text-center group hover:border-accent-200 transition-colors">
            <h3 className="font-serif font-bold text-4xl text-black mb-2 group-hover:text-accent-600 transition-colors">
              50k+
            </h3>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Products Exported
            </p>
          </div>
          <div className="p-6 bg-gray-50 border border-gray-100 text-center group hover:border-accent-200 transition-colors">
            <h3 className="font-serif font-bold text-4xl text-black mb-2 group-hover:text-accent-600 transition-colors">
              100%
            </h3>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Sustainable
            </p>
          </div>
        </div>
      </div>
      ...
      {/* Values */}
      <div className="bg-gray-50 py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-4">
              Our Core Values
            </h2>
            <div className="w-12 h-1 bg-accent-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: MapPin,
                title: "Global Reach",
                desc: "Delivering excellence from our facilities to brands across the globe with seamless logistics.",
              },
              {
                icon: Phone,
                title: "Premium Support",
                desc: "Dedicated B2B account managers available 24/7 to ensure your production needs are met.",
              },
              {
                icon: Mail,
                title: "Transparent Process",
                desc: "Complete visibility into the manufacturing/supply chain for your peace of mind.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-black text-white rounded-none flex items-center justify-center mb-6 group-hover:bg-accent-600 transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
