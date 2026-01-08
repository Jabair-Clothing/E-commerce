import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import {
  fetchShippingAddresses,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} from "../../services/api";

const Addresses = ({ user }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    id: null,
    f_name: "",
    l_name: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  const loadAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchShippingAddresses();
      if (res.success) setAddresses(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = { ...addressForm, User_id: user.id };
      let res;
      if (addressForm.id) {
        res = await updateShippingAddress(addressForm.id, payload);
      } else {
        res = await addShippingAddress(payload);
      }

      if (res.success) {
        setSuccess("Address saved successfully.");
        setShowAddressForm(false);
        setAddressForm({
          id: null,
          f_name: "",
          l_name: "",
          phone: "",
          address: "",
          city: "",
          zip: "",
        });
        loadAddresses();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      await deleteShippingAddress(id);
      loadAddresses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete address");
    }
  };

  const prepareEditAddress = (addr) => {
    setAddressForm({
      id: addr.id,
      f_name: addr.f_name,
      l_name: addr.l_name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      zip: addr.zip,
    });
    setShowAddressForm(true);
    setSuccess(null);
    setError(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shipping Addresses</h2>
        <button
          onClick={() => {
            setAddressForm({
              id: null,
              f_name: "",
              l_name: "",
              phone: "",
              address: "",
              city: "",
              zip: "",
            });
            setShowAddressForm(true);
            setSuccess(null);
            setError(null);
          }}
          className="flex items-center text-sm font-bold text-lagoon-600 bg-lagoon-50 px-4 py-2 rounded-lg hover:bg-lagoon-100 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-xl border border-green-100">
          {success}
        </div>
      )}

      {showAddressForm ? (
        <form
          onSubmit={handleAddressSubmit}
          className="max-w-xl space-y-4 bg-gray-50 p-6 rounded-2xl animate-fade-in"
        >
          <h3 className="font-bold text-lg mb-4">
            {addressForm.id ? "Edit Address" : "New Address"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={addressForm.f_name}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  f_name: e.target.value,
                })
              }
              className="p-3 bg-white rounded-xl border border-gray-200"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={addressForm.l_name}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  l_name: e.target.value,
                })
              }
              className="p-3 bg-white rounded-xl border border-gray-200"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Phone"
            value={addressForm.phone}
            onChange={(e) =>
              setAddressForm({ ...addressForm, phone: e.target.value })
            }
            className="w-full p-3 bg-white rounded-xl border border-gray-200"
            required
          />
          <input
            type="text"
            placeholder="Street Address"
            value={addressForm.address}
            onChange={(e) =>
              setAddressForm({
                ...addressForm,
                address: e.target.value,
              })
            }
            className="w-full p-3 bg-white rounded-xl border border-gray-200"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              value={addressForm.city}
              onChange={(e) =>
                setAddressForm({ ...addressForm, city: e.target.value })
              }
              className="p-3 bg-white rounded-xl border border-gray-200"
              required
            />
            <input
              type="text"
              placeholder="ZIP Code"
              value={addressForm.zip}
              onChange={(e) =>
                setAddressForm({ ...addressForm, zip: e.target.value })
              }
              className="p-3 bg-white rounded-xl border border-gray-200"
              required
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-lagoon-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-lagoon-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAddressForm(false)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="border border-gray-100 p-4 rounded-xl hover:shadow-md transition-shadow relative group"
            >
              <div className="font-bold text-gray-900">
                {addr.f_name} {addr.l_name}
              </div>
              <div className="text-gray-600 text-sm mt-1">{addr.address}</div>
              <div className="text-gray-600 text-sm">
                {addr.city}, {addr.zip}
              </div>
              <div className="text-gray-600 text-sm mt-1">{addr.phone}</div>

              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => prepareEditAddress(addr)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {addresses.length === 0 && (
            <div className="text-gray-400 italic col-span-2 text-center py-8">
              No addresses found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Addresses;
