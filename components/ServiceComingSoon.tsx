/* eslint-disable react/no-unescaped-entities */
// components/ServiceComingSoon.tsx

import React from "react";

import { Clock, Rocket, Shield, Sparkles, Mail } from "lucide-react";

const ServiceComingSoon = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-blue-900 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Service Coming Soon
          </h1>
          <p className="text-blue-200 text-lg">
            We're crafting something extraordinary. Stay tuned for the launch!
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Prepare for Something Amazing
            </h2>
            <p className="text-gray-600 mb-6">
              Our team is working tirelessly to deliver a service that will
              exceed your expectations. Innovation meets simplicity in our
              upcoming solution.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Lightning Fast
                </h3>
                <p className="text-sm text-gray-600">
                  Blazing performance and speed
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Secure</h3>
                <p className="text-sm text-gray-600">
                  Enterprise-grade security
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Intuitive</h3>
                <p className="text-sm text-gray-600">
                  Beautiful and easy to use
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section (Replacement for email form) */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6 text-center">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Have Questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Reach out to our team for more information
            </p>
            <a
              href="mailto:hello@yourcompany.com"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceComingSoon;
