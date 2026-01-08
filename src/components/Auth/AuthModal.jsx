import React, { useState } from "react";
import ReactDOM from "react-dom";
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

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[99999] overflow-y-auto bg-black/60 backdrop-blur-md animate-fade-in"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* 
         z-[99999] and inline style ensure it's on top of EVERYTHING. 
         Portal ensures it's attached to body, avoiding parent sticking/overflow issues. 
      */}
      <div className="min-h-screen px-4 text-center flex items-center justify-center">
        {/* Overlay click to close */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal Panel */}
        <div className="inline-block w-full max-w-md p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl relative z-10">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-gray-400 bg-white/50 hover:bg-white rounded-full hover:text-gray-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Section with Tabs */}
          <div className="relative bg-gray-50 pt-16 pb-6 px-8 text-center border-b border-gray-100">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-200 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === "login" ? "Welcome Back" : "Join Us"}
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              {activeTab === "login"
                ? "Enter your details to access your account"
                : "Create an account to start shopping"}
            </p>

            <div className="flex p-1 bg-gray-200/50 rounded-xl relative">
              <button
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                  activeTab === "login"
                    ? "bg-white text-lagoon-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("login");
                  setError(null);
                }}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                  activeTab === "register"
                    ? "bg-white text-lagoon-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("register");
                  setError(null);
                }}
              >
                Register
              </button>
            </div>
          </div>

          <div className="p-8 bg-white">
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-start">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            )}

            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-lagoon-600 transition-colors" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-lagoon-500 focus:bg-white focus:ring-4 focus:ring-lagoon-500/10 transition-all font-medium"
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-lagoon-600 transition-colors" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-lagoon-500 focus:bg-white focus:ring-4 focus:ring-lagoon-500/10 transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-lagoon-600 text-white font-bold py-4 rounded-xl hover:bg-lagoon-700 active:scale-[0.98] transition-all shadow-lg shadow-lagoon-600/20 flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-lagoon-600 transition-colors" />
                    <input
                      type="text"
                      required
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-lagoon-500 focus:bg-white focus:ring-4 focus:ring-lagoon-500/10 transition-all font-medium"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-lagoon-600 transition-colors" />
                    <input
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-lagoon-500 focus:bg-white focus:ring-4 focus:ring-lagoon-500/10 transition-all font-medium"
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-lagoon-600 transition-colors" />
                    <input
                      type="tel"
                      required
                      maxLength={11}
                      value={registerPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 11) setRegisterPhone(val);
                      }}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-lagoon-500 focus:bg-white focus:ring-4 focus:ring-lagoon-500/10 transition-all font-medium"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-lagoon-600 transition-colors" />
                    <input
                      type="password"
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-lagoon-500 focus:bg-white focus:ring-4 focus:ring-lagoon-500/10 transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-lagoon-600 text-white font-bold py-4 rounded-xl hover:bg-lagoon-700 active:scale-[0.98] transition-all shadow-lg shadow-lagoon-600/20 flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
