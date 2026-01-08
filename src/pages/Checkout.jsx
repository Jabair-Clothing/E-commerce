import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  fetchOrderInfo,
  checkCoupon,
  placeOrder,
  fetchShippingAddresses,
} from "../services/api";
import { Loader2, Calculator } from "lucide-react";

import AuthModal from "../components/Auth/AuthModal";
import OrderItems from "../components/Checkout/OrderItems";
import ShippingAddress from "../components/Checkout/ShippingAddress";
import ShippingMethod from "../components/Checkout/ShippingMethod";
import PaymentMethod from "../components/Checkout/PaymentMethod";
import OrderSummary from "../components/Checkout/OrderSummary";

const Checkout = () => {
  const {
    cartItems: cart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");

  // Checkout State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingMethod, setShippingMethod] = useState("inside"); // inside, outside, pickup

  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod, bkash
  const [paymentDetails, setPaymentDetails] = useState({ phone: "", trx: "" });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const orderRes = await fetchOrderInfo();
        if (orderRes.success) {
          setOrderInfo(orderRes.data);
        }

        if (isAuthenticated) {
          const addressRes = await fetchShippingAddresses();
          if (addressRes.success) {
            setShippingAddresses(addressRes.data);
            // Auto-select first address if available
            if (addressRes.data.length > 0) {
              setSelectedAddressId(addressRes.data[0].id);
            }
          }
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while loading checkout data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated]);

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

    // 3. Discount (from Coupon)
    const discount = appliedCoupon ? appliedCoupon.discount : 0;

    // 4. VAT
    let vatAmount = 0;
    if (orderInfo) {
      const vatRate = parseFloat(orderInfo.vat || 0);
      vatAmount = (subtotal * vatRate) / 100;
    }

    // Intermediate Total
    const totalBeforePaymentCharge =
      subtotal + shippingCost + vatAmount - discount;
    const payableBeforeCharge = Math.max(0, totalBeforePaymentCharge);

    // 5. Payment Charge (bKash)
    let paymentCharge = 0;
    if (paymentMethod === "bkash" && orderInfo && payableBeforeCharge > 0) {
      const bkashRate = parseFloat(orderInfo.bkash_changed || 0);
      paymentCharge = (payableBeforeCharge * bkashRate) / 100;
    }

    const total = payableBeforeCharge + paymentCharge;

    return {
      subtotal,
      shippingCost,
      vatAmount,
      discount,
      paymentCharge,
      total,
    };
  };

  const costs = calculateCosts();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      // Prepare products array for API
      const productsPayload = cart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      }));

      const res = await checkCoupon({
        coupon_code: couponCode,
        total_amount: costs.subtotal, // API check usually against cart value
        user_id: user?.id,
        products: productsPayload,
      });

      if (res.success) {
        setAppliedCoupon(res.data);
        // Clear error if any
        setCouponError(null);
      } else {
        setAppliedCoupon(null);
        setCouponError(res.message);
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || "Invalid coupon.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId && shippingMethod !== "pickup") {
      alert("Please select a shipping address.");
      return;
    }
    if (
      paymentMethod === "bkash" &&
      (!paymentDetails.phone || !paymentDetails.trx)
    ) {
      alert("Please provide bKash payment details (Phone & Transaction ID).");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const productsPayload = cart.map((item) => ({
        product_id: item.productId,
        product_sku_id: item.skuId || item.productId, // Fallback if simple product
        quantity: item.quantity,
      }));

      const payload = {
        user_id: user?.id,
        coupon_id: appliedCoupon ? appliedCoupon.coupon_id : null,
        shipping_id: selectedAddressId,
        shipping_charge: costs.shippingCost,
        product_subtotal: costs.subtotal,
        total: costs.total,
        payment_type: paymentMethod === "bkash" ? 2 : 1, // 1=COD, 2=bKash
        trxed: paymentMethod === "bkash" ? paymentDetails.trx : null,
        paymentphone: paymentMethod === "bkash" ? paymentDetails.phone : null,
        products: productsPayload,
      };

      const res = await placeOrder(payload);

      if (res.success) {
        alert("Order placed successfully!");
        clearCart();
        // Navigate to confirm or dashboard
        window.location.href = "/user/dashboard";
      } else {
        alert(res.message || "Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "An error occurred while placing the order."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Wait for auth check
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-lagoon-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="container mx-auto px-4 py-16 animate-fade-in flex flex-col items-center justify-center text-center max-w-md">
          <div className="bg-lagoon-100 p-4 rounded-full mb-6">
            <Calculator className="w-8 h-8 text-lagoon-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h1>
          <p className="text-gray-500 mb-8">
            Please log in to proceed with your checkout. Accounts help track
            your orders and save your details.
          </p>

          <div className="space-y-3 w-full">
            <button
              onClick={() => {
                setAuthModalTab("login");
                setIsAuthModalOpen(true);
              }}
              className="block w-full bg-lagoon-600 text-white py-3 rounded-xl font-bold hover:bg-lagoon-700 transition-colors"
            >
              Log In
            </button>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">
                OR
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <button
              onClick={() => {
                setAuthModalTab("register");
                setIsAuthModalOpen(true);
              }}
              className="block w-full bg-white border-2 border-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:border-lagoon-600 hover:text-lagoon-600 transition-colors"
            >
              Create an Account
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authModalTab}
        />
      </>
    );
  }

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
          <ShippingAddress
            shippingAddresses={shippingAddresses}
            setShippingAddresses={setShippingAddresses}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            user={user}
          />

          <OrderItems
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />

          <ShippingMethod
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
            orderInfo={orderInfo}
          />

          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            paymentDetails={paymentDetails}
            setPaymentDetails={setPaymentDetails}
            orderInfo={orderInfo}
          />
        </div>

        {/* Right Column: Order Summary */}
        <OrderSummary
          costs={costs}
          orderInfo={orderInfo}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          handleApplyCoupon={handleApplyCoupon}
          appliedCoupon={appliedCoupon}
          couponError={couponError}
          isApplyingCoupon={isApplyingCoupon}
          handlePlaceOrder={handlePlaceOrder}
          isPlacingOrder={isPlacingOrder}
        />
      </div>
    </div>
  );
};

export default Checkout;
