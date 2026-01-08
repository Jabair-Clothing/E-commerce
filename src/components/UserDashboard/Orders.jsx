import React, { useState, useEffect } from "react";
import {
  Package,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Truck,
  CreditCard,
  ShoppingBag,
  Star,
} from "lucide-react";
import { fetchUserOrders, fetchOrderDetails } from "../../services/api";
import ReviewModal from "./ReviewModal";
import { useAuth } from "../../context/AuthContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Inline Order Details State
  const [activeOrder, setActiveOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] =
    useState(null);
  const { user } = useAuth();

  const loadOrders = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUserOrders(page);
      if (response.success) {
        setOrders(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || "Failed to fetch orders.");
      }
    } catch (err) {
      setError("Failed to load orders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const viewOrderDetails = async (invoiceCode) => {
    setDetailsLoading(true);
    setDetailsError(null);
    setActiveOrder(null);
    try {
      const response = await fetchOrderDetails(invoiceCode);
      if (response.success) {
        setActiveOrder(response.data);
      } else {
        setDetailsError(response.message || "Failed to load order details");
      }
    } catch (err) {
      setDetailsError("Failed to load order details");
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const getOrderStatus = (status) => {
    switch (parseInt(status)) {
      case 0:
        return { label: "Processing", color: "bg-blue-100 text-blue-800" };
      case 1:
        return { label: "Completed", color: "bg-green-100 text-green-800" };
      case 2:
        return { label: "On Hold", color: "bg-orange-100 text-orange-800" };
      case 3:
        return { label: "Cancelled", color: "bg-red-100 text-red-800" };
      case 4:
        return { label: "Refunded", color: "bg-gray-100 text-gray-800" };
      default:
        return { label: "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  if (activeOrder || detailsLoading) {
    // INLINE ORDER DETAILS VIEW
    return (
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={() => {
            setActiveOrder(null);
            setDetailsError(null);
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-lagoon-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>

        {detailsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-lagoon-600" />
          </div>
        ) : detailsError ? (
          <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-100">
            {detailsError}
          </div>
        ) : activeOrder ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Order #{activeOrder.invoice_code}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getOrderStatus(activeOrder.status).color
                    }`}
                  >
                    {getOrderStatus(activeOrder.status).label}
                  </span>
                </h2>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Placed on{" "}
                  {new Date(
                    activeOrder.created_at || activeOrder.order_placed_date
                  ).toLocaleDateString()}{" "}
                  at{" "}
                  {new Date(
                    activeOrder.created_at || activeOrder.order_placed_date
                  ).toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  Tk {activeOrder.total_amount}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Info */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-lagoon-600" />
                  Shipping Details
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  {activeOrder.shipping_address ? (
                    <>
                      <p>
                        <strong className="text-gray-900">Name:</strong>{" "}
                        {activeOrder.shipping_address.f_name}{" "}
                        {activeOrder.shipping_address.l_name}
                      </p>
                      <p>
                        <strong className="text-gray-900">Phone:</strong>{" "}
                        {activeOrder.shipping_address.phone}
                      </p>
                      <p>
                        <strong className="text-gray-900">Address:</strong>{" "}
                        {activeOrder.shipping_address.address}
                        {activeOrder.shipping_address.city
                          ? `, ${activeOrder.shipping_address.city}`
                          : ""}
                        {activeOrder.shipping_address.zip
                          ? `, ${activeOrder.shipping_address.zip}`
                          : ""}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">
                      No shipping address provided.
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-lagoon-600" />
                  Payment Summary
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium text-gray-900">
                      {activeOrder.payment_method || "Cash on Delivery"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      Tk{" "}
                      {activeOrder.item_subtotal || activeOrder.product_total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span className="font-medium text-gray-900">
                      Tk{" "}
                      {activeOrder.shipping_charge ||
                        activeOrder.delivery_charge}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-base font-bold text-gray-900">
                    <span>Total:</span>
                    <span>Tk {activeOrder.total_amount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-lagoon-600" />
                  Order Items ·{" "}
                  <span className="text-gray-500 font-normal">
                    {
                      (
                        activeOrder.order_items ||
                        activeOrder.order_details ||
                        []
                      ).length
                    }{" "}
                    Items
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {(
                  activeOrder.order_items ||
                  activeOrder.order_details ||
                  []
                ).map((item, idx) => (
                  <a
                    href={`/product/${item.product_id}/${item.slug}`}
                    key={idx}
                    className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors block"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.product_name}
                      </h4>
                      {/* SKU Display */}
                      {item.product_sku && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          SKU: {item.product_sku}
                        </div>
                      )}
                      {/* Attributes Display */}
                      {item.attributes_text && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {item.attributes_text}
                        </div>
                      )}

                      <div className="text-sm text-gray-500 mt-1">
                        Quantity:{" "}
                        <span className="font-medium text-gray-900">
                          {item.quantity || item.product_qty}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="font-bold text-gray-900">
                        Tk {item.price || item.product_price}
                      </p>
                      {/* Status 1 = Completed */}
                      {activeOrder.status == 1 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedProductForReview(item);
                            setReviewModalOpen(true);
                          }}
                          className="p-2 rounded-full hover:bg-yellow-50 text-gray-400 hover:text-yellow-500 transition-colors"
                          title="Rate Product"
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <ReviewModal
              isOpen={reviewModalOpen}
              onClose={() => setReviewModalOpen(false)}
              product={selectedProductForReview}
              userId={user?.id}
            />
          </div>
        ) : null}
      </div>
    );
  }

  // ORDER LIST VIEW
  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Package className="w-6 h-6 text-lagoon-600" />
        Order History
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-lagoon-600" />
        </div>
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getOrderStatus(order.status);
            return (
              <div
                key={order.order_id}
                className="border border-gray-100 rounded-xl p-5 hover:border-lagoon-200 transition-colors bg-white shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-gray-900">
                        Order #{order.invoice_code}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>
                        {new Date(order.order_placed_date).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(order.order_placed_date).toLocaleTimeString()}
                      </p>
                      <p>
                        {order.totalProduct}{" "}
                        {order.totalProduct === 1 ? "Product" : "Products"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-bold text-lg text-gray-900">
                        Tk {order.total_amount}
                      </p>
                    </div>
                    <button
                      onClick={() => viewOrderDetails(order.invoice_code)}
                      className="p-2 text-lagoon-600 hover:bg-lagoon-50 rounded-lg transition-colors flex items-center gap-1 font-medium text-sm"
                    >
                      View
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => loadOrders(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-50 disabled:hover:bg-white"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <button
                onClick={() => loadOrders(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-50 disabled:hover:bg-white"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
