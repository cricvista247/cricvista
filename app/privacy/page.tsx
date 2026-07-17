/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import {
  Shield,
  Database,
  Eye,
  Cookie,
  BarChart3,
  UserCheck,
  CreditCard,
  Lock,
  Clock,
  FileText,
  Trash2,
  Mail,
  Bell,
  Users,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    id: "information-collected",
    title: "Information We Collect",
    icon: Database,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          When you use CricVista, we collect various types of information
          to provide and improve our services. This includes:
        </p>
        <div className="grid gap-3">
          <div className="flex gap-3 p-3 bg-blue-50/50 rounded-xl">
            <UserCheck className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-gray-900">Personal Information:</strong>{" "}
              When you register for an account, we collect your name, email
              address, and password. If you subscribe to our paid services, we
              also collect your billing address and phone number for account
              verification purposes.
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-blue-50/50 rounded-xl">
            <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-gray-900">Usage Data:</strong> We
              automatically collect information about how you interact with our
              platform, including pages visited, features used, analytics
              queries submitted, time spent on each section, and interaction
              patterns. This helps us optimize the user experience.
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-blue-50/50 rounded-xl">
            <Database className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-gray-900">Device Information:</strong> We
              collect data about the device you use to access our platform,
              including browser type, operating system, IP address, and device
              identifiers. This information is used for security and analytics
              purposes.
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-blue-50/50 rounded-xl">
            <Cookie className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-gray-900">Cookies and Tracking:</strong>{" "}
              We use cookies and similar tracking technologies to enhance your
              experience, analyze trends, and remember your preferences. You can
              control cookie usage through your browser settings.
            </div>
          </div>
        </div>
        <p>
          We do not collect sensitive personal data such as racial or ethnic
          origin, political opinions, religious beliefs, or genetic data. We
          also do not knowingly collect information from individuals under the
          age of 18.
        </p>
      </div>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    icon: Eye,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          CricVista uses the collected information for the following
          purposes:
        </p>
        <ul className="space-y-3">
          {[
            {
              label: "Service Delivery",
              desc: "To provide, maintain, and improve our AI-powered cricket analytics and prediction services, including personalizing your experience and generating accurate predictions based on your preferences.",
            },
            {
              label: "Platform Improvement",
              desc: "To analyze usage patterns, identify bugs, and develop new features that enhance the user experience. We continuously refine our AI models using aggregated usage data.",
            },
            {
              label: "Communication",
              desc: "To send you service-related notifications, account updates, security alerts, and support responses. With your consent, we may also send promotional materials about new features or offers.",
            },
            {
              label: "Analytics and Research",
              desc: "To conduct data analysis, identify trends, and improve prediction accuracy. All analytics are performed on anonymized or aggregated data where possible.",
            },
            {
              label: "Security and Fraud Prevention",
              desc: "To detect and prevent unauthorized access, abuse, or fraudulent activities on our platform. We monitor for suspicious behavior to protect all users.",
            },
            {
              label: "Legal Compliance",
              desc: "To comply with applicable laws, regulations, and legal processes. We may disclose information when required by law or to protect our rights.",
            },
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-gray-900">{item.label}:</strong>{" "}
                {item.desc}
              </div>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and Tracking Technologies",
    icon: Cookie,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          CricVista uses cookies and similar technologies to enhance your
          browsing experience, analyze site traffic, and understand where our
          audience comes from. Cookies are small text files stored on your
          device by your web browser.
        </p>
        <div className="grid gap-3">
          {[
            {
              title: "Essential Cookies",
              desc: "Required for the basic functionality of our platform, including session management, authentication, and security features. These cannot be disabled.",
            },
            {
              title: "Preference Cookies",
              desc: "Remember your settings and preferences, such as language, theme selection, and customization choices to provide a personalized experience.",
            },
            {
              title: "Analytics Cookies",
              desc: "Help us understand how users interact with our platform by collecting anonymous usage data. This allows us to improve our services continuously.",
            },
            {
              title: "Marketing Cookies",
              desc: "Used to deliver relevant advertisements and measure the effectiveness of our marketing campaigns. These are only set with your explicit consent.",
            },
          ].map((cookie, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100"
            >
              <Cookie className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-gray-900">{cookie.title}:</strong>{" "}
                {cookie.desc}
              </div>
            </div>
          ))}
        </div>
        <p>
          You can manage cookie preferences through your browser settings.
          Please note that disabling cookies may affect certain features of our
          platform. For more information about how we use cookies, please
          contact us at{" "}
          <a
            href="mailto:cricvista247@gmail.com"
            className="text-blue-600 hover:underline font-medium"
          >
            cricvista247@gmail.com
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    id: "analytics",
    title: "Analytics Services",
    icon: BarChart3,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          We partner with third-party analytics providers to help us understand
          how our platform is used and to improve our services. These providers
          may collect anonymous information about your interactions with
          CricVista.
        </p>
        <div className="grid gap-3">
          <div className="flex gap-3 p-3 bg-blue-50/50 rounded-xl">
            <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-gray-900">
                Google Analytics &amp; Similar Services:
              </strong>{" "}
              We use analytics platforms to track page views, session duration,
              and user engagement metrics. These services use cookies and
              similar technologies. The data collected is anonymized and
              aggregated where possible.
            </div>
          </div>
        </div>
        <p>
          These third-party services have their own privacy policies governing
          the use of your information. We encourage you to review their
          policies. We do not share personally identifiable information with
          these analytics providers without your consent.
        </p>
      </div>
    ),
  },
  {
    id: "user-accounts",
    title: "User Accounts and Data",
    icon: Users,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          When you create an account on CricVista, you are responsible for
          maintaining the confidentiality of your login credentials. You agree
          to notify us immediately of any unauthorized use of your account.
        </p>
        <div className="grid gap-3">
          {[
            "Account information is stored securely and used only for service delivery and communication purposes.",
            "You can update or correct your account information at any time through your account settings.",
            "We provide tools to download your data in a portable format upon request.",
            "Inactive accounts may be deactivated after a prolonged period of inactivity. You will be notified before any such action.",
            "We do not share your account information with third parties for their marketing purposes without your explicit consent.",
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "payment-processing",
    title: "Payment Processing",
    icon: CreditCard,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          <strong className="text-gray-900">Important:</strong> CricVista
          does not store, process, or have access to your complete payment card
          information. All payment transactions are handled securely by
          third-party payment gateways.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <p className="text-green-800 text-sm">
            <strong>We do not store:</strong> Credit/debit card numbers, CVV
            codes, bank account details, UPI PINs, or any other sensitive
            financial information on our servers.
          </p>
        </div>
        <div className="grid gap-3">
          {[
            "Payments are processed through PCI-DSS compliant third-party payment gateways (including Razorpay and other authorized processors).",
            "Your payment data is encrypted end-to-end and transmitted directly to the payment processor without passing through our servers.",
            "We receive only transaction confirmations, payment status, and the last four digits of your card for reference purposes.",
            "Subscription billing is managed through the payment gateway's secure recurring payment infrastructure.",
            "Refunds, if applicable, are processed in accordance with our refund policy and applicable laws.",
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "subscriptions",
    title: "Subscriptions and Billing",
    icon: Bell,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          CricVista offers both free and paid subscription plans. This
          section outlines how we handle subscription-related data and billing
          information.
        </p>
        <div className="grid gap-3">
          {[
            "Subscription plans, pricing, and features are clearly outlined on our pricing page before purchase.",
            "Billing information is collected and processed solely by our PCI-DSS compliant payment processors.",
            "Subscription renewals are automatic unless cancelled before the renewal date. You can cancel anytime through your account settings.",
            "We send email notifications for payment confirmations, upcoming renewals, failed transactions, and subscription changes.",
            "Your subscription history, including plan type, start date, and payment status, is retained for record-keeping and support purposes.",
            "We do not share your subscription details with third parties except as required for payment processing or legal compliance.",
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "data-security",
    title: "Data Security",
    icon: Lock,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          Protecting your data is our top priority. CricVista implements
          industry-standard security measures to safeguard your information
          against unauthorized access, alteration, disclosure, or destruction.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              title: "Encryption",
              desc: "All data transmitted between your device and our servers is encrypted using TLS 1.3 protocol. Data at rest is encrypted using AES-256 encryption.",
            },
            {
              title: "Access Controls",
              desc: "Strict access controls and authentication mechanisms ensure that only authorized personnel can access user data on a need-to-know basis.",
            },
            {
              title: "Regular Audits",
              desc: "We conduct regular security audits, vulnerability assessments, and penetration testing to identify and address potential risks.",
            },
            {
              title: "Secure Infrastructure",
              desc: "Our infrastructure is hosted on secure cloud providers with physical security measures, 24/7 monitoring, and automated threat detection systems.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100"
            >
              <Lock className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-gray-900">{item.title}:</strong>{" "}
                {item.desc}
              </div>
            </div>
          ))}
        </div>
        <p>
          While we implement robust security measures, no method of electronic
          storage or transmission is 100% secure. We cannot guarantee absolute
          security but will notify you of any data breach in accordance with
          applicable laws.
        </p>
      </div>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    icon: Clock,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          We retain your personal information only for as long as necessary to
          fulfill the purposes outlined in this Privacy Policy, unless a longer
          retention period is required or permitted by law.
        </p>
        <div className="grid gap-3">
          {[
            {
              period: "Active Accounts",
              desc: "Your data is retained for the duration of your account's active status plus 12 months after account deletion to allow for data recovery and legal compliance.",
            },
            {
              period: "Payment Records",
              desc: "Transaction records are retained for 7 years as required by tax and financial regulations.",
            },
            {
              period: "Usage Analytics",
              desc: "Anonymized usage data may be retained indefinitely for analytical purposes. Personally identifiable usage data is retained for a maximum of 24 months.",
            },
            {
              period: "Communication Logs",
              desc: "Support tickets and communication records are retained for 3 years after resolution.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 bg-blue-50/50 rounded-xl"
            >
              <Clock className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-gray-900">{item.period}:</strong>{" "}
                {item.desc}
              </div>
            </div>
          ))}
        </div>
        <p>
          When data is no longer required, it is securely deleted or
          anonymized. You may request earlier deletion of your data as outlined
          in the User Rights section below.
        </p>
      </div>
    ),
  },
  {
    id: "user-rights",
    title: "Your Rights",
    icon: FileText,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          Depending on your jurisdiction, you may have the following rights
          regarding your personal data. We are committed to facilitating the
          exercise of these rights:
        </p>
        <div className="grid gap-3">
          {[
            {
              title: "Right to Access",
              desc: "You have the right to request a copy of the personal data we hold about you, including how it is processed and with whom it is shared.",
            },
            {
              title: "Right to Rectification",
              desc: "You can request correction of inaccurate or incomplete personal data we hold about you. You can also update much of this information directly through your account settings.",
            },
            {
              title: "Right to Deletion (Right to be Forgotten)",
              desc: "You can request the deletion of your personal data when it is no longer necessary for the purposes for which it was collected, subject to legal retention requirements.",
            },
            {
              title: "Right to Data Portability",
              desc: "You have the right to receive your personal data in a structured, commonly used, and machine-readable format, and to transmit that data to another controller.",
            },
            {
              title: "Right to Withdraw Consent",
              desc: "Where processing is based on your consent, you have the right to withdraw that consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.",
            },
            {
              title: "Right to Object",
              desc: "You have the right to object to the processing of your personal data for direct marketing purposes or processing based on legitimate interests.",
            },
            {
              title: "Right to Restrict Processing",
              desc: "You can request restriction of processing of your personal data in certain circumstances, such as when you contest the accuracy of the data.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100"
            >
              <FileText className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-gray-900">{item.title}:</strong>{" "}
                {item.desc}
              </div>
            </div>
          ))}
        </div>
        <p>
          To exercise any of these rights, please contact us at{" "}
          <a
            href="mailto:cricvista247@gmail.com"
            className="text-blue-600 hover:underline font-medium"
          >
            cricvista247@gmail.com
          </a>
          . We will respond to your request within 30 days as required by
          applicable regulations.
        </p>
      </div>
    ),
  },
  {
    id: "children-privacy",
    title: "Children's Privacy",
    icon: Users,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-red-800 text-sm font-medium">
            CricVista is not intended for individuals under the age of 18.
            We do not knowingly collect personal information from children or
            minors.
          </p>
        </div>
        <p>
          Our services are designed for adult users who are 18 years of age or
          older. If you are a parent or guardian and believe that your child has
          provided us with personal information without your consent, please
          contact us immediately.
        </p>
        <div className="flex gap-3 p-3 bg-blue-50/50 rounded-xl">
          <Trash2 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <strong className="text-gray-900">What we will do:</strong> Upon
            verification, we will promptly delete any personal information
            inadvertently collected from a minor and take steps to ensure that
            such data is not retained.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    icon: FileText,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          CricVista reserves the right to update or modify this Privacy
          Policy at any time. We will notify you of material changes through
          prominent notice on our platform and/or via email.
        </p>
        <div className="grid gap-3">
          {[
            "The 'Last updated' date at the top of this policy will reflect the most recent changes.",
            "Material changes will be communicated via email to registered users at least 7 days before they take effect.",
            "Minor changes or clarifications may take effect immediately upon posting.",
            "Your continued use of CricVista after changes constitute acceptance of the updated policy.",
            "We encourage you to review this Privacy Policy periodically for any updates.",
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p>
          If you do not agree with any changes to this Privacy Policy, you may
          discontinue using our services and request deletion of your data.
        </p>
      </div>
    ),
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: Mail,
    content: (
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or our data practices, please don't hesitate to
          contact us:
        </p>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a
                  href="mailto:cricvista247@gmail.com"
                  className="text-blue-600 hover:underline font-medium"
                >
                  cricvista247@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Response Time</p>
                <p className="text-gray-900 font-medium">
                  Within 48 hours (business days)
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          For data deletion requests, please include the subject line "Data
          Deletion Request" in your email along with your registered email
          address for verification purposes.
        </p>
      </div>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen page-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
            <Shield className="h-4 w-4 mr-2 text-blue-200" />
            <span className="text-white/90">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Your Privacy Matters
          </h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
            We are committed to protecting your personal data and being
            transparent about how we collect, use, and safeguard your
            information.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Clock className="h-4 w-4 text-blue-200" />
            <span className="text-sm text-blue-100">
              Last updated: July 1, 2026
            </span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Table of Contents */}
          <aside className="lg:w-72 shrink-0">
            <nav className="sticky top-24 space-y-1">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 px-3 uppercase tracking-wider">
                  On this page
                </h3>
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition-all duration-200 group"
                  >
                    <s.icon className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    <span>{s.title}</span>
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {sections.map((s, index) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-24"
              >
                <Card className="border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                        <s.icon className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {s.title}
                      </h2>
                    </div>
                    {s.content}
                  </CardContent>
                </Card>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
        <Card className="border border-amber-200/50 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-sm">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shrink-0 mt-1">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Disclaimer
                </h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  CricVista provides AI-powered sports analytics and
                  statistical insights for informational and entertainment
                  purposes only. We do not facilitate betting, gambling,
                  wagering, or real-money gaming. Our predictions and analyses
                  are based on statistical models and historical data, and
                  should not be considered as financial or gambling advice. User
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
