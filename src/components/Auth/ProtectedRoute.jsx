import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-lagoon-600" />
      </div>
    );
  }

  if (!user) {
    // Redirect to home, but ideally trigger the login modal.
    // Since we don't have a global way to open modal from here easily without context/params,
    // we just redirect to home. The user logic in Header handles showing login button.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
