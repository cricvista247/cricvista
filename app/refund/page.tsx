/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  RotateCcw,
  Ban,
  Mail,
  Clock,
  AlertTriangle,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

const policySections = [
  {
    icon: FileText,
    title: "Overview",
    content:
      "CricVista is a digital analytics subscription service that provides AI-powered sports analytics, insights, and data analysis. Subscriptions grant access to our web-based analytics platform, including match analytics, player performance metrics, team statistics, and fantasy sports recommendations. This Refund Policy governs all subscription purchases made on the CricVista platform.",
  },
  {
    icon: RotateCcw,
    title: "Subscription Cancellation",
    content:
      "Users may cancel their subscription at any time through their account settings or by contacting our support team. Upon cancellation, access to the CricVista analytics platform and all associated features will continue until the end of the current billing period. No partial refunds will be issued for the remaining days in the billing period after cancellation. To avoid being charged for the next billing cycle, cancellation must be completed before the renewal date.",
    list: [
      "Monthly subscriptions: cancel anytime, access continues until period end",
      "Annual subscriptions: cancel anytime, access continues until period end",
      "No automatic refunds for unused days after cancellation",
    ],
  },
  {
    icon: Ban,
    title: "Refund Eligibility",
    content:
      "CricVista does not offer refunds for partially used subscription periods. However, refunds may be considered under the following exceptional circumstances:",
    list: [
      "Technical issues that prevent access to the platform for an extended period (72+ hours)",
      "Duplicate charges or billing errors resulting in overpayment",
      "Account closure initiated by CricVista due to service discontinuation",
    ],
    note: "Refund eligibility is evaluated on a case-by-case basis. Dissatisfaction with analytics accuracy, changes in personal financial circumstances, or failure to utilize the subscription do not qualify for refunds.",
  },
  {
    icon: Mail,
    title: "How to Request a Refund",
    content:
      "To submit a refund request, please send an email to cricvista247@gmail.com with the following information:",
    list: [
      "Full name associated with the account",
      "Registered email address",
      "Order/transaction ID (found in your account payment history)",
      "Detailed reason for the refund request",
      "Any relevant screenshots or documentation supporting your request",
    ],
    note: "All refund requests must be submitted within 30 days of the original purchase date. Requests submitted after this period will not be considered.",
  },
  {
    icon: Clock,
    title: "Processing Timeline",
    content:
      "Once your refund request is received, our team will review it within 3-5 business days. If approved, refunds are processed within 7-14 business days from the date of approval. The refund timeline depends on your payment method and financial institution:",
    list: [
      "Credit/Debit cards: 7-14 business days to reflect on your statement",
      "UPI / Net Banking: 5-10 business days",
      "Wallets: 3-7 business days",
    ],
    note: "You will receive email notifications at each stage of the refund process — acknowledgment, approval/rejection, and processing confirmation.",
  },
  {
    icon: AlertTriangle,
    title: "Chargebacks",
    content:
      "We strongly encourage users to contact us directly at cricvista247@gmail.com before initiating a chargeback with their bank or payment provider. Filing a chargeback without prior communication may result in:",
    list: [
      "Immediate suspension of your CricVista account",
      "Permanent loss of access to all subscription features and historical data",
      "Ineligibility for future refunds or promotional offers",
      "Additional legal and administrative fees pursued where applicable",
    ],
    note: "We are committed to resolving all billing issues fairly and promptly. Please give us the opportunity to address your concern before resorting to a chargeback.",
  },
  {
    icon: Phone,
    title: "Contact Information",
    content:
      "If you have any questions, concerns, or requests regarding this Refund Policy or your subscription, please reach out to us:",
    list: [
      'Email: <a href="mailto:cricvista247@gmail.com" class="text-blue-600 hover:underline font-medium">cricvista247@gmail.com</a>',
      'Support Portal: <a href="/support" class="text-blue-600 hover:underline font-medium">Visit our Support Center</a>',
      "Response Time: Within 24-48 hours on business days",
    ],
  },
];

const RefundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
              <Shield className="h-4 w-4 mr-2" />
              CricVista Refund Policy
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Our Commitment to
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {" "}
                Fair Billing
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              We believe in transparent and fair billing practices. Please review
              our refund policy below to understand your rights and our
              commitments regarding subscription payments.
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice Banner */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">
                Important Notice
              </h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                CricVista provides AI-powered sports analytics for
                informational purposes. Subscriptions are for access to the
                analytics platform, not for betting advice or guaranteed
                outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {policySections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          {section.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-4">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {section.content}
                    </p>
                    {section.list && (
                      <ul className="space-y-2">
                        {section.list.map((item, i) => {
                          const isHtml =
                            item.includes("<a") || item.includes("href");
                          return (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              {isHtml ? (
                                <span
                                  className="text-gray-700"
                                  dangerouslySetInnerHTML={{ __html: item }}
                                />
                              ) : (
                                <span className="text-gray-700">{item}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {section.note && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-800 leading-relaxed">
                            {section.note}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Summary Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl" />
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Quick Refund Summary
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                      <h4 className="font-semibold text-white">
                        Eligible for Refund
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-blue-100">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        Extended technical issues (72+ hours)
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        Duplicate billing or overcharges
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        Service discontinuation
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="h-5 w-5 text-red-300" />
                      <h4 className="font-semibold text-white">
                        Not Eligible for Refund
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-blue-100">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        Partial subscription usage
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        Analytics accuracy dissatisfaction
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        Change of mind or non-usage
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 text-center">
                  <p className="text-blue-100 text-sm">
                    All refund requests must be submitted within 30 days of
                    purchase. Need help?{" "}
                    <a
                      href="mailto:cricvista247@gmail.com"
                      className="text-yellow-300 hover:text-yellow-200 underline font-medium"
                    >
                      Contact us
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Have Questions About Billing?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Our support team is here to help with any refund or billing
              inquiries
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/support"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-lg"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Support
              </Link>
              <Link
                href="/subscription"
                className="inline-flex items-center px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors text-lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPage;
