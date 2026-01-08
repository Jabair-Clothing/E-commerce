import React from "react";
import { Truck } from "lucide-react";

const ShippingMethod = ({ shippingMethod, setShippingMethod, orderInfo }) => {
  if (!orderInfo) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5 text-lagoon-600" />
        Shipping Method
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShippingMethod("inside")}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            shippingMethod === "inside"
              ? "border-lagoon-600 bg-lagoon-50"
              : "border-gray-100 hover:border-lagoon-200"
          }`}
        >
          <div className="font-semibold text-gray-900">Inside Dhaka</div>
          <div className="text-sm text-gray-500 mt-1">
            Tk {orderInfo.inside_dhaka}
          </div>
        </button>

        <button
          onClick={() => setShippingMethod("outside")}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            shippingMethod === "outside"
              ? "border-lagoon-600 bg-lagoon-50"
              : "border-gray-100 hover:border-lagoon-200"
          }`}
        >
          <div className="font-semibold text-gray-900">Outside Dhaka</div>
          <div className="text-sm text-gray-500 mt-1">
            Tk {orderInfo.outside_dhaka}
          </div>
        </button>

        <button
          onClick={() => setShippingMethod("pickup")}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            shippingMethod === "pickup"
              ? "border-lagoon-600 bg-lagoon-50"
              : "border-gray-100 hover:border-lagoon-200"
          }`}
        >
          <div className="font-semibold text-gray-900">Shop Pickup</div>
          <div className="text-sm text-gray-500 mt-1">Free</div>
        </button>
      </div>
    </div>
  );
};

export default ShippingMethod;
