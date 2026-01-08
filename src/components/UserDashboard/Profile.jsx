import React, { useState, useEffect } from "react";
import { updateUserInfo } from "../../services/api";

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await updateUserInfo(profileData);
      if (res.success) {
        setSuccess("Profile updated successfully.");
      } else {
        setError(res.message || "Update failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Details</h2>
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
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
            className="w-full p-3 bg-gray-50 rounded-xl border-gray-200 outline-none focus:border-lagoon-500 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            className="w-full p-3 bg-gray-50 rounded-xl border-gray-200 outline-none focus:border-lagoon-500 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({ ...profileData, phone: e.target.value })
            }
            className="w-full p-3 bg-gray-50 rounded-xl border-gray-200 outline-none focus:border-lagoon-500 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            value={profileData.address || ""}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                address: e.target.value,
              })
            }
            className="w-full p-3 bg-gray-50 rounded-xl border-gray-200 outline-none focus:border-lagoon-500 border"
            rows="3"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-lagoon-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-lagoon-700 transition-colors"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
