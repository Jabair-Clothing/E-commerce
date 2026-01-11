import React from "react";

const Terms = () => {
  return (
    <div className="bg-white min-h-screen py-20 px-4 animate-fade-in">
      <div className="container mx-auto max-w-4xl bg-white border border-gray-100 p-8 md:p-16 shadow-lg">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary-900 mb-10 text-center tracking-wide">
          Terms of Service
        </h1>

        <div className="space-y-8 text-gray-600 leading-relaxed font-light">
          <section>
            <p>
              Welcome to our online store. By determining to shop with us, you
              agree to the following terms and conditions. Please read them
              carefully.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary-900 mb-3 uppercase text-sm tracking-wider">
              1. General Conditions
            </h2>
            <p>
              We reserve the right to refuse service to anyone for any reason at
              any time. You agree not to reproduce, duplicate, copy, sell, or
              exploit any portion of the Service without express written
              permission by us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary-900 mb-3 uppercase text-sm tracking-wider">
              2. Products and Pricing
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-accent-500">
              <li>
                Prices for our products are subject to change without notice.
              </li>
              <li>
                We have made every effort to display as accurately as possible
                the colors and images of our products. However, we cannot
                guarantee that your computer monitor's display of any color will
                be accurate.
              </li>
              <li>
                We reserve the right to limit the sales of our products to any
                person, geographic region, or jurisdiction.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary-900 mb-3 uppercase text-sm tracking-wider">
              3. Billing and Account Information
            </h2>
            <p>
              We reserve the right to refuse any order you place with us. In the
              event that we make a change to or cancel an order, we may attempt
              to notify you by contacting the e-mail and/or billing
              address/phone number provided at the time the order was made.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary-900 mb-3 uppercase text-sm tracking-wider">
              4. Delivery Policy (Bangladesh)
            </h2>
            <p>
              We deliver across all 64 districts of Bangladesh. Standard
              delivery time is 2-4 days inside Dhaka and 3-7 days outside Dhaka.
              Delivery charges are calculated at checkout based on your
              location.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary-900 mb-3 uppercase text-sm tracking-wider">
              5. Governing Law
            </h2>
            <p>
              These Terms of Service shall be governed by and construed in
              accordance with the laws of Bangladesh.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <p className="text-sm italic">
              Any questions about the Terms of Service should be sent to us at{" "}
              <span className="font-bold text-accent-600">
                info@jabaibgroup.com
              </span>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
