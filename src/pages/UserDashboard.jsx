import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Sidebar from "../components/UserDashboard/Sidebar";
import Overview from "../components/UserDashboard/Overview";
import Orders from "../components/UserDashboard/Orders";
import Wishlist from "../components/UserDashboard/Wishlist";
import Profile from "../components/UserDashboard/Profile";
import ChangePassword from "../components/UserDashboard/ChangePassword";
import Addresses from "../components/UserDashboard/Addresses";

const UserDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  if (authLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-lagoon-600" />
      </div>
    );
  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Overview />;
      case "orders":
        return <Orders />;
      case "wishlist":
        return <Wishlist user={user} />;
      case "profile":
        return <Profile user={user} />;
      case "password":
        return <ChangePassword />;
      case "addresses":
        return <Addresses user={user} />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          logout={logout}
        />

        <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
