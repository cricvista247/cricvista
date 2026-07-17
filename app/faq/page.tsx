/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useMemo } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Shield,
  CreditCard,
  Smartphone,
  Mail,
  Clock,
  Brain,
  Database,
  BarChart3,
  AlertTriangle,
  UserPlus,
  Sparkles,
  Zap,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ElementType;
}

interface FAQCategory {
  category: string;
  icon: React.ElementType;
  color: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    category: "General",
    icon: HelpCircle,
    color: "from-blue-500 to-cyan-500",
    items: [
      {
        question: "What is CricVista?",
        icon: Brain,
        answer:
          "CricVista is an AI-powered cricket analytics platform that provides statistical insights, team analysis, venue intelligence, and AI-generated match forecasts for cricket enthusiasts. Our platform helps users make informed decisions in fantasy sports using cutting-edge machine learning technology.",
      },
      {
        question: "How are AI insights generated?",
        icon: BarChart3,
        answer:
          "Our AI insights are generated using machine learning models trained on extensive historical match data, player statistics, venue conditions, pitch reports, team performance metrics, and real-time match information. The models analyze patterns and correlations across millions of data points to produce accurate forecasts.",
      },
      {
        question: "How accurate are AI confidence scores?",
        icon: Zap,
        answer:
          "Confidence scores are statistical assessments based on our model's analysis. They represent the model's confidence in its analysis, not guarantees of outcomes. Historical model accuracy metrics are displayed alongside each analysis so users can make informed judgments.",
      },
      {
        question: "What data sources are used?",
        icon: Database,
        answer:
          "We use a comprehensive database that includes historical match results, player performance records, venue statistics, pitch condition reports, weather data, head-to-head records, and real-time match information from multiple reliable sports data providers.",
      },
      {
        question: "Does CricVista provide betting tips?",
        icon: AlertTriangle,
        answer:
          "No. We provide AI-powered sports analytics for informational and entertainment purposes only. We do not offer betting advice, gambling recommendations, or guarantees of outcomes. Users should always use their own judgment and consult applicable laws in their jurisdiction.",
      },
      {
        question: "Can AI guarantee match outcomes?",
        icon: Shield,
        answer:
          "No. Sports are inherently unpredictable. AI insights are statistical forecasts based on historical data and current conditions, not guarantees. Past performance does not guarantee future results. We encourage responsible use of our analytics.",
      },
    ],
  },
  {
    category: "Account & Subscription",
    icon: CreditCard,
    color: "from-purple-500 to-pink-500",
    items: [
      {
        question: "How do I create an account?",
        icon: UserPlus,
        answer:
          "Creating an account is simple. Click the 'Sign Up' button on our homepage, enter your email address and create a password, and you're ready to go. Your free account provides basic access to our platform features and limited daily analysis views.",
      },
      {
        question: "What is included in the free plan?",
        icon: Sparkles,
        answer:
          "The free plan includes limited daily analysis views and basic match insights. You can explore our platform, view some insights, and get a feel for the quality of our analytics before deciding to upgrade to a premium plan.",
      },
      {
        question: "What are the Premium plans?",
        icon: BookOpen,
        answer:
          "We offer four premium tiers: Starter, Pro Analytics, Elite Analytics, and Enterprise. Each plan offers increasing levels of access to AI analysis, venue reports, player statistics, historical analytics, and priority support. Visit our Premium page for detailed feature comparisons.",
      },
      {
        question: "How do I upgrade my subscription?",
        icon: ArrowRight,
        answer:
          "Visit the Premium page, browse the available plans, and choose the one that best fits your needs. Complete your payment through our secure payment gateway, and your upgraded features will be activated immediately.",
      },
    ],
  },
  {
    category: "Technical",
    icon: Smartphone,
    color: "from-green-500 to-emerald-500",
    items: [
      {
        question: "How does the AI model work?",
        icon: Brain,
        answer:
          "Our AI uses an ensemble of statistical models that analyze multiple factors including team composition, head-to-head records, venue history, pitch conditions, player form, weather conditions, and match context. The ensemble approach combines analyses from multiple models to produce more accurate and reliable forecasts.",
      },
      {
        question: "Is my data secure?",
        icon: Shield,
        answer:
          "Yes, absolutely. We use industry-standard encryption protocols, secure servers, and follow best practices for data protection. Your personal information and account data are always protected. Please see our Privacy Policy for detailed information about how we handle your data.",
      },
      {
        question: "Can I access the platform on mobile?",
        icon: Smartphone,
        answer:
          "Yes, the platform is fully responsive and works seamlessly on all devices including smartphones and tablets. Our Android app is also available for download, providing an optimized mobile experience with push notifications for match updates.",
      },
    ],
  },
  {
    category: "Support",
    icon: MessageCircle,
    color: "from-orange-500 to-red-500",
    items: [
      {
        question: "How do I contact support?",
        icon: Mail,
        answer:
          "You can reach us via email at cricvista247@gmail.com, use the in-app support chat feature available on the dashboard, or visit our Contact page to submit a support request. We're here to help with any questions or issues you may encounter.",
      },
      {
        question: "How quickly does support respond?",
        icon: Clock,
        answer:
          "Our support team typically responds within 24 hours. Premium users receive priority support with faster response times, often within a few hours. We strive to resolve all issues as quickly and efficiently as possible.",
      },
    ],
  },
];

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return activeCategory
        ? faqData.filter((cat) => cat.category === activeCategory)
        : faqData;
    }

    const query = searchQuery.toLowerCase();
    return faqData
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [searchQuery, activeCategory]);

  const totalFaqs = faqData.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
              <HelpCircle className="h-4 w-4 mr-2" />
              Frequently Asked Questions
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Got Questions?
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {" "}
                We've Got Answers
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about CricVista. Can't find what
              you're looking for? Feel free to contact our support team.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-2xl">
                <div className="flex items-center bg-white/5 rounded-xl">
                  <Search className="h-5 w-5 text-blue-200 ml-4 flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent text-white placeholder-blue-200/70 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-6"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2 text-blue-200 hover:text-white hover:bg-white/10"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory(null);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{totalFaqs} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{faqData.length} Categories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${
                activeCategory === null
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : ""
              }`}
              onClick={() => setActiveCategory(null)}
            >
              All Categories
            </Button>
            {faqData.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.category}
                  variant={
                    activeCategory === category.category ? "default" : "outline"
                  }
                  size="sm"
                  className={`rounded-full ${
                    activeCategory === category.category
                      ? `bg-gradient-to-r ${category.color} text-white`
                      : ""
                  }`}
                  onClick={() => setActiveCategory(category.category)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.category}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredCategories.length > 0 ? (
              <div className="space-y-12">
                {filteredCategories.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <div key={category.category}>
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}
                        >
                          <CategoryIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {category.category}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {category.items.length} question
                            {category.items.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <Accordion type="single" collapsible className="divide-y divide-gray-100">
                          {category.items.map((item, index) => {
                            const ItemIcon = item.icon;
                            return (
                              <AccordionItem
                                key={index}
                                value={`${category.category}-${index}`}
                                className="border-0"
                              >
                                <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-gray-50/50 transition-colors group">
                                  <div className="flex items-center gap-4 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center flex-shrink-0 group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
                                      <ItemIcon className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <span className="font-medium text-gray-900 text-base">
                                      {item.question}
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-5">
                                  <div className="flex gap-4 pl-12">
                                    <div className="w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 flex-shrink-0 rounded-full" />
                                    <p className="text-gray-600 leading-relaxed">
                                      {item.answer}
                                    </p>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No results found
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find any FAQs matching your search. Try using
                  different keywords or browse all categories.
                </p>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory(null);
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Browse All FAQs
                </Button>
              </div>
            )}

            {/* Still have questions? */}
            <div className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-10 text-center border border-blue-100/50">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Still Have Questions?
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Can't find the answer you're looking for? Our support team is
                here to help you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8"
                  asChild
                >
                  <Link href="/contact">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Support
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 px-8"
                  asChild
                >
                  <Link href="mailto:cricvista247@gmail.com">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience AI-Powered Cricket Analytics?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of cricket enthusiasts making smarter decisions
              with CricVista
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                asChild
              >
                <Link href="/auth/register">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Sign Up Free
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
                asChild
              >
                <Link href="/matches">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Live Matches
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
