/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Mail,
  Phone,
  Clock,
  MessageCircle,
  HelpCircle,
  Send,
  Copy,
  Check,
  ChevronRight,
  HeadphonesIcon,
  MapPin,
  Shield,
  ExternalLink,
  Loader2,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const subjects = [
  { label: "General Inquiry", value: "general" },
  { label: "Technical Support", value: "technical" },
  { label: "Billing Question", value: "billing" },
  { label: "Partnership", value: "partnership" },
  { label: "Other", value: "other" },
];

const faqItems = [
  {
    question: "How accurate are CricVista's analytics?",
    answer:
      "Our AI models consistently achieve 95%+ accuracy across all cricket formats. We analyze 50+ factors including player form, pitch conditions, weather, historical data, and head-to-head statistics to deliver the most reliable analytics in the industry.",
  },
  {
    question: "How do I subscribe to premium analytics?",
    answer:
      "You can subscribe by visiting our Subscription page. We offer various plans — weekly, monthly, and yearly — each providing access to detailed match analysis, Dream11 team suggestions, and real-time updates. All major payment methods are supported.",
  },
  {
    question: "Can I get a refund if an analysis is wrong?",
    answer:
      "Analytics are based on data-driven analysis and no outcome is guaranteed. However, we offer a satisfaction guarantee — if you experience consistent inaccuracies, contact our support team and we'll review your case personally.",
  },
  {
    question: "Do you cover women's cricket and other leagues?",
    answer:
      "Yes! We cover all major men's and women's cricket tournaments including ICC events, IPL, BBL, PSL, CPL, The Hundred, WPL, international bilaterals, and many domestic leagues worldwide.",
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "cricvista247@gmail.com",
      copyValue: "cricvista247@gmail.com",
      copyLabel: "Email address",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Phone,
      label: "Phone / WhatsApp",
      value: "+91 8981374643",
      copyValue: "8981374643",
      copyLabel: "Phone number",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: "24/7 Support",
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Kolkata, India",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="inline-flex items-center px-4 py-2 bg-white/10 text-white border-0 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <HeadphonesIcon className="h-4 w-4 mr-2" />
              Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              We'd Love to Hear
              <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                {" "}
                From You
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Have a question, feedback, or partnership idea? Our team is ready
              to assist you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg font-semibold shadow-xl"
                onClick={() =>
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Send className="h-5 w-5 mr-2" />
                Send a Message
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
                asChild
              >
                <Link href="/support">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Support Center
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12 md:py-16" id="contact-form">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Contact Form */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Send className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Send Us a Message
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Fill out the form and we'll respond within 24 hours
                    </p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="h-11 rounded-lg border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="h-11 rounded-lg border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                      <option value="" disabled>
                        Select a subject
                      </option>
                      {subjects.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="rounded-lg border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base rounded-lg shadow-lg shadow-blue-600/25 transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <HeadphonesIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Contact Information
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Reach out through any of these channels
                    </p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const hasCopy = "copyValue" in item;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`${item.bgColor} p-2.5 rounded-lg shrink-0`}>
                          <Icon className={`h-4 w-4 ${item.iconColor}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            {item.label}
                          </p>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {item.value}
                          </p>
                        </div>
                      </div>
                      {hasCopy && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-white text-blue-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            copyToClipboard(
                              item.copyValue!,
                              item.copyLabel!,
                            )
                          }
                        >
                          {copied === item.copyLabel ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Links Card */}
            <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/support"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Support Center
                        </p>
                        <p className="text-xs text-gray-500">
                          Create a ticket or chat with us
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </Link>
                  <Link
                    href="/faq"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <HelpCircle className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          FAQ
                        </p>
                        <p className="text-xs text-gray-500">
                          Frequently asked questions
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-600 transition-colors" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badge */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">
                    Your Privacy Matters
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    All information you share is encrypted and kept strictly
                    confidential. We never share your data with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="bg-blue-100 text-blue-700 border-0 px-4 py-1.5 mb-4">
                <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                Frequently Asked Questions
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Got Questions?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions below. Can't find what you're
                looking for? Reach out to our support team.
              </p>
            </div>

            <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 hover:no-underline py-4 px-2 rounded-lg transition-colors">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 px-2 pb-4 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm mb-4">
                Still have questions? We're here to help.
              </p>
              <Button
                asChild
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
              >
                <Link href="/support">
                  <HeadphonesIcon className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="bg-white border-t border-gray-100 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-3 p-5 bg-amber-50 rounded-2xl border border-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-800 mb-1">
                  Disclaimer
                </h4>
                <p className="text-sm text-amber-700 leading-relaxed">
                  CricVista provides cricket analytics and insights for
                  informational and entertainment purposes only. While we strive
                  for accuracy using advanced AI and data analysis, we do not
                  guarantee any specific outcomes or results. Analytics should
                  not be considered financial or betting advice. Please play
                  responsibly and comply with all applicable laws in your
                  jurisdiction. Fantasy sports and analytics involve risk —
                  never wager more than you can afford to lose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
