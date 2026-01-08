import React, { useState } from "react";
import { Loader2, Check } from "lucide-react";

const OrderSummary = ({
  costs,
  orderInfo,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  appliedCoupon,
  couponError,
  isApplyingCoupon,
  handlePlaceOrder,
  isPlacingOrder,
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Order Summary
        </h2>

        {/* Coupon Section */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg uppercase text-sm focus:ring-2 focus:ring-lagoon-500 outline-none"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon || !couponCode}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50"
            >
              {isApplyingCoupon ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </button>
          </div>
          {couponError && (
            <p className="text-red-500 text-xs mt-1">{couponError}</p>
          )}
          {appliedCoupon && (
            <div className="mt-2 bg-green-50 text-green-700 p-2 rounded-lg text-xs flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3" /> Coupon Applied
              </span>
              <span className="font-bold">- Tk {appliedCoupon.discount}</span>
            </div>
          )}
        </div>

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
          {costs.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span className="font-medium">
                - Tk {costs.discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>VAT ({orderInfo?.vat || 0}%)</span>
            <span className="font-medium text-gray-900">
              Tk {costs.vatAmount.toFixed(2)}
            </span>
          </div>
          {costs.paymentCharge > 0 && (
            <div className="flex justify-between text-orange-600">
              <span>bKash Charge ({orderInfo?.bkash_changed || 0}%)</span>
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
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full mt-8 bg-lagoon-600 text-white py-4 rounded-xl font-bold hover:bg-lagoon-700 transition-all shadow-lg shadow-lagoon-200 disabled:opacity-70 flex items-center justify-center"
        >
          {isPlacingOrder ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
