import React from "react";
import { RefreshCw, ShieldCheck, Clock } from "lucide-react";

const Returns = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Returns & Exchanges
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We want you to love what you ordered! But if something isn't right,
            let us know. Here’s how our return process works in Bangladesh.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-lagoon-50 p-6 rounded-xl text-center">
              <Clock className="w-8 h-8 text-lagoon-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">7 Days Return</h3>
              <p className="text-sm text-gray-600">
                Request a return within 7 days of delivery.
              </p>
            </div>
            <div className="bg-lagoon-50 p-6 rounded-xl text-center">
              <RefreshCw className="w-8 h-8 text-lagoon-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Easy Exchange</h3>
              <p className="text-sm text-gray-600">
                Size not matching? Exchange it instantly.
              </p>
            </div>
            <div className="bg-lagoon-50 p-6 rounded-xl text-center">
              <ShieldCheck className="w-8 h-8 text-lagoon-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">
                Quality Guarantee
              </h3>
              <p className="text-sm text-gray-600">
                Full refund for damaged or wrong products.
              </p>
            </div>
          </div>

          <div className="space-y-8 text-gray-600">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Eligibility for Returns
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  The item must be unused, unworn, unwashed, and without any
                  flaws.
                </li>
                <li>
                  Fashion products can be tried on to see if they fit and will
                  still be considered unworn.
                </li>
                <li>
                  The product must include the original tags, user manual,
                  warranty cards, freebies, and accessories.
                </li>
                <li>
                  The product must be returned in the original and undamaged
                  manufacturer packaging / box.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Non-Returnable Items
              </h2>
              <p>
                Certain items cannot be returned for hygiene reasons, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Innerwear and Lingerie</li>
                <li>Swimwear</li>
                <li>Socks</li>
                <li>Customized items</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Refund Process
              </h2>
              <p className="mb-2">
                Once we receive your returned item, we will inspect it and
                notify you that we have received your returned item. We will
                immediately notify you on the status of your refund after
                inspecting the item.
              </p>
              <p>
                If your return is approved, we will initiate a refund to your
                original method of payment (bKash/Bank Transfer). You will
                receive the credit within a certain amount of days, depending on
                your card issuer's policies.
              </p>
            </section>

            <section className="bg-gray-100 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Need to return an item?
              </h2>
              <p className="mb-4">
                Call our customer service at{" "}
                <span className="font-bold text-gray-900">01XXXXXXXXX</span> or
                email us at{" "}
                <span className="font-bold text-lagoon-600">
                  support@example.com
                </span>{" "}
                with your Order ID.
              </p>
              <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                Initiate Return
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
