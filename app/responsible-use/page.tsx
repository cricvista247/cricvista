/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  AlertTriangle,
  Scale,
  Brain,
  Heart,
  Mail,
  RefreshCw,
  Users,
  Ban,
  Gavel,
  Lightbulb,
  BookOpen,
  MessageCircle,
  Clock,
  Globe,
} from "lucide-react";
import Link from "next/link";

const ResponsibleUsePage = () => {
  const sections = [
    {
      icon: Scale,
      title: "Purpose of the Platform",
      color: "blue",
      content: (
        <div className="space-y-4">
          <p>
            CricVista provides AI-generated sports analytics, statistical
            insights, and predictive models designed to enhance your
            understanding of cricket and other sports. Our platform leverages
            machine learning algorithms to analyze historical data, player
            performance metrics, weather conditions, and other relevant factors.
          </p>
          <p>
            The platform is strictly intended for informational and
            entertainment purposes only. The insights, analytics, and analyses
            provided by CricVista should be used solely as educational
            tools to better understand the dynamics of sports analytics.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-800">
                  Important Disclaimer
                </p>
                <p className="text-amber-700 text-sm mt-1">
                  CricVista does NOT provide financial advice, betting
                  advice, gambling recommendations, or guarantees of any kind.
                  All analytics are statistical probabilities, not
                  certainties.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Ban,
      title: "No Betting or Gambling",
      color: "red",
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl">
            <p className="text-red-800 font-semibold text-lg leading-relaxed">
              CricVista does not facilitate, promote, or encourage
              betting, gambling, wagering, fantasy sports with entry fees, or
              any form of real-money gaming. The platform is designed solely for
              cricket analytics education and entertainment.
            </p>
          </div>
          <p>
            We explicitly prohibit the use of our platform for any
            gambling-related activities. Our AI models and analytics are
            developed to foster a deeper appreciation and understanding of
            sports statistics — not to be used as tools for financial gain
            through betting.
          </p>
          <p>
            Users who engage in gambling activities using information from our
            platform do so entirely at their own risk. CricVista bears no
            responsibility for any financial losses incurred through such
            activities.
          </p>
        </div>
      ),
    },
    {
      icon: Users,
      title: "User Responsibilities",
      color: "blue",
      content: (
        <div className="space-y-4">
          <p>
            As a user of CricVista, you accept the following
            responsibilities:
          </p>
          <ul className="space-y-3">
            {[
              {
                icon: Gavel,
                text: "You are solely responsible for how you use the information and insights provided by our platform.",
              },
              {
                icon: Globe,
                text: "You must comply with all applicable local, state, national, and international laws regarding the use of sports analytics tools.",
              },
              {
                icon: Shield,
                text: "You confirm that you are 18 years of age or older to use this platform.",
              },
              {
                icon: Ban,
                text: "You agree not to use any insights or data from CricVista for illegal activities, including but not limited to illegal gambling or match-fixing.",
              },
              {
                icon: BookOpen,
                text: "You acknowledge that the platform is for educational and entertainment purposes only.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ),
    },
    {
      icon: Brain,
      title: "Understanding AI Limitations",
      color: "purple",
      content: (
        <div className="space-y-4">
          <p>
            While CricVista employs advanced machine learning models and
            sophisticated algorithms, it is essential to understand the
            inherent limitations of artificial intelligence in sports
            prediction:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Inherent Uncertainty",
                description:
                  "AI models operate on probabilities, not certainties. No analysis can account for every variable in a live sporting event.",
              },
              {
                title: "Past Performance",
                description:
                  "Historical data does not guarantee future results. Past performance of teams, players, or models is not indicative of future outcomes.",
              },
              {
                title: "Statistical Probabilities",
                description:
                  "All forecasts are expressed as statistical probabilities. A 90% analysis still carries a 10% chance of being incorrect.",
              },
              {
                title: "Model Limitations",
                description:
                  "AI models may not account for unexpected events such as injuries, weather changes, or other unforeseen circumstances.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-sm"
              >
                <CardContent className="p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-purple-700 text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: Lightbulb,
      title: "Responsible Usage Guidelines",
      color: "green",
      content: (
        <div className="space-y-4">
          <p>
            To ensure a positive and responsible experience, we encourage all
            users to follow these guidelines:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: BookOpen,
                title: "Learn, Don't Gamble",
                description:
                  "Use our analytics as a learning tool to understand sports statistics and improve your knowledge of the game.",
              },
              {
                icon: Heart,
                title: "Don't Chase Losses",
                description:
                  "If you experience financial losses related to sports activities, do not use our platform to attempt to recover them through increased activity.",
              },
              {
                icon: MessageCircle,
                title: "Maintain Perspective",
                description:
                  "Remember that sports are inherently unpredictable. No amount of data analysis can guarantee specific outcomes.",
              },
              {
                icon: Clock,
                title: "Set Boundaries",
                description:
                  "Establish time limits for using the platform. Excessive use of analytics tools can lead to unhealthy fixation on analytics.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Card
                  key={i}
                  className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-green-700 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      icon: MessageCircle,
      title: "Support Resources",
      color: "teal",
      content: (
        <div className="space-y-4">
          <p>
            Your well-being is our priority. If you have concerns about your
            use of sports analytics tools or related activities,
            we encourage you to reach out:
          </p>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 p-6 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-teal-900">
                  Contact Us Anytime
                </p>
                <a
                  href="mailto:cricvista247@gmail.com"
                  className="text-teal-700 hover:text-teal-900 underline text-lg font-medium"
                >
                  cricvista247@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">
                  Seeking Professional Help
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  If you or someone you know is struggling with gambling
                  addiction or compulsive behavior, we strongly encourage you
                  to seek professional help from certified counselors and
                  support organizations in your region.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: RefreshCw,
      title: "Policy Updates",
      color: "gray",
      content: (
        <div className="space-y-4">
          <p>
            CricVista reserves the right to update, modify, or change
            this Responsible Use Policy at any time without prior notice.
            Changes will be effective immediately upon posting the updated
            policy on this page.
          </p>
          <p>
            We encourage users to review this policy periodically to stay
            informed about how we are promoting responsible use of our
            platform. Continued use of CricVista after any modifications
            constitutes acceptance of the updated policy.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: July 2025</span>
          </div>
        </div>
      ),
    },
  ];

  const getGradient = (color: string) => {
    const gradients: Record<string, string> = {
      blue: "from-blue-600 to-blue-700",
      red: "from-red-600 to-red-700",
      purple: "from-purple-600 to-purple-700",
      green: "from-green-600 to-green-700",
      teal: "from-teal-600 to-teal-700",
      gray: "from-gray-600 to-gray-700",
    };
    return gradients[color] || gradients.blue;
  };

  const getBadgeBg = (color: string) => {
    const bgs: Record<string, string> = {
      blue: "bg-blue-100 text-blue-700",
      red: "bg-red-100 text-red-700",
      purple: "bg-purple-100 text-purple-700",
      green: "bg-green-100 text-green-700",
      teal: "bg-teal-100 text-teal-700",
      gray: "bg-gray-100 text-gray-700",
    };
    return bgs[color] || bgs.blue;
  };

  const getCardBg = (color: string) => {
    const bgs: Record<string, string> = {
      blue: "from-blue-50 to-blue-100",
      red: "from-red-50 to-red-100",
      purple: "from-purple-50 to-purple-100",
      green: "from-green-50 to-green-100",
      teal: "from-teal-50 to-teal-100",
      gray: "from-gray-50 to-gray-100",
    };
    return bgs[color] || bgs.blue;
  };

  const getIconBg = (color: string) => {
    const bgs: Record<string, string> = {
      blue: "bg-blue-600",
      red: "bg-red-600",
      purple: "bg-purple-600",
      green: "bg-green-600",
      teal: "bg-teal-600",
      gray: "bg-gray-600",
    };
    return bgs[color] || bgs.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Shield className="h-4 w-4 mr-2" />
              Responsible Use Policy
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Committed to{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Responsible
              </span>{" "}
              Use
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              CricVista is dedicated to providing AI-powered sports
              analytics for educational and entertainment purposes only. We do
              not promote or facilitate gambling.
            </p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg overflow-hidden"
                >
                  <div
                    className={`bg-gradient-to-r ${getGradient(section.color)} px-6 py-4 flex items-center gap-3`}
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      {section.title}
                    </h2>
                  </div>
                  <CardContent
                    className={`p-6 bg-gradient-to-br ${getCardBg(section.color)}`}
                  >
                    {section.content}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Summary Banner */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-xl">
              <CardContent className="p-8 md:p-10 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Use Responsibly. Stay Informed.
                </h2>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-6">
                  CricVista is your companion for sports analytics
                  education — not a tool for gambling or financial decision-making.
                  Always use insights responsibly and in accordance with your
                  local laws.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/terms"
                    className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    <Gavel className="h-4 w-4 mr-2" />
                    Terms of Service
                  </Link>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Us
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResponsibleUsePage;
