"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setSelectedMatch } from "@/store/slices/matchSlice";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Updated import
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Trophy, RotateCcw, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/ui/CustomLoader";
import { DatePicker } from "@/components/ui/date-picker";
import { useQuery } from "@tanstack/react-query";
import MatchCard from "./MatchCard";
import { FetchMatchList, FetchPlatformPerformance } from "../MainService";
import toast from "react-hot-toast";
import AdBanner from "@/components/AdBanner";

// Enhanced Tab configuration
const TAB_CONFIG = [
  {
    id: "upcoming",
    label: "Upcoming",
    icon: Calendar,
    statusFilter: (match: any) => match.status === "UPCOMING",
    emptyState: {
      title: "No upcoming matches",
      subtitle: "Try changing the filters",
      icon: <Calendar className="h-12 w-12 text-gray-400" />,
    },
    colorScheme: {
      active: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
      inactive: "text-gray-600 hover:bg-blue-50",
      count: "bg-blue-100 text-blue-700",
    },
  },
  {
    id: "live",
    label: "Live",
    icon: Flame,
    statusFilter: (match: any) => match.status === "LIVE",
    emptyState: {
      title: "No live matches",
      subtitle: "Check again soon!",
      icon: (
        <div className="relative">
          <Flame className="h-12 w-12 text-red-400" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
        </div>
      ),
    },
    colorScheme: {
      active: "bg-gradient-to-r from-red-500 to-orange-600 text-white",
      inactive: "text-gray-600 hover:bg-red-50",
      count: "bg-red-100 text-red-700",
    },
  },
  {
    id: "completed",
    label: "Completed",
    icon: Trophy,
    statusFilter: (match: any) =>
      match.status === "COMPLETED" || match.status === "ABANDONED",
    emptyState: {
      title: "No completed matches",
      subtitle: "Try searching something else",
      icon: <Trophy className="h-12 w-12 text-green-400" />,
    },
    colorScheme: {
      active: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
      inactive: "text-gray-600 hover:bg-green-50",
      count: "bg-green-100 text-green-700",
    },
  },
];

const MatchesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [performanceStats, setPerformanceStats] = useState<{
    pass: number;
    fail: number;
    total: number;
  } | null>(null);

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["match-list", selectedDate],
    queryFn: async () => {
      const response = await FetchMatchList(selectedDate);

      return response.data;
    },
    enabled: !!selectedDate,
  });

  // useEffect(() => {
  //   getPerformanceStats();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedDate]);

  const getPerformanceStats = () => {
    FetchPlatformPerformance(selectedDate)
      .then((response) => {
        setPerformanceStats(response.data || { pass: 0, fail: 0, total: 0 });
      })
      .catch((error) => {
        toast.error("Failed to fetch performance stats");
        console.error("Error fetching performance stats:", error);
      });
  };

  // Calculate match counts
  const matchCounts = useMemo(() => {
    return TAB_CONFIG.reduce(
      (acc, tab) => {
        acc[tab.id] = matches.filter(tab.statusFilter).length;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [matches]);

  // Handle match click
  const handleMatchClick = (match: any) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    router.push(`/matches/${match._id}`);
    dispatch(setSelectedMatch(match));
  };

  // Filter matches
  const filteredMatches = useMemo(() => {
    const activeTabConfig = TAB_CONFIG.find((tab) => tab.id === activeTab);

    return matches.filter((match: any) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        match.teams.some(
          (team: any) =>
            team.teamName.toLowerCase().includes(searchLower) ||
            team.teamShortName.toLowerCase().includes(searchLower),
        ) ||
        match.matchDescription?.toLowerCase().includes(searchLower) ||
        match.matchName?.toLowerCase().includes(searchLower);

      const matchesStatus = activeTabConfig?.statusFilter(match);
      return matchesSearch && matchesStatus;
    });
  }, [matches, activeTab, searchTerm]);

  // Empty state component
  const EmptyState = ({ icon, title, subtitle }: any) => (
    <div className="text-center py-12 md:py-20 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 text-sm md:text-base">{subtitle}</p>
    </div>
  );

  // Render tab content — injects an ad unit after every 6th match card
  const renderTabContent = (tabId: string) => {
    if (filteredMatches.length === 0) {
      const tabConfig = TAB_CONFIG.find((tab) => tab.id === tabId);
      return <EmptyState {...tabConfig?.emptyState} />;
    }

    const AD_INTERVAL = 6; // show ad after every N cards
    const items: React.ReactNode[] = [];

    filteredMatches.forEach((match: any, index: number) => {
      items.push(
        <MatchCard
          key={match._id}
          match={match}
          showPredictButton={tabId === "upcoming" || tabId === "live"}
          onClick={() => handleMatchClick(match)}
        />
      );

      // Insert a full-width ad banner after every AD_INTERVAL cards
      if ((index + 1) % AD_INTERVAL === 0 && index < filteredMatches.length - 1) {
        items.push(
          <div
            key={`ad-${index}`}
            className="col-span-1 md:col-span-2 lg:col-span-3"
          >
            <AdBanner
              adSlot="2957912516"
              adFormat="horizontal"
              className="my-2"
            />
          </div>
        );
      }
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items}
      </div>
    );
  };

  if (isLoading) {
    return <CustomLoader message="Loading match list" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-10">
        {/* Header */}
        <div className="mb-6 md:mb-10 text-center px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Cricket Matches
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 md:mt-2">
            AI-powered analysis & live match insights
          </p>
        </div>

        {/* Platform Performance Banner */}
        {/* {performanceStats && performanceStats.total > 0 && (
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg border border-indigo-200 mb-6 md:mb-10 p-1 overflow-hidden relative group transition-transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform">
              <Trophy className="w-24 h-24 text-white" />
            </div>
            <div className="bg-white/95 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between relative z-10">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-2.5 rounded-full shadow-inner border border-indigo-50">
                  <Flame className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Platform Accuracy
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Over the last {performanceStats.total} matches
                  </p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <div className="flex flex-col items-center px-5 py-2.5 bg-gradient-to-b from-green-50 to-white rounded-lg border border-green-200 shadow-sm">
                  <span className="text-2xl sm:text-3xl font-black text-green-600">
                    {performanceStats.pass}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase text-green-700 tracking-wider">
                    Pass
                  </span>
                </div>
                <div className="flex flex-col items-center px-5 py-2.5 bg-gradient-to-b from-red-50 to-white rounded-lg border border-red-200 shadow-sm">
                  <span className="text-2xl sm:text-3xl font-black text-red-600">
                    {performanceStats.fail}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase text-red-700 tracking-wider">
                    Fail
                  </span>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Search + Date Filter */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                placeholder="Search teams, tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-11 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <DatePicker
                date={selectedDate}
                onDateChange={setSelectedDate}
                placeholder="Select date"
                className="h-10 sm:h-12"
              />

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl border-gray-300 hover:bg-gray-50"
                onClick={() => setSelectedDate(new Date())}
              >
                <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* AdSense — Leaderboard between filters and match list */}
        <AdBanner
          adSlot="2957912516"
          adFormat="horizontal"
          className="mb-6 md:mb-8"
        />

        {/* Enhanced Tabs using the new component */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            cols={3}
            scrollable
            className="bg-gray-50 rounded-xl shadow-sm p-1 grid w-full grid-cols-3"
          >
            {TAB_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const count = matchCounts[tab.id] || 0;

              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  variant="pill"
                  // size="lg"
                  className="px-3 text-xs md:text-sm gap-1"
                >
                  {/* <Icon className="h-4 w-4 flex-shrink-0" /> */}
                  <span className="truncate">{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${tab.colorScheme.count} font-semibold`}
                  >
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Contents */}
          {TAB_CONFIG.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-4 sm:mt-6">
              {renderTabContent(tab.id)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default MatchesPage;
