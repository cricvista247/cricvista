/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Star,
  Trophy,
  BarChart3,
  Users,
  ChevronRight,
  Play,
  Sparkles,
  Brain,
  MapPin,
  TrendingUp,
  Activity,
  Check,
  Zap,
  HelpCircle,
  Quote,
  Globe,
  Layers,
  LineChart,
  Sun,
  Droplets,
  Wind,
  Calendar,
  Eye,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setSelectedMatch } from "@/store/slices/matchSlice";
import { useQuery } from "@tanstack/react-query";
import MatchCard from "../matches/MatchCard";
import { FetchMatchList } from "../MainService";

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "1M+", label: "Analyses Generated" },
  { value: "95%+", label: "Model Accuracy" },
  { value: "15+", label: "Countries Served" },
];

const features = [
  {
    icon: Brain,
    title: "AI Match Analysis",
    description:
      "Machine learning models analyze 50+ factors including team composition, player form, and historical patterns to deliver deep match intelligence.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Team Comparison",
    description:
      "Comprehensive head-to-head statistics with performance metrics spanning batting averages, bowling economy, and win/loss ratios across formats.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: MapPin,
    title: "Venue Intelligence",
    description:
      "Ground-specific historical data covering pitch behavior, average scores, toss impact, and team performance at every venue worldwide.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Player Performance",
    description:
      "Individual player analytics tracking form curves, strike rates, matchup data against specific bowlers, and venue-specific contributions.",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const premiumTiers = [
  {
    name: "Starter",
    price: "\u20B949",
    period: "/month",
    description: "Essential cricket analytics for casual enthusiasts",
    popular: false,
    features: [
      "Basic match insights",
      "Team comparison stats",
      "Venue intelligence data",
      "Player performance metrics",
      "Email support",
    ],
    cta: "Get Started",
    gradient: "from-slate-100 to-slate-200",
    border: "border-slate-200",
    icon: Layers,
  },
  {
    name: "Pro Analytics",
    price: "\u20B9199",
    period: "/month",
    description: "Advanced analytics for serious cricket analysts",
    popular: true,
    features: [
      "Everything in Starter",
      "AI-powered match insights",
      "Historical trend analysis",
      "Real-time match tracking",
      "Priority support",
      "Export reports (PDF/CSV)",
    ],
    cta: "Upgrade to Pro",
    gradient: "from-blue-500 to-indigo-600",
    border: "border-blue-500",
    icon: Trophy,
  },
  {
    name: "Elite Analytics",
    price: "\u20B9599",
    period: "/month",
    description: "Enterprise-grade intelligence for professionals",
    popular: false,
    features: [
      "Everything in Pro Analytics",
      "API access for custom integration",
      "Multi-format historical database",
      "Dedicated account manager",
      "Custom alert configuration",
      "Team collaboration tools",
      "White-label reports",
    ],
    cta: "Go Elite",
    gradient: "from-purple-500 to-amber-500",
    border: "border-purple-400",
    icon: Crown,
  },
];

const customerReviews = [
  {
    name: "Rahul Sharma",
    rating: 5,
    comment:
      "The depth of analytics on this platform is incredible. I've never seen such detailed team and player insights anywhere else. Game changer for serious cricket enthusiasts!",
    avatar: "RS",
    role: "Cricket Analyst",
  },
  {
    name: "Priya Patel",
    rating: 5,
    comment:
      "The player analytics are incredibly detailed. The AI-driven form analysis and venue-specific metrics help me understand the game at a whole new level.",
    avatar: "PP",
    role: "Fantasy Sports Player",
  },
  {
    name: "Amit Kumar",
    rating: 4,
    comment:
      "Great accuracy in match insights and team comparison tools. The historical venue data is exceptionally thorough. Highly recommend for data-driven cricket fans.",
    avatar: "AK",
    role: "Sports Journalist",
  },
];

const faqs = [
  {
    question: "How does CricVista generate its match insights?",
    answer:
      "Our platform uses advanced machine learning models that analyze over 50 factors including team composition, player form, head-to-head records, venue statistics, weather conditions, and historical patterns to deliver comprehensive match intelligence.",
  },
  {
    question: "What types of cricket data does the platform cover?",
    answer:
      "We cover a wide range of data including player performance metrics, team statistics, venue intelligence, pitch reports, weather correlation, head-to-head records, format-specific analytics, and historical trend analysis across international and domestic cricket.",
  },
  {
    question: "Can I access the analytics on mobile devices?",
    answer:
      "Yes! CricVista is fully responsive and works seamlessly across desktop, tablet, and mobile devices. All insights, charts, and data visualizations are optimized for any screen size.",
  },
  {
    question: "Is there a free tier available?",
    answer:
      "Absolutely. Our Starter plan at \u20B949/month provides essential cricket analytics, team comparison stats, and venue intelligence. For advanced features like AI-powered insights and real-time tracking, check out our Pro Analytics plan.",
  },
  {
    question: "How frequently is the data updated?",
    answer:
      "Match data and statistics are updated in real-time during live matches. Historical data is refreshed daily with the latest completed matches. Our AI models are retrained regularly to maintain over 95% accuracy on insights.",
  },
];

const HomePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const { data = [] } = useQuery({
    queryKey: ["match-list"],
    queryFn: async () => {
      const response = await FetchMatchList(new Date());
      return response.data;
    },
  });

  const handleMatchClick = (match: any) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    router.push(`/matches/${match._id}`);
    dispatch(setSelectedMatch(match));
  };

  return (
    <div className="min-h-screen">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              AI-Powered Cricket Analytics Platform
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              AI-Powered Cricket
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                Analytics Platform
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-blue-100 md:text-xl">
              Advanced statistical insights, team analysis, venue intelligence,
              and AI-generated match forecasts designed for cricket enthusiasts.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group gap-2 bg-gradient-to-r from-orange-500 to-red-600 px-8 py-6 text-lg font-semibold shadow-xl shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-700"
                asChild
              >
                <Link href="/matches">
                  <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
                  Explore Analytics
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 bg-white/10 px-8 py-6 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-blue-700"
                asChild
              >
                <Link href="/subscription">
                  <Sparkles className="h-5 w-5" />
                  Upgrade to Premium
                </Link>
              </Button>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-1 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ─── AI Match Insights ─── */}
      <section className="relative bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <Badge className="mb-4 border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
              <Brain className="mr-1.5 h-4 w-4" />
              AI-Powered Intelligence
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Match Insights Powered by Machine Learning
            </h2>
            <p className="text-lg text-gray-600">
              Our ML models process millions of data points to deliver
              actionable cricket intelligence.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={i}
                  className="group border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardContent className="p-6">
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Team Comparison ─── */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge className="mb-4 border-purple-200 bg-purple-50 px-4 py-1.5 text-sm text-purple-700">
                <Users className="mr-1.5 h-4 w-4" />
                Head-to-Head Analysis
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Deep Team Comparison Intelligence
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                Compare teams across every dimension — batting averages, bowling
                economy, strike rates, powerplay performance, death overs
                statistics, and head-to-head records across all formats.
              </p>
              <ul className="mb-8 space-y-3">
                {[
                  "Format-specific win/loss ratios",
                  "Batting and bowling performance metrics",
                  "Recent form comparison (last 10 matches)",
                  "Head-to-head historical records",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <Check className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
                asChild
              >
                <Link href="/matches">
                  Explore Team Stats
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                      IND
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      India
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-bold text-gray-400">VS</span>
                    <Badge className="bg-blue-100 text-blue-700">5-3</Badge>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-700">
                      AUS
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      Australia
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Avg Score", left: 287, right: 274 },
                    { label: "Strike Rate", left: 92.4, right: 89.7 },
                    { label: "Wickets/Innings", left: 6.2, right: 7.1 },
                  ].map((row, i) => (
                    <div key={i}>
                      <div className="mb-1 flex justify-between text-xs text-gray-500">
                        <span>{row.left}</span>
                        <span className="font-medium text-gray-700">
                          {row.label}
                        </span>
                        <span>{row.right}</span>
                      </div>
                      <div className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="rounded-l-full bg-blue-500"
                          style={{ width: `${(row.left / (row.left + row.right)) * 100}%` }}
                        />
                        <div
                          className="rounded-r-full bg-purple-500"
                          style={{ width: `${(row.right / (row.left + row.right)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border border-blue-200 bg-blue-50" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Venue Analysis ─── */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Wankhede Stadium, Mumbai
                    </h4>
                    <p className="text-xs text-gray-500">Avg Score: 168</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Batting First Win %</span>
                    <span className="font-semibold text-gray-900">58%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-[58%] rounded-full bg-amber-500" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Chasing Win %</span>
                    <span className="font-semibold text-gray-900">42%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-[42%] rounded-full bg-orange-500" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center text-sm">
                  <div>
                    <div className="font-bold text-gray-900">6.8</div>
                    <div className="text-xs text-gray-500">Avg ER</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">215</div>
                    <div className="text-xs text-gray-500">Highest</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">52%</div>
                    <div className="text-xs text-gray-500">Toss Impact</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-2xl border border-amber-200 bg-amber-50" />
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 border-amber-200 bg-amber-50 px-4 py-1.5 text-sm text-amber-700">
                <MapPin className="mr-1.5 h-4 w-4" />
                Venue Intelligence
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Ground-Specific Historical Analytics
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                Uncover venue-specific patterns with detailed historical data
                for every cricket ground worldwide. Understand how pitch
                conditions, boundaries, and altitude influence match dynamics.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Sun, label: "Avg 1st Innings", value: "162-175" },
                  { icon: Wind, label: "Dew Factor", value: "High Impact" },
                  { icon: Droplets, label: "Weather Correlation", value: "78%" },
                  { icon: TrendingUp, label: "Toss Impact", value: "Moderate" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
                  >
                    <item.icon className="h-5 w-5 shrink-0 text-amber-500" />
                    <div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pitch Report ─── */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge className="mb-4 border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700">
                <Activity className="mr-1.5 h-4 w-4" />
                Pitch Intelligence
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                How Pitch Conditions Shape Match Dynamics
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                Understand how soil type, grass cover, and weather conditions
                interact to influence batting and bowling conditions at every
                venue. Our analytics correlate pitch reports with historical
                performance data.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: Sun,
                    title: "Soil Composition",
                    desc: "Red soil vs black soil impacts bounce and pace. Our models track surface behavior across seasons.",
                  },
                  {
                    icon: Droplets,
                    title: "Grass Cover Analysis",
                    desc: "Grass density and type affect seam movement and swing. Historical data shows clear correlations.",
                  },
                  {
                    icon: Wind,
                    title: "Weather Correlation",
                    desc: "Temperature, humidity, and wind direction are factored into venue-specific match forecasts.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                      <item.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                <h4 className="mb-4 text-center font-semibold text-gray-900">
                  Pitch Behavior Index
                </h4>
                <div className="space-y-4">
                  {[
                    { label: "Batting Friendly", value: 72, color: "bg-green-500" },
                    { label: "Seam Movement", value: 45, color: "bg-blue-500" },
                    { label: "Spin Assistance", value: 38, color: "bg-purple-500" },
                    { label: "Pace & Bounce", value: 65, color: "bg-orange-500" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-semibold text-gray-900">
                          {item.value}%
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-center text-xs text-gray-500">
                  Based on historical match data at this venue
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border border-emerald-200 bg-emerald-50" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Player Performance ─── */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <Badge className="mb-4 border-teal-200 bg-teal-50 px-4 py-1.5 text-sm text-teal-700">
              <BarChart3 className="mr-1.5 h-4 w-4" />
              Player Analytics
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Individual Player Performance Tracking
            </h2>
            <p className="text-lg text-gray-600">
              Track every player's form curve, matchup statistics, and
              venue-specific contributions across all formats.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Virat Kohli",
                initials: "VK",
                role: "Batsman",
                stat: "Avg: 56.8",
                stat2: "SR: 93.2",
                avatarBg: "bg-blue-100",
                avatarText: "text-blue-600",
                recent: [45, 102, 32, 76, 18, 55, 89],
              },
              {
                name: "Jasprit Bumrah",
                initials: "JB",
                role: "Bowler",
                stat: "Econ: 4.2",
                stat2: "Wkts: 32",
                avatarBg: "bg-purple-100",
                avatarText: "text-purple-600",
                recent: [2, 3, 1, 4, 0, 3, 2],
              },
              {
                name: "MS Dhoni",
                initials: "MD",
                role: "Wicket Keeper",
                stat: "Avg: 42.1",
                stat2: "S/R: 87.6",
                avatarBg: "bg-amber-100",
                avatarText: "text-amber-600",
                recent: [22, 45, 12, 67, 34, 18, 55],
              },
            ].map((player, i) => (
              <Card
                key={i}
                className="group border-0 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${player.avatarBg} text-xl font-bold ${player.avatarText}`}
                    >
                      {player.initials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {player.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="mt-1 bg-gray-100 text-gray-600"
                      >
                        {player.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-blue-50 p-2 text-center">
                      <div className="text-sm font-bold text-blue-700">
                        {player.stat}
                      </div>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-2 text-center">
                      <div className="text-sm font-bold text-purple-700">
                        {player.stat2}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-medium text-gray-500">
                      Recent Form
                    </div>
                    <div className="flex items-end gap-1">
                      {player.recent.map((val, j) => (
                        <div
                          key={j}
                          className="flex-1 rounded-t-sm transition-all"
                          style={{
                            height: `${Math.max(12, (val / Math.max(...player.recent)) * 48)}px`,
                            backgroundColor:
                              val >= 50
                                ? "#22c55e"
                                : val >= 30
                                  ? "#eab308"
                                  : "#ef4444",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recent Form / Matches ─── */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <Badge className="mb-3 border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                Live & Upcoming
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Recent Matches
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Track live matches and upcoming fixtures with real-time
                analytics.
              </p>
            </div>
            <Button
              variant="outline"
              className="hidden gap-2 md:flex"
              asChild
            >
              <Link href="/matches">
                View All Matches
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data
              .filter(
                (item: any) =>
                  item.status === "LIVE" || item.status === "NOT_STARTED",
              )
              .slice(0, 6)
              .map((match: any) => (
                <MatchCard
                  key={match._id}
                  match={match}
                  showPredictButton
                  onClick={() => handleMatchClick(match)}
                />
              ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link href="/matches">
                View All Matches
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Historical Match Statistics ─── */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <Badge className="mb-4 border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
              <LineChart className="mr-1.5 h-4 w-4" />
              Historical Analytics
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Comprehensive Historical Match Data
            </h2>
            <p className="text-lg text-blue-100">
              Access years of historical cricket data with advanced filtering by
              format, venue, teams, and time period.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Globe, value: "12,500+", label: "Matches Analyzed" },
              { icon: Users, value: "4,800+", label: "Players Tracked" },
              { icon: MapPin, value: "180+", label: "Venues Covered" },
              { icon: BarChart3, value: "15+ Years", label: "Historical Data" },
            ].map((item, i) => (
              <Card
                key={i}
                className="border-0 border-white/10 bg-white/10 text-center text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="mt-1 text-sm text-blue-200">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Premium Membership ─── */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <Badge className="mb-4 border-yellow-200 bg-yellow-50 px-4 py-1.5 text-sm text-yellow-700">
              <Crown className="mr-1.5 h-4 w-4" />
              Premium Plans
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Choose Your Analytics Plan
            </h2>
            <p className="text-lg text-gray-600">
              Unlock deeper insights with premium analytics features tailored
              for every level.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {premiumTiers.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <Card
                  key={i}
                  className={`group relative border-2 ${tier.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    tier.popular ? "shadow-xl shadow-blue-200/50" : "shadow-lg"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-sm text-white shadow-lg">
                        <Zap className="mr-1 h-3.5 w-3.5" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="mb-2 flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tier.gradient} text-white`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {tier.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {tier.description}
                        </p>
                      </div>
                    </div>
                    <div className="mb-2 mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {tier.price}
                      </span>
                      <span className="text-gray-500">{tier.period}</span>
                    </div>
                    <ul className="mb-6 mt-4 space-y-2.5">
                      {tier.features.map((feat, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <Check
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              tier.popular
                                ? "text-blue-600"
                                : "text-green-500"
                            }`}
                          />
                          <span className="text-sm text-gray-600">{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full gap-2 ${
                        tier.popular
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50 hover:from-blue-700 hover:to-indigo-700"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                      asChild
                    >
                      <Link href="/subscription">
                        {tier.cta}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Customer Testimonials ─── */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <Badge className="mb-4 border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
              <Star className="mr-1.5 h-4 w-4" />
              Testimonials
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Trusted by Cricket Enthusiasts
            </h2>
            <p className="text-lg text-gray-600">
              Hear from our community of analysts, players, and fans.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {customerReviews.map((review, index) => (
              <Card
                key={index}
                className="group border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <CardContent className="p-6">
                  <Quote className="mb-3 h-8 w-8 text-blue-200" />
                  <p className="mb-6 text-gray-600 italic leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white">
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {review.name}
                      </h4>
                      <p className="text-xs text-gray-500">{review.role}</p>
                      <div className="mt-1 flex items-center gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <Badge className="mb-4 border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm text-indigo-700">
              <HelpCircle className="mr-1.5 h-4 w-4" />
              FAQ
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-xl border border-gray-200 bg-white px-6 shadow-sm transition-all hover:shadow-md"
                >
                  <AccordionTrigger className="py-5 text-left font-semibold text-gray-900 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-purple-900 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMS41Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <Badge className="mb-4 border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
              <Sparkles className="mr-1.5 h-4 w-4" />
              Get Started Today
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              Ready to Transform Your
              <br />
              Cricket Analysis?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100">
              Join thousands of cricket enthusiasts who rely on CricVista
              for data-driven insights and intelligence.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="gap-2 bg-white px-8 py-6 text-lg font-semibold text-blue-700 shadow-xl shadow-black/10 transition-all duration-300 hover:scale-105 hover:bg-gray-100"
                asChild
              >
                <Link href="/auth/register">
                  <Users className="h-5 w-5" />
                  Sign Up Free
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 bg-white/10 px-8 py-6 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-blue-700"
                asChild
              >
                <Link href="/matches">
                  <Eye className="h-5 w-5" />
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

export default HomePage;
