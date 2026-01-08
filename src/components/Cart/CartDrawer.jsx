import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shopping Cart ({cartItems.length})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className="w-16 h-16 text-gray-200" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-lagoon-600 font-semibold hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.uniqueId} className="flex gap-4">
                {/* Image */}
                <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                  <img
                    src={
                      item.image ||
                      "https://dummyimage.com/150x200/f3f4f6/9ca3af&text=No+Img"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">
                      <Link
                        to={`/product/${item.productId}/${item.slug}`}
                        onClick={() => setIsCartOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </h3>
                    <div className="text-sm text-gray-500 mt-1 space-x-2">
                      {Object.entries(item.attributes).map(([key, val]) => (
                        <span
                          key={key}
                          className="inline-block bg-gray-50 px-2 py-0.5 rounded text-xs border border-gray-100 capitalize"
                        >
                          {key}: {val}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-3 border border-gray-200 rounded-lg px-2 py-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.uniqueId, item.quantity - 1)
                        }
                        className="text-gray-500 hover:text-red-500 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.uniqueId, item.quantity + 1)
                        }
                        className="text-gray-500 hover:text-green-500 disabled:opacity-30"
                        disabled={item.quantity >= item.maxQuantity}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-gray-900">
                        Tk {(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.uniqueId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">
                Tk {getCartTotal()}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4 text-center">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              to="/checkout"
              className="block w-full bg-lagoon-600 text-white text-center py-4 rounded-full font-bold shadow-lg shadow-lagoon-200 hover:bg-lagoon-700 transition-all hover:scale-[1.02] active:scale-95"
              onClick={() => setIsCartOpen(false)}
            >
              Checkout Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
