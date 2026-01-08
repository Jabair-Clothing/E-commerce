import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { fetchOrderInfo } from "../services/api";
import { Loader2, Truck, CreditCard, MapPin, Calculator } from "lucide-react";

const Checkout = () => {
  const { cartItems: cart } = useCart();
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State (Placeholder for now as focus is on costs)
  const [shippingMethod, setShippingMethod] = useState("inside"); // inside, outside, pickup
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod, bkash

  useEffect(() => {
    const loadOrderInfo = async () => {
      try {
        const response = await fetchOrderInfo();
        if (response.success) {
          setOrderInfo(response.data);
        } else {
          setError("Failed to load order information.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while loading order information.");
      } finally {
        setLoading(false);
      }
    };
    loadOrderInfo();
  }, []);

  // Calculations
  const calculateCosts = () => {
    // 1. Subtotal
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // 2. Shipping Cost
    let shippingCost = 0;
    if (orderInfo) {
      if (shippingMethod === "inside") shippingCost = orderInfo.inside_dhaka;
      else if (shippingMethod === "outside")
        shippingCost = orderInfo.outside_dhaka;
      else if (shippingMethod === "pickup") shippingCost = 0;
    }

    // 3. VAT (Assuming percentage from "7.500")
    // If vat is string "7.500", parseFloat gives 7.5
    let vatAmount = 0;
    if (orderInfo) {
      const vatRate = parseFloat(orderInfo.vat || 0);
      vatAmount = (subtotal * vatRate) / 100;
    }

    // Intermediate Total for Payment Charge Calc?
    // Usually Payment Charge is on the Payable Amount.
    const totalBeforePaymentCharge = subtotal + shippingCost + vatAmount;

    // 4. Payment Charge (bKash)
    let paymentCharge = 0;
    if (paymentMethod === "bkash" && orderInfo) {
      const bkashRate = parseFloat(orderInfo.bkash_changed || 0);
      paymentCharge = (totalBeforePaymentCharge * bkashRate) / 100;
    }

    const total = totalBeforePaymentCharge + paymentCharge;

    return {
      subtotal,
      shippingCost,
      vatAmount,
      paymentCharge,
      total,
    };
  };

  const costs = calculateCosts();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-lagoon-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Calculator className="w-8 h-8 text-lagoon-600" />
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Options */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Method */}
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

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-lagoon-600" />
              Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === "cod"
                    ? "border-lagoon-600 bg-lagoon-50"
                    : "border-gray-100 hover:border-lagoon-200"
                }`}
              >
                <div className="font-semibold text-gray-900">
                  Cash on Delivery
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Pay when you receive
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("bkash")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === "bkash"
                    ? "border-lagoon-600 bg-lagoon-50"
                    : "border-gray-100 hover:border-lagoon-200"
                }`}
              >
                <div className="font-semibold text-gray-900">bKash</div>
                <div className="text-sm text-gray-500 mt-1">
                  {orderInfo.bkash_changed}% Charge applies
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  Tk {costs.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">
                  Tk {costs.shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VAT ({orderInfo.vat || 0}%)</span>
                <span className="font-medium text-gray-900">
                  Tk {costs.vatAmount.toFixed(2)}
                </span>
              </div>
              {costs.paymentCharge > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>bKash Charge ({orderInfo.bkash_changed || 0}%)</span>
                  <span className="font-medium">
                    + Tk {costs.paymentCharge.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t pt-4 mt-4 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-lagoon-600">
                  Tk {costs.total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => alert("Proceed to Payment logic here")}
              className="w-full mt-8 bg-lagoon-600 text-white py-4 rounded-xl font-bold hover:bg-lagoon-700 transition-all shadow-lg shadow-lagoon-200"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
