import React, { useState } from "react";
import { submitContactForm } from "../services/api";
import { Send, Mail, User, MessageSquare, Loader2 } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMessage("");

    try {
      const response = await submitContactForm(formData);
      if (response.success) {
        setStatus("success");
        setResponseMessage(response.message || "Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setResponseMessage(response.message || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setResponseMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in max-w-4xl">
      {/* Hero Header */}
      <div className="text-center mb-16 relative">
        <span className="text-accent-600 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
          Support & Inquiries
        </span>
        <h1 className="text-5xl font-serif font-bold text-black mb-6">
          Contact Us
        </h1>
        <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
          Whether you are looking for a quote, have a question about our
          production capabilities, or want to visit our factory, our team is
          ready to assist you.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Contact Info / Sidebar */}
        <div className="bg-black text-white p-10 md:w-1/3 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold mb-6 text-accent-500 tracking-wider">
              Get in Touch
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg text-accent-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium opacity-90 text-accent-100">
                    Email
                  </p>
                  <p className="text-sm opacity-75">info@jabaibgroup.com</p>
                </div>
              </div>
              {/* Add more contact info here if needed */}
            </div>
          </div>
          <div className="mt-10 md:mt-0">
            <div className="w-16 h-1 bg-accent-500/30 rounded-full mb-6"></div>
            <p className="opacity-75 text-sm leading-relaxed italic font-serif text-gray-300">
              "Crafting the future of fashion for leading brands worldwide."
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-10 md:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-accent-600" />
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-none border-b border-gray-300 focus:border-accent-600 focus:outline-none bg-gray-50 transition-colors placeholder:text-gray-400 font-serif"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-none border-b border-gray-300 focus:border-accent-600 focus:outline-none bg-gray-50 transition-colors placeholder:text-gray-400 font-serif"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent-600" />
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="How can we help?"
                className="w-full px-4 py-3 rounded-none border-b border-gray-300 focus:border-accent-600 focus:outline-none bg-gray-50 transition-colors placeholder:text-gray-400 font-serif"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent-600" />
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Write your message here..."
                className="w-full px-4 py-3 rounded-none border-b border-gray-300 focus:border-accent-600 focus:outline-none bg-gray-50 transition-colors placeholder:text-gray-400 font-serif resize-none"
              ></textarea>
            </div>

            {status === "error" && (
              <div className="p-4 bg-red-50 text-red-600 rounded-sm text-sm border border-red-100">
                {responseMessage}
              </div>
            )}
            {status === "success" && (
              <div className="p-4 bg-green-50 text-green-600 rounded-sm text-sm border border-green-100">
                {responseMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary-900 hover:bg-black text-white font-bold uppercase tracking-widest py-4 rounded-none transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
