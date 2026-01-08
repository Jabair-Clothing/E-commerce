import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Heart,
  User,
  Lock,
  MapPin,
  LogOut,
} from "lucide-react";

const Sidebar = ({ user, activeTab, setActiveTab, logout }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "My Wishlist", icon: Heart },
    { id: "profile", label: "Profile Details", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "addresses", label: "Addresses", icon: MapPin },
  ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-fit">
      <div className="flex items-center space-x-3 mb-8 px-2">
        <div className="w-12 h-12 rounded-full bg-lagoon-100 flex items-center justify-center text-lagoon-600 font-bold text-xl">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-bold text-gray-900 truncate max-w-[150px]">
            {user?.name}
          </div>
          <div className="text-xs text-gray-500 truncate max-w-[150px]">
            {user?.email}
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === item.id
                ? "bg-lagoon-50 text-lagoon-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium text-red-500 hover:bg-red-50 mt-4"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
