import React, { useEffect, useState } from "react";
import { Package, User, MapPin, LayoutDashboard } from "lucide-react";
import { fetchUserDashboard } from "../../services/api";

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchUserDashboard();
        if (res.success) {
          setStats(res.data);
        } else {
          setError("Failed to load dashboard data.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading overview...</div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      label: "Total Orders",
      value: stats.total_orders,
      icon: Package,
    },
    {
      label: "Wishlist",
      value: stats.total_wishlists || 0,
      icon: User, // Using User icon as fallback or Heart if preferred, kept consistent with original
    },
    {
      label: "Addresses",
      value: stats.total_addresses,
      icon: MapPin,
    },
    {
      label: "Total Spent",
      value: `Tk ${stats.total_spent}`,
      icon: LayoutDashboard,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((stat, i) => (
          <div
            key={i}
            className="bg-gray-50 p-6 rounded-2xl border border-gray-100"
          >
            <stat.icon className="w-8 h-8 text-lagoon-500 mb-3" />
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
