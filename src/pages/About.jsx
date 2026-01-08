import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-lagoon-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Our Brand
          </h1>
          <p className="text-lg text-lagoon-100 max-w-2xl mx-auto">
            We are redefining fashion in Bangladesh with premium quality,
            sustainable practices, and designs that speak to your soul.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1000"
              alt="Our Story"
              className="rounded-2xl shadow-xl w-full h-[500px] object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in the heart of Dhaka, our journey began with a simple
              vision: to make premium fashion accessible to everyone in
              Bangladesh. We noticed a gap in the market for high-quality,
              trendy clothing that doesn't break the bank.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we are proud to serve thousands of customers across the
              country. Our commitment to quality means every piece of fabric is
              carefully selected, and every stitch is inspected to ensure it
              meets our high standards.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-4 bg-lagoon-50 rounded-xl">
                <h3 className="font-bold text-2xl text-lagoon-600 mb-1">
                  50k+
                </h3>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
              <div className="p-4 bg-lagoon-50 rounded-xl">
                <h3 className="font-bold text-2xl text-lagoon-600 mb-1">
                  100%
                </h3>
                <p className="text-sm text-gray-600">Authentic Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-lagoon-100 rounded-full flex items-center justify-center text-lagoon-600 mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Nationwide Delivery
              </h3>
              <p className="text-gray-600">
                From Dhaka to the remote corners of Bangladesh, we deliver right
                to your doorstep with our trusted logistics partners.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-lagoon-100 rounded-full flex items-center justify-center text-lagoon-600 mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Our support team is always ready to assist you. Whether it's a
                sizing query or an order update, we're just a call away.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-lagoon-100 rounded-full flex items-center justify-center text-lagoon-600 mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Easy Returns
              </h3>
              <p className="text-gray-600">
                Not satisfied with the fit? No worries! We offer a hassle-free
                return and exchange policy for your peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
