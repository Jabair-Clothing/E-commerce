import React, { useState } from "react";
import { MapPin, Plus, Loader2 } from "lucide-react";
import { addShippingAddress } from "../../services/api";

const ShippingAddress = ({
  shippingAddresses,
  setShippingAddresses,
  selectedAddressId,
  setSelectedAddressId,
  user,
}) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    f_name: "",
    l_name: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      const res = await addShippingAddress({
        ...newAddress,
        User_id: user?.id,
      });
      if (res.success) {
        // Update parent list
        setShippingAddresses([...shippingAddresses, res.data]);
        // Auto select new address
        setSelectedAddressId(res.data.id);
        // Close and reset
        setShowAddressModal(false);
        setNewAddress({
          f_name: "",
          l_name: "",
          phone: "",
          address: "",
          city: "",
          zip: "",
        });
      } else {
        alert(res.message || "Failed to save address.");
      }
    } catch (err) {
      alert("Error saving address.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-lagoon-600" />
        Shipping Address
      </h2>

      {shippingAddresses.length > 0 ? (
        <div className="space-y-3">
          {shippingAddresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
                selectedAddressId === addr.id
                  ? "border-lagoon-600 bg-lagoon-50"
                  : "border-gray-200 hover:border-lagoon-200"
              }`}
            >
              <input
                type="radio"
                name="shippingAddress"
                className="mt-1"
                checked={selectedAddressId === addr.id}
                onChange={() => setSelectedAddressId(addr.id)}
              />
              <div className="ml-3">
                <span className="block font-semibold text-gray-900">
                  {addr.name || user?.name}
                </span>
                <span className="block text-sm text-gray-600">
                  {addr.address}, {addr.city}
                </span>
                <span className="block text-sm text-gray-500">
                  {addr.phone}
                </span>
              </div>
            </label>
          ))}
          <button
            onClick={() => setShowAddressModal(true)}
            className="flex items-center text-sm font-bold text-lagoon-600 mt-2 hover:underline"
          >
            <Plus className="w-4 h-4 mr-1" /> Add New Address
          </button>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No shipping addresses found.</p>
          <button
            onClick={() => setShowAddressModal(true)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100"
          >
            Add Shipping Address
          </button>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">
                Add New Address
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  className="p-3 bg-gray-50 rounded-xl border border-gray-200 w-full"
                  value={newAddress.f_name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, f_name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  className="p-3 bg-gray-50 rounded-xl border border-gray-200 w-full"
                  value={newAddress.l_name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, l_name: e.target.value })
                  }
                />
              </div>
              <input
                type="text"
                placeholder="Phone Number"
                required
                className="p-3 bg-gray-50 rounded-xl border border-gray-200 w-full"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Street Address"
                required
                className="p-3 bg-gray-50 rounded-xl border border-gray-200 w-full"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  required
                  className="p-3 bg-gray-50 rounded-xl border border-gray-200 w-full"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  required
                  className="p-3 bg-gray-50 rounded-xl border border-gray-200 w-full"
                  value={newAddress.zip}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="flex-1 py-3 bg-lagoon-600 text-white font-bold rounded-xl hover:bg-lagoon-700 flex items-center justify-center"
                >
                  {isSavingAddress ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Save Address"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;
