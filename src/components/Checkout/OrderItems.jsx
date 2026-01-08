import React from "react";
import { ShoppingBag } from "lucide-react";

const OrderItems = ({ cart, updateQuantity, removeFromCart }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-lagoon-600" />
        Order Items
      </h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.uniqueId}
            className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0"
          >
            <img
              src={
                item.image ||
                "https://dummyimage.com/100x100/f3f4f6/9ca3af&text=No+Image"
              }
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover bg-gray-50"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <div className="text-sm text-gray-500">
                Tk {item.price} x {item.quantity}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => {
                  if (item.quantity > 1) {
                    updateQuantity(item.uniqueId, item.quantity - 1);
                  } else {
                    if (confirm("Remove item from cart?")) {
                      removeFromCart(item.uniqueId);
                    }
                  }
                }}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-lagoon-600 transition-colors"
              >
                -
              </button>
              <span className="font-semibold text-gray-900 w-4 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-lagoon-600 transition-colors"
              >
                +
              </button>
            </div>

            <div className="font-bold text-gray-900 w-24 text-right">
              Tk {(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;
