import React, { useState } from "react";
import { changePassword } from "../../services/api";

const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await changePassword(passwordData);
      if (res.success || res.status === 200) {
        setSuccess("Password changed successfully.");
        setPasswordData({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        setError(res.message || "Failed to change password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
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
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={passwordData.current_password}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                current_password: e.target.value,
              })
            }
            className="w-full p-3 bg-gray-50 rounded-xl border-gray-200 outline-none focus:border-lagoon-500 border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={passwordData.new_password}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                new_password: e.target.value,
              })
            }
            className="w-full p-3 bg-gray-50 rounded-xl border-gray-200 outline-none focus:border-lagoon-500 border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={passwordData.new_password_confirmation}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                new_password_confirmation: e.target.value,
              })
            }
            className="w-full p-3 bg-gray-50 rounded-xl border-gray-200 outline-none focus:border-lagoon-500 border"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-lagoon-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-lagoon-700 transition-colors"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
