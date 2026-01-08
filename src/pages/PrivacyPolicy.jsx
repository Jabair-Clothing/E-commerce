import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              When you visit our website or make a purchase, we collect certain
              information to provide you with a seamless shopping experience.
              This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Personal details: Name, phone number, email address, and
                shipping address.
              </li>
              <li>
                Payment information: While we do not store your card details,
                our payment partners (bKash, SSLCommerz) process transactions
                securely.
              </li>
              <li>
                Device information: IP address, browser type, and browsing
                behavior on our site to improve functionality.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              2. How We Use Your Information
            </h2>
            <p>We use your data strictly for legitimate business purposes:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Processing and delivering your orders across Bangladesh.</li>
              <li>
                Sending order confirmations, shipping updates, and customer
                support communications.
              </li>
              <li>
                Improving our website layout, product offerings, and marketing
                strategies.
              </li>
              <li>
                Preventing fraud and ensuring the security of our platform.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              3. Data Sharing & Security
            </h2>
            <p>
              We value your trust. We do not sell or rent your personal
              information to third parties. Data is shared only with:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                Logistics partners (e.g., Pathao, RedX) for delivery purposes.
              </li>
              <li>Payment gateways for secure transaction processing.</li>
              <li>Legal authorities if required by Bangladeshi law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Cookies</h2>
            <p>
              Our website uses cookies to remember your preferences (like your
              cart items) and analyze site traffic. You can choose to disable
              cookies in your browser settings, though this may affect your
              shopping experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              5. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or request deletion of your
              personal data. Contact us at{" "}
              <span className="font-semibold text-lagoon-600">
                support@example.com
              </span>{" "}
              for any privacy-related concerns.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <p className="text-sm">
              Last Updated: January 2026. This policy follows the Digital
              Security Act of Bangladesh and international best practices.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
