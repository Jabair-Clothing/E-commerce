import React, { useState } from "react";
import { X, Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AuthModal = ({ isOpen, onClose, initialTab = "login" }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset tab when modal opens or initialTab changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError(null);
    }
  }, [isOpen, initialTab]);

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register State
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Phone Validation: Must be exactly 11 digits
    if (!/^\d{11}$/.test(registerPhone)) {
      setError("Phone number must be exactly 11 digits.");
      setLoading(false);
      return;
    }

    const result = await register({
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      phone: registerPhone,
    });

    if (result.success) {
      // Auto-login after successful registration
      const loginResult = await login(registerEmail, registerPassword);
      if (loginResult.success) {
        onClose();
      } else {
        // Registration success but login failed (rare), switch to login tab
        setActiveTab("login");
        setLoginEmail(registerEmail);
        setLoginPassword("");
        setError("Registration successful. Please login.");
      }
    } else {
      // Handle array of errors if backend returns validation errors
      // e.g., if response.message is an object/array, stringify it or take first
      const msg =
        typeof result.message === "object"
          ? JSON.stringify(result.message)
          : result.message;
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === "login"
                ? "text-lagoon-600 border-b-2 border-lagoon-600 bg-lagoon-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => {
              setActiveTab("login");
              setError(null);
            }}
          >
            Login
          </button>
          <button
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === "register"
                ? "text-lagoon-600 border-b-2 border-lagoon-600 bg-lagoon-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => {
              setActiveTab("register");
              setError(null);
            }}
          >
            Register
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 px-4 outline-none focus:border-lagoon-500 transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 px-4 outline-none focus:border-lagoon-500 transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-lagoon-600 text-white font-bold py-3 rounded-lg hover:bg-lagoon-700 transition-all flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 px-4 outline-none focus:border-lagoon-500 transition-all"
                    placeholder="Enter full name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 px-4 outline-none focus:border-lagoon-500 transition-all"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    value={registerPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 11) setRegisterPhone(val);
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 px-4 outline-none focus:border-lagoon-500 transition-all"
                    placeholder="Enter phone number (11 digits)"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 px-4 outline-none focus:border-lagoon-500 transition-all"
                    placeholder="Create a password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-lagoon-600 text-white font-bold py-3 rounded-lg hover:bg-lagoon-700 transition-all flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
