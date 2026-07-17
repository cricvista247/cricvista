"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CloudSun,
  Users,
  Swords,
  BrainCircuit,
  PenTool,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  icon: React.ReactNode;
  gradient: string;
}

const CATEGORIES = [
  { id: "all", label: "All Articles" },
  { id: "analytics", label: "Analytics" },
  { id: "pitches", label: "Pitches" },
  { id: "venues", label: "Venues" },
  { id: "players", label: "Players" },
  { id: "weather", label: "Weather" },
  { id: "teams", label: "Teams" },
  { id: "rivalries", label: "Rivalries" },
];

const ARTICLES: BlogPost[] = [
  {
    id: "1",
    title: "How AI Analyzes Cricket Matches",
    excerpt:
      "A deep dive into the machine learning models and statistical methods used to analyze cricket matches, including data points, training methodology, and accuracy metrics.",
    category: "analytics",
    date: "Jun 28, 2026",
    readTime: "8 min read",
    author: "Dr. Arjun Mehta",
    authorRole: "Lead Data Scientist",
    icon: <BrainCircuit className="w-5 h-5" />,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "2",
    title: "Understanding Pitch Conditions",
    excerpt:
      "How pitch reports are compiled and what factors (soil type, grass cover, weather) influence batting, bowling, and overall match dynamics.",
    category: "pitches",
    date: "Jun 25, 2026",
    readTime: "6 min read",
    author: "Sarah Jennings",
    authorRole: "Pitch Analyst",
    icon: <PenTool className="w-5 h-5" />,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "3",
    title: "How Venue Statistics Shape Match Analysis",
    excerpt:
      "Each cricket ground has unique characteristics. Learn how historical venue data improves match intelligence.",
    category: "venues",
    date: "Jun 22, 2026",
    readTime: "5 min read",
    author: "Michael Chen",
    authorRole: "Venue Researcher",
    icon: <TrendingUp className="w-5 h-5" />,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "4",
    title: "Player Performance Metrics Explained",
    excerpt:
      "Beyond runs and wickets: advanced metrics like strike rate analysis, bowling economy, consistency scores, and matchup statistics.",
    category: "players",
    date: "Jun 19, 2026",
    readTime: "10 min read",
    author: "Priya Sharma",
    authorRole: "Performance Analyst",
    icon: <Users className="w-5 h-5" />,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "5",
    title: "Cricket Analytics vs Guesswork",
    excerpt:
      "Why data-driven analysis outperforms intuition-based approaches for understanding cricket matches.",
    category: "analytics",
    date: "Jun 16, 2026",
    readTime: "7 min read",
    author: "Dr. Arjun Mehta",
    authorRole: "Lead Data Scientist",
    icon: <ShieldCheck className="w-5 h-5" />,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "6",
    title: "The Role of Weather in Match Outcomes",
    excerpt:
      "How weather conditions, dew factor, and cloud cover affect player performance and match results.",
    category: "weather",
    date: "Jun 13, 2026",
    readTime: "6 min read",
    author: "Lisa Thompson",
    authorRole: "Meteorologist",
    icon: <CloudSun className="w-5 h-5" />,
    gradient: "from-sky-500 to-cyan-600",
  },
  {
    id: "7",
    title: "Team Composition Analysis",
    excerpt:
      "How batting order, bowling attack balance, and player combinations impact team performance.",
    category: "teams",
    date: "Jun 10, 2026",
    readTime: "9 min read",
    author: "Raj Patel",
    authorRole: "Strategy Analyst",
    icon: <Users className="w-5 h-5" />,
    gradient: "from-green-500 to-lime-600",
  },
  {
    id: "8",
    title: "Historical Rivalry Statistics",
    excerpt:
      "Analyzing head-to-head records, home/away advantages, and historical trends between major cricket teams.",
    category: "rivalries",
    date: "Jun 7, 2026",
    readTime: "7 min read",
    author: "Emma Wilson",
    authorRole: "Cricket Historian",
    icon: <Swords className="w-5 h-5" />,
    gradient: "from-red-500 to-rose-600",
  },
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || article.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  const getCategoryLabel = (categoryId: string) => {
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    return cat ? cat.label.replace("All Articles", "General") : categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const map: Record<string, string> = {
      analytics:
        "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300",
      pitches:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
      venues:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300",
      players:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
      weather:
        "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300",
      teams:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300",
      rivalries:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300",
    };
    return (
      map[categoryId] ||
      "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/30" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/20 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                CricVista Blog
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                Insights & Analytics
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Expert analysis, data-driven insights, and in-depth articles
              powered by AI to help you understand the game beyond the
              scorecard.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Badge
                variant="secondary"
                className="h-10 px-4 rounded-xl text-sm whitespace-nowrap bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                {ARTICLES.length} articles
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide -mx-4 px-4">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container mx-auto px-4 py-10">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            {/* Results summary */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {visibleArticles.length} of {filteredArticles.length}{" "}
                {filteredArticles.length === 1 ? "article" : "articles"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleArticles.map((article) => (
                <a key={article.id} href="#" className="group block">
                  <Card className="h-full overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1">
                    {/* Card top gradient accent */}
                    <div
                      className={`h-2 bg-gradient-to-r ${article.gradient}`}
                    />

                    <div className="p-6 flex flex-col h-[calc(100%-8px)]">
                      {/* Category badge + icon */}
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(article.category)}`}
                        >
                          {getCategoryLabel(article.category)}
                        </Badge>
                        <div
                          className={`flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${article.gradient} text-white shadow-sm`}
                        >
                          {article.icon}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed flex-1">
                        {article.excerpt}
                      </p>

                      {/* Meta info */}
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {article.readTime}
                            </span>
                            <span className="text-gray-300 dark:text-gray-600">
                              |
                            </span>
                            <span>{article.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-500 dark:text-gray-300">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="text-xs">
                              <p className="font-medium text-gray-700 dark:text-gray-300">
                                {article.author}
                              </p>
                              <p className="text-gray-400 dark:text-gray-500">
                                {article.authorRole}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="rounded-xl px-8 h-12 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 gap-2"
                >
                  Load more articles
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="container mx-auto px-4 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-1">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative bg-white/10 backdrop-blur-sm rounded-[calc(1.5rem-4px)] px-8 py-12 md:py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Stay Ahead of the Game
            </h2>
            <p className="text-blue-100 text-sm md:text-base max-w-lg mx-auto mb-6">
              Get the latest cricket analytics articles and insights delivered
              to your inbox every week.
            </p>
            {/* <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="h-12 bg-white/20 border-white/30 text-white placeholder:text-blue-200 rounded-xl focus:ring-2 focus:ring-white/50"
              />
              <Button className="h-12 px-6 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-semibold shadow-lg whitespace-nowrap">
                Subscribe
              </Button>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
