import React from "react";
import { CreditCard } from "lucide-react";

const PaymentMethod = ({
  paymentMethod,
  setPaymentMethod,
  paymentDetails,
  setPaymentDetails,
  orderInfo,
}) => {
  return (
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
          <div className="font-semibold text-gray-900">Cash on Delivery</div>
          <div className="text-sm text-gray-500 mt-1">Pay when you receive</div>
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
            {orderInfo?.bkash_changed}% Charge applies
          </div>
        </button>
      </div>

      {/* bKash Details Inputs */}
      {paymentMethod === "bkash" && (
        <div className="mt-6 space-y-4 animate-fade-in p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              bKash Phone Number
            </label>
            <input
              type="text"
              placeholder="01XXXXXXXXX"
              value={paymentDetails.phone}
              onChange={(e) =>
                setPaymentDetails({
                  ...paymentDetails,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lagoon-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction ID (TrxID)
            </label>
            <input
              type="text"
              placeholder="e.g. 9G7..."
              value={paymentDetails.trx}
              onChange={(e) =>
                setPaymentDetails({
                  ...paymentDetails,
                  trx: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lagoon-500 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
