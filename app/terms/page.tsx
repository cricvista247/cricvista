/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserCheck,
  CreditCard,
  RefreshCw,
  Copyright,
  Ban,
  Brain,
  AlertTriangle,
  ShieldOff,
  Scale,
  FileEdit,
  Mail,
  ChevronRight,
  FileText,
} from "lucide-react";
import Link from "next/link";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: ShieldCheck,
  },
  {
    id: "accounts",
    title: "User Accounts",
    icon: UserCheck,
  },
  {
    id: "subscriptions",
    title: "Subscriptions & Payments",
    icon: CreditCard,
  },
  {
    id: "refunds",
    title: "Refund Policy",
    icon: RefreshCw,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    icon: Copyright,
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    icon: Ban,
  },
  {
    id: "ai-disclaimer",
    title: "AI Analytics Disclaimer",
    icon: Brain,
  },
  {
    id: "suspension",
    title: "Account Suspension / Termination",
    icon: AlertTriangle,
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: ShieldOff,
  },
  {
    id: "disputes",
    title: "Dispute Resolution",
    icon: Scale,
  },
  {
    id: "changes",
    title: "Changes to Terms",
    icon: FileEdit,
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: Mail,
  },
];

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState("acceptance");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <FileText className="h-4 w-4 mr-2" />
              Terms & Conditions
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Terms of Service
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using the CricVista
              platform. By using our services, you agree to be bound by these
              terms.
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg text-sm text-blue-200">
              <FileEdit className="h-4 w-4 mr-2" />
              Last updated: July 1, 2026
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            {/* Sidebar - Table of Contents */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-1">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-4 mb-4">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                    On this page
                  </h2>
                  <nav className="space-y-0.5">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      const isActive = activeSection === section.id;
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm transition-all duration-200 ${
                            isActive
                              ? "bg-blue-50 text-blue-700 font-medium shadow-sm"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 flex-shrink-0 ${
                              isActive ? "text-blue-600" : "text-gray-400"
                            }`}
                          />
                          <span className="truncate">{section.title}</span>
                          {isActive && (
                            <ChevronRight className="h-3.5 w-3.5 ml-auto text-blue-500 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Glassmorphism summary card */}
                <div className="hidden lg:block bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-xl rounded-2xl border border-blue-200/30 shadow-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Scale className="h-4 w-4 text-white" />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">
                      12 Sections
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    These Terms govern your use of CricVista. By accessing
                    or using our platform, you agree to these terms in full.
                  </p>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-6 md:p-10 space-y-12">
                {/* 1. Acceptance of Terms */}
                <div id="acceptance" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                      <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      1. Acceptance of Terms
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-13 space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      By accessing or using the CricVista website, mobile
                      application, or any related services (collectively, the
                      "Platform"), you agree to be bound by these Terms &
                      Conditions ("Terms"). If you do not agree to all of these
                      Terms, you must not access or use the Platform.
                    </p>
                    <p>
                      CricVista reserves the right to update or modify
                      these Terms at any time without prior notice. Your
                      continued use of the Platform after any changes constitutes
                      your acceptance of the revised Terms. It is your
                      responsibility to review these Terms periodically.
                    </p>
                    <p>
                      These Terms apply to all visitors, users, and others who
                      access or use the Platform ("Users"). By using the
                      Platform, you represent and warrant that you have the
                      legal capacity to enter into a binding agreement.
                    </p>
                  </div>
                </div>

                {/* 2. User Accounts */}
                <div id="accounts" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-md">
                      <UserCheck className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      2. User Accounts
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      To access certain features of the Platform, you must
                      register for an account. When you register, you agree to
                      provide accurate, current, and complete information about
                      yourself and to update such information promptly.
                    </p>
                    <p>
                      You must be at least 18 years of age to create an account
                      and use the Platform. By registering, you represent and
                      warrant that you are 18 years of age or older.
                    </p>
                    <p>
                      You are solely responsible for maintaining the
                      confidentiality of your account credentials, including
                      your password, and for all activities that occur under
                      your account. You agree to notify CricVista
                      immediately of any unauthorized use of your account.
                    </p>
                    <p>
                      CricVista reserves the right to refuse service,
                      terminate accounts, remove or edit content, or cancel
                      orders at its sole discretion.
                    </p>
                  </div>
                </div>

                {/* 3. Subscriptions and Payments */}
                <div id="subscriptions" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      3. Subscriptions & Payments
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Certain features of the Platform require a paid
                      subscription. By subscribing, you agree to pay the
                      applicable fees as set forth on the pricing page.
                      Subscription plans, pricing, and features are subject to
                      change with reasonable notice.
                    </p>
                    <p>
                      All subscriptions are billed on a recurring basis
                      (monthly or annually, depending on the plan selected)
                      and will automatically renew at the end of each billing
                      period unless cancelled before the renewal date. You
                      authorize CricVista to charge your selected payment
                      method for the subscription fee at the start of each
                      billing period.
                    </p>
                    <p>
                      Payments are processed through third-party payment
                      processors. CricVista does not store or process
                      your payment card details directly. By providing your
                      payment information, you agree to the terms and privacy
                      policies of these third-party processors.
                    </p>
                    <p>
                      If a payment is not successfully settled, your
                      subscription may be suspended or terminated until the
                      outstanding amount is paid.
                    </p>
                  </div>
                </div>

                {/* 4. Refund Policy */}
                <div id="refunds" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center shadow-md">
                      <RefreshCw className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      4. Refund Policy
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      All subscription fees are non-refundable except as
                      expressly stated in this Refund Policy or as required by
                      applicable law. CricVista does not provide refunds
                      or credits for any partial subscription periods or unused
                      features.
                    </p>
                    <p>
                      If you believe you are entitled to a refund due to a
                      technical error or billing issue on our part, please
                      contact our support team at{" "}
                      <a
                        href="mailto:cricvista247@gmail.com"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        cricvista247@gmail.com
                      </a>{" "}
                      within 7 days of the transaction. Each request will be
                      reviewed on a case-by-case basis.
                    </p>
                    <p>
                      CricVista reserves the right to offer partial or
                      full refunds at its sole discretion. Any refund issued
                      will be processed using the original payment method and
                      may take 5-10 business days to reflect.
                    </p>
                  </div>
                </div>

                {/* 5. Intellectual Property */}
                <div id="intellectual-property" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                      <Copyright className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      5. Intellectual Property
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      All content, features, and functionality available on the
                      Platform — including but not limited to text, graphics,
                      logos, icons, images, audio clips, video clips, data
                      compilations, software, algorithms, and the design,
                      structure, and arrangement thereof — are owned by
                      CricVista, its licensors, or other providers and are
                      protected by applicable intellectual property and
                      proprietary rights laws.
                    </p>
                    <p>
                      The CricVista name, logo, and all related names,
                      logos, product and service names, designs, and slogans are
                      trademarks of CricVista or its affiliates. You must
                      not use such marks without the prior written permission of
                      CricVista.
                    </p>
                    <p>
                      Subject to your compliance with these Terms,
                      CricVista grants you a limited, non-exclusive,
                      non-transferable, revocable license to access and use the
                      Platform for your personal, non-commercial purposes. You
                      may not reproduce, distribute, modify, create derivative
                      works of, publicly display, or otherwise exploit any
                      content from the Platform without our express written
                      consent.
                    </p>
                  </div>
                </div>

                {/* 6. Acceptable Use */}
                <div id="acceptable-use" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-md">
                      <Ban className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      6. Acceptable Use
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      You agree to use the Platform only for lawful purposes
                      and in accordance with these Terms. You agree not to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Use the Platform in any manner that could disable,
                        overburden, damage, or impair the Platform or
                        interfere with any other party's use of the Platform.
                      </li>
                      <li>
                        Reverse engineer, decompile, disassemble, or attempt
                        to derive the source code of any software or
                        algorithms used in the Platform.
                      </li>
                      <li>
                        Use any robot, spider, scraper, or other automated
                        means to access the Platform for any purpose without
                        our prior written consent.
                      </li>
                      <li>
                        Introduce any viruses, trojan horses, worms, logic
                        bombs, or other material that is malicious or
                        technologically harmful.
                      </li>
                      <li>
                        Attempt to gain unauthorized access to, interfere
                        with, damage, or disrupt any parts of the Platform,
                        the server on which the Platform is stored, or any
                        server, computer, or database connected to the
                        Platform.
                      </li>
                      <li>
                        Use the Platform for any illegal or unauthorized
                        purpose, including but not limited to violating any
                        applicable laws or regulations.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 7. AI Analytics Disclaimer - IMPORTANT */}
                <div id="ai-disclaimer" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-xl flex items-center justify-center shadow-md">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      7. AI Analytics Disclaimer
                    </h2>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4 text-gray-700 leading-relaxed">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="font-semibold text-amber-800">
                        Important Disclaimer
                      </p>
                    </div>
                    <p>
                      CricVista provides AI-powered sports analytics and
                      statistical insights for informational and entertainment
                      purposes only. We do not facilitate betting, gambling,
                      wagering, or real-money gaming. AI-generated insights are
                      statistical forecasts and should not be interpreted as
                      betting advice or guarantees of future outcomes.
                    </p>
                    <p>
                      You acknowledge and agree that any predictions,
                      analytics, or insights provided by the Platform are based
                      on statistical models and historical data. Past
                      performance does not guarantee future results. The use of
                      any information obtained from the Platform is at your own
                      risk.
                    </p>
                    <p>
                      CricVista expressly disclaims any and all liability
                      for any loss or damage (direct, indirect, or
                      consequential) arising from your use of or reliance on
                      the AI-generated insights, predictions, or analytics
                      provided through the Platform.
                    </p>
                    <div className="bg-white/70 rounded-xl p-4 border border-amber-100">
                      <p className="text-sm font-medium text-amber-700">
                        CricVista does not promote, endorse, or
                        facilitate any form of gambling. The Platform is
                        designed for fantasy sports, educational, and
                        entertainment purposes only.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 8. Account Suspension / Termination */}
                <div id="suspension" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-rose-700 rounded-xl flex items-center justify-center shadow-md">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      8. Account Suspension / Termination
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      CricVista reserves the right to suspend or
                      terminate your account and access to the Platform, with
                      or without notice, if:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        You violate any provision of these Terms or any
                        applicable law or regulation.
                      </li>
                      <li>
                        Your conduct could harm other users, third parties, or
                        the Platform itself.
                      </li>
                      <li>
                        You engage in fraudulent, abusive, or otherwise
                        inappropriate activity.
                      </li>
                      <li>
                        Your account remains inactive for a period of 12
                        consecutive months.
                      </li>
                    </ul>
                    <p>
                      Upon termination, your right to use the Platform will
                      immediately cease. All provisions of these Terms that by
                      their nature should survive termination shall survive,
                      including but not limited to intellectual property
                      provisions, warranty disclaimers, and limitations of
                      liability.
                    </p>
                    <p>
                      If your account is terminated due to a violation of
                      these Terms, you will not be entitled to any refund of
                      prepaid fees.
                    </p>
                  </div>
                </div>

                {/* 9. Limitation of Liability */}
                <div id="liability" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-md">
                      <ShieldOff className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      9. Limitation of Liability
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      To the fullest extent permitted by applicable law,
                      CricVista, its affiliates, officers, directors,
                      employees, agents, and licensors shall not be liable for
                      any indirect, incidental, special, consequential, or
                      punitive damages, including but not limited to loss of
                      profits, data, use, goodwill, or other intangible losses,
                      arising out of or in connection with your use of or
                      inability to use the Platform.
                    </p>
                    <p>
                      The Platform is provided on an "as is" and "as
                      available" basis without any warranties of any kind,
                      either express or implied, including but not limited to
                      warranties of merchantability, fitness for a particular
                      purpose, or non-infringement.
                    </p>
                    <p>
                      CricVista does not warrant that the Platform will
                      be uninterrupted, error-free, secure, or free of viruses
                      or other harmful components. You assume all risk for any
                      damage to your computer system or loss of data that
                      results from your use of the Platform.
                    </p>
                    <p>
                      In no event shall CricVista's total liability to
                      you for all claims arising out of or relating to these
                      Terms or your use of the Platform exceed the amount paid
                      by you to CricVista during the twelve (12) months
                      preceding the event giving rise to the liability.
                    </p>
                  </div>
                </div>

                {/* 10. Dispute Resolution */}
                <div id="disputes" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-md">
                      <Scale className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      10. Dispute Resolution
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      These Terms shall be governed by and construed in
                      accordance with the laws of India. Any disputes arising
                      out of or relating to these Terms or your use of the
                      Platform shall be resolved through binding arbitration
                      in accordance with the Arbitration and Conciliation Act,
                      1996.
                    </p>
                    <p>
                      The arbitration shall be conducted in English by a sole
                      arbitrator appointed by mutual agreement of the parties.
                      The seat and venue of arbitration shall be Mumbai,
                      India. Each party shall bear its own costs and expenses
                      in connection with the arbitration.
                    </p>
                    <p>
                      You agree that any cause of action arising out of or
                      related to the Platform must commence within one (1)
                      year after the cause of action accrues; otherwise, such
                      cause of action is permanently barred.
                    </p>
                    <p>
                      Notwithstanding the foregoing, CricVista reserves
                      the right to seek injunctive or other equitable relief
                      in any court of competent jurisdiction to protect its
                      intellectual property rights or confidential
                      information.
                    </p>
                  </div>
                </div>

                {/* 11. Changes to Terms */}
                <div id="changes" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-md">
                      <FileEdit className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      11. Changes to Terms
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      CricVista reserves the right, at its sole
                      discretion, to modify, add, or remove portions of these
                      Terms at any time. If we make material changes, we will
                      notify you by posting a notice on the Platform or
                      sending an email to the address associated with your
                      account.
                    </p>
                    <p>
                      Your continued use of the Platform after the effective
                      date of any changes constitutes your acceptance of the
                      revised Terms. If you do not agree to the changes, you
                      must stop using the Platform and cancel your
                      subscription before the changes take effect.
                    </p>
                    <p>
                      It is your responsibility to review these Terms
                      periodically. The date of the most recent revision will
                      be indicated at the top of this page. We encourage you
                      to review these Terms whenever you access the Platform.
                    </p>
                  </div>
                </div>

                {/* 12. Contact Information */}
                <div id="contact" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      12. Contact Information
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      If you have any questions, concerns, or requests
                      regarding these Terms, please contact us:
                    </p>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Email</p>
                          <a
                            href="mailto:cricvista247@gmail.com"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            cricvista247@gmail.com
                          </a>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        We aim to respond to all inquiries within 48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Questions?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Clarification?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              If you have any questions about these Terms, please don't
              hesitate to reach out to our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="mailto:cricvista247@gmail.com"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold shadow-lg"
              >
                <Mail className="h-5 w-5 mr-2" />
                Email Us
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center px-6 py-3 border border-white/30 text-white rounded-xl hover:bg-white/10 transition-colors font-semibold backdrop-blur-sm"
              >
                <FileText className="h-5 w-5 mr-2" />
                Visit Support Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
