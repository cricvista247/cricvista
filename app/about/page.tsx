/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Target,
  Users,
  BarChart3,
  Shield,
  Zap,
  Award,
  TrendingUp,
  CheckCircle,
  Star,
  Brain,
  Database,
  Clock,
  Globe,
  Heart,
  Lightbulb,
  Rocket,
  Scale,
  FileCheck,
  Eye,
} from "lucide-react";
import Link from "next/link";

const AboutPage = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Engine",
      description:
        "Our machine learning algorithms analyze 50+ factors including player form, weather, pitch conditions, and historical data to generate deep cricket insights.",
    },
    {
      icon: Target,
      title: "High-Accuracy Analytics",
      description:
        "Proven track record with industry-leading forecast accuracy backed by comprehensive statistical modeling and data analysis.",
    },
    {
      icon: Database,
      title: "Comprehensive Data Lake",
      description:
        "Access to detailed player statistics, team performance metrics, and match analytics from cricket leagues around the world.",
    },
    {
      icon: Zap,
      title: "Real-time Data Processing",
      description:
        "Live match data ingestion, instant notifications, and real-time analytic adjustments as matches progress.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Enterprise-grade security, 99.9% uptime, and full regulatory compliance for all our users worldwide.",
    },
    {
      icon: Users,
      title: "Expert Support",
      description:
        "24/7 customer support from cricket analysts and technical specialists who understand the game inside out.",
    },
  ];

  const stats = [
    { icon: Users, label: "Active Users", value: "50K+" },
    { icon: BarChart3, label: "Analyses Generated", value: "1M+" },
    { icon: Target, label: "Accuracy Rate", value: "95%+" },
    { icon: Globe, label: "Countries Served", value: "15+" },
  ];

  const team = [
    {
      name: "Sajjan Kumar Yadav",
      role: "Senior Software Engineer & Founder",
      description:
        "Single-handedly building and managing the entire CricVista platform — from AI models to frontend, backend, and infrastructure.",
      avatar: "SK",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description:
        "Started with a vision to revolutionize cricket analytics using artificial intelligence and data science.",
    },
    {
      year: "2021",
      title: "First AI Model",
      description:
        "Launched our first machine learning analytics model with 85% forecast accuracy.",
    },
    {
      year: "2022",
      title: "10K Users",
      description:
        "Reached 10,000 active users and expanded analytics coverage to multiple cricket formats.",
    },
    {
      year: "2023",
      title: "Dream11 Integration",
      description:
        "Introduced Dream11 team suggestions and fantasy cricket analytics features.",
    },
    {
      year: "2024",
      title: "50K Users & 95% Accuracy",
      description:
        "Achieved 50,000+ users and industry-leading 95% statistical forecast accuracy.",
    },
    {
      year: "2025",
      title: "Global Expansion",
      description:
        "Expanding to international markets and adding new sports analytics capabilities.",
    },
  ];

  const values = [
    {
      icon: CheckCircle,
      title: "Accuracy First",
      description:
        "We prioritize analytical accuracy above all else, continuously improving our statistical models and data sources.",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Heart,
      title: "User-Centric",
      description:
        "Every feature we build is designed with our users in mind, ensuring the most intuitive analytics experience possible.",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We constantly push the boundaries of what's possible in sports analytics and data intelligence technology.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Scale,
      title: "Integrity & Compliance",
      description:
        "We operate with complete transparency and adhere to all regulatory frameworks governing sports analytics platforms.",
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: Eye,
      title: "Data-Driven Transparency",
      description:
        "Every insight we provide is backed by verifiable data, statistical methodology, and transparent analytical processes.",
      bgColor: "bg-sky-100",
      iconColor: "text-sky-600",
    },
    {
      icon: TrendingUp,
      title: "Continuous Improvement",
      description:
        "Our models evolve with every match, learning from new data to deliver increasingly refined and accurate analytics.",
      bgColor: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Trophy className="h-4 w-4 mr-2" />
              About CricVista
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              AI-Powered Cricket
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {" "}
                Analytics
              </span>
              <br />
              Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              We provide cricket enthusiasts, analysts, and fantasy sports
              players with AI-driven statistical insights and data intelligence
              to better understand the game.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                asChild
              >
                <Link href="/auth/register">
                  <Rocket className="h-5 w-5 mr-2" />
                  Get Started Free
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                asChild
              >
                <Link href="/matches">View Live Matches</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance Statement Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FileCheck className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      Our Compliance Commitment
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p className="text-lg">
                        CricVista is an AI-powered cricket analytics platform
                        that helps users understand matches using statistical
                        models, historical data, team performance, venue
                        conditions, and player analytics. We do not facilitate
                        betting, gambling, wagering, or real-money gaming.
                      </p>
                      <p>
                        Our platform is designed exclusively for educational and
                        analytical purposes. The insights, statistics, and data
                        visualizations we provide are intended to enhance user
                        understanding of cricket — not to encourage or enable
                        any form of regulated gaming activity.
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 border-blue-300 px-4 py-1.5 text-sm"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Analytics Only
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 border-green-300 px-4 py-1.5 text-sm"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Fully Compliant
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 border-purple-300 px-4 py-1.5 text-sm"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          No Real-Money Gaming
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission & Vision
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  To democratize cricket analytics and empower every fan with
                  AI-driven data insights that were once available only to
                  professional teams. We believe everyone deserves access to
                  accurate, data-backed statistical analysis.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  To become the global leader in sports analytics technology,
                  expanding beyond cricket to all major sports while maintaining
                  our commitment to accuracy, innovation, and data integrity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cutting-edge artificial intelligence meets cricket data science to
              deliver unmatched analytical depth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built by a Solo Developer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              One person, one vision — delivering AI-powered cricket analytics
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 max-w-sm mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {member.avatar}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <Badge className="mb-3">{member.role}</Badge>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From a simple idea to a leading cricket analytics platform
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {milestone.year}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                    >
                      <Icon className={`h-8 w-8 ${value.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Explore Cricket Analytics?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Start your journey with CricVista today and discover data-driven
              cricket insights powered by AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                asChild
              >
                <Link href="/auth/register">
                  <Users className="h-5 w-5 mr-2" />
                  Sign Up Free
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                asChild
              >
                <Link href="/support">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
