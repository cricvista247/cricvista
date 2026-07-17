/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Calendar,
  MapPin,
  BarChart3,
  Clock,
  Zap,
  ArrowLeft,
  Users,
  Activity,
  Radio,
  Home,
  Info,
  Shield,
  Star,
} from "lucide-react";

import CustomLoader from "@/components/ui/CustomLoader";
import AIPredictionModal from "./ai-prediction-modal";
import toast from "react-hot-toast";
import CrexOverviewTab from "./CrexOverviewTab";
import PlayerCard from "./SquadDialoge";
import { DummyData } from "@/lib/DummyData";
import { FetchMatchDetails } from "@/app/MainService";

const MatchDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const { selectedMatch } = useSelector((state: RootState) => state.matches);
  const [matchData, setMatchData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setIsLoading(true);
    FetchMatchDetails({
      ...selectedMatch,
    })
      .then((res) => {
        setMatchData({
          ...res.data,
          // matchInfo: {
          //   ...selectedMatch,
          // },
        });
        setIsLoading(false);
      })
      .catch((err) => {
        // toast.error(err.message || "Failed to fetch match details.");
        router.push("/matches");
        setIsLoading(false);
      });
    // setMatchData({ ...DummyData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, selectedMatch, router]);

  const handleGetPrediction = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (!user || user.credits < 1) {
      router.push("/subscription");
      return;
    }
    setIsPredictionModalOpen(true);
  };

  // Get match status color
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "LIVE":
        return "bg-red-500 text-white animate-pulse";
      case "COMPLETED":
        return "bg-green-500 text-white";
      case "UPCOMING":
        return "bg-blue-500 text-white";
      case "ABANDONED":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (isLoading) {
    return <CustomLoader message="Loading match details..." />;
  }

  if (!matchData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No Match Data
          </h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const team1 = matchData.matchInfo.teams[0];
  const team2 = matchData.matchInfo.teams[1];
  const matchStatus = matchData.matchInfo.status;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex justify-center">
        <div className="container ">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="group hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Matches
            </Button>
          </div>

          {/* Main Match Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-200">
            {/* Tournament Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Trophy className="h-5 w-5 text-yellow-300" />
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {matchData.matchInfo.matchDescription}
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-1.5">
                      {matchData.matchInfo.format}
                    </Badge>
                    <Badge
                      className={`px-4 py-1.5 font-bold ${getStatusColor(
                        matchStatus,
                      )}`}
                    >
                      {matchStatus === "LIVE" && (
                        <Activity className="h-3 w-3 mr-1 animate-pulse" />
                      )}
                      {matchStatus}
                    </Badge>
                    <span className="text-white/90 text-sm">
                      {matchData.matchInfo.matchDescription}
                    </span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <Button
                    onClick={handleGetPrediction}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating AI Analysis...</span>
                      </div>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Get AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Match Details Content */}
            <div className="p-6 md:p-8">
              {/* Teams & Score Section - Mobile & Desktop */}
              <div className="mb-8">
                {/* Desktop Layout (3 columns) */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-8">
                  {/* Team 1 - Desktop */}
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-50 to-white">
                        <img
                          src={team1.teamFlagUrl}
                          alt={team1.teamName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {team1.teamName}
                    </h3>
                    <p className="text-gray-600 mb-4">{team1.teamShortName}</p>
                  </div>

                  {/* VS & Match Info - Desktop */}
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      <div className="text-5xl font-black text-gray-300">
                        VS
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-sm font-bold text-gray-600">
                          VS
                        </div>
                      </div>
                    </div>

                    {/* Match Status Badge */}
                    <div className="text-center space-y-3">
                      {matchData.matchInfo.score?.result && (
                        <Badge
                          variant="outline"
                          className="text-sm px-4 py-2 border-purple-200 bg-purple-50 text-purple-700"
                        >
                          <Radio className="h-3 w-3 mr-2" />
                          {matchData.matchInfo.score.result}
                        </Badge>
                      )}
                    </div>

                    {/* Match Info Icons */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">
                          {matchData.matchInfo.matchDate}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">
                          {matchData.matchInfo.startTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Team 2 - Desktop */}
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-red-50 to-white">
                        <img
                          src={team2.teamFlagUrl}
                          alt={team2.teamName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {team2.teamName}
                    </h3>
                    <p className="text-gray-600 mb-4">{team2.teamShortName}</p>
                  </div>
                </div>

                {/* Mobile Layout (Single Line) */}
                <div className="lg:hidden">
                  {/* Team 1 vs Team 2 Header */}
                  <div className="flex items-center justify-between mb-6">
                    {/* Team 1 */}
                    <div className="flex flex-col items-center text-center flex-1">
                      <div className="relative mb-2">
                        <div className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-white">
                          <img
                            src={team1.teamFlagUrl}
                            alt={team1.teamName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {team1.teamShortName}
                        </h4>
                        <p className="text-xs text-gray-600 truncate max-w-[80px]">
                          {team1.teamName}
                        </p>
                      </div>
                    </div>

                    {/* VS Separator */}
                    <div className="flex flex-col items-center mx-2">
                      <div className="text-xl font-bold text-gray-400 mb-1">
                        VS
                      </div>
                      {matchData.matchInfo.score?.result && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5 border-purple-200 bg-purple-50 text-purple-700"
                        >
                          {matchData.matchInfo.score.result}
                        </Badge>
                      )}
                    </div>

                    {/* Team 2 */}
                    <div className="flex flex-col items-center text-center flex-1">
                      <div className="relative mb-2">
                        <div className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden bg-gradient-to-br from-red-50 to-white">
                          <img
                            src={team2.teamFlagUrl}
                            alt={team2.teamName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {team2.teamShortName}
                        </h4>
                        <p className="text-xs text-gray-600 truncate max-w-[80px]">
                          {team2.teamName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Match Info for Mobile */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-medium text-gray-700">
                          {matchData.matchInfo.matchDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                      <Clock className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="text-sm font-medium text-gray-700">
                          {matchData.matchInfo.startTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Venue & Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium text-gray-900 text-sm md:text-base">
                        {matchData.venueDetails.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* AI Disclaimer */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              AI Confidence Score represents the model&apos;s statistical assessment and is not betting advice.
            </p>
          </div>

          {/* Main Content Tabs */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-4 md:p-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="overview"
                      className="text-xs md:text-sm"
                    >
                      <BarChart3 className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Overview</span>
                      <span className="sm:hidden">Stats</span>
                    </TabsTrigger>
                    <TabsTrigger value="squads" className=" text-xs md:text-sm">
                      <Users className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Squads</span>
                      <span className="sm:hidden">Teams</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="stadium"
                      className=" text-xs md:text-sm"
                    >
                      <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Stadium</span>
                      <span className="sm:hidden">Venue</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    {matchData ? (
                      <CrexOverviewTab matchData={matchData} />
                    ) : (
                      <div className="text-center py-8">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">
                          No Overview Data Available
                        </h3>
                        <p className="text-gray-500">
                          Detailed statistics and analysis will be available
                          soon.
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="squads" className="mt-6">
                    {matchData?.squads ? (
                      matchData.squads.map((squad: any) => (
                        <Card key={squad.teamName} className="mb-6">
                          <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4">
                            <CardTitle className="flex items-center space-x-3">
                              <div className="relative">
                                <img
                                  src={squad.flag}
                                  alt={squad.teamName}
                                  className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Star className="h-2 w-2 md:h-3 md:w-3 text-white" />
                                </div>
                              </div>
                              <div>
                                <span className="text-lg md:text-xl font-bold">
                                  {squad.teamName} Squad
                                </span>
                                <p className="text-xs md:text-sm text-gray-500">
                                  {squad.teamName}
                                </p>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 md:p-6">
                            <Tabs defaultValue="playing" className="w-full">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger
                                  value="playing"
                                  className="text-xs md:text-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    <Users className="h-3 w-3 md:h-4 md:w-4" />
                                    <span>
                                      Playing (
                                      {squad.playingPlayers?.length || 0})
                                    </span>
                                  </div>
                                </TabsTrigger>
                                <TabsTrigger
                                  value="bench"
                                  className="text-xs md:text-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    <Users className="h-3 w-3 md:h-4 md:w-4" />
                                    <span>
                                      Bench ({squad.benchPlayers?.length || 0})
                                    </span>
                                  </div>
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="playing" className="mt-4">
                                {squad.playingPlayers &&
                                squad.playingPlayers.length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-4">
                                    {squad.playingPlayers.map(
                                      (player: any, index: number) => (
                                        <PlayerCard
                                          key={index}
                                          player={player}
                                        />
                                      ),
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-center py-6">
                                    <Users className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">
                                      Playing XI not announced yet.
                                    </p>
                                  </div>
                                )}
                              </TabsContent>

                              <TabsContent value="bench" className="mt-4">
                                {squad.benchPlayers &&
                                squad.benchPlayers.length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                                    {squad.benchPlayers.map(
                                      (player: any, index: any) => (
                                        <PlayerCard
                                          key={index}
                                          player={player}
                                        />
                                      ),
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-center py-6">
                                    <Users className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">
                                      No bench players announced yet.
                                    </p>
                                  </div>
                                )}
                              </TabsContent>
                            </Tabs>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">
                          Squad Information Not Available
                        </h3>
                        <p className="text-gray-500">
                          Team squads will be updated closer to the match.
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="stadium" className="mt-6">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-green-600" />
                          <span className="text-lg md:text-xl">
                            Stadium Analysis:{" "}
                            <span className="text-blue-600">
                              {matchData.venueDetails.name}
                            </span>
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6">
                        {matchData?.venueDetails.recentMatches ? (
                          <div className="space-y-6">
                            <h3 className="font-semibold text-lg">
                              Recent Matches at this Venue
                            </h3>
                            <div className="space-y-3">
                              {matchData.venueDetails.recentMatches
                                .slice(0, 10)
                                .map((match: any, index: number) => (
                                  <div
                                    key={index}
                                    className="p-3 md:p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm md:text-base">
                                          {match.series}
                                        </p>
                                        <p className="text-xs md:text-sm text-gray-600">
                                          {match.result}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                                      <div className="p-2 bg-blue-50 rounded">
                                        <div className="font-medium text-blue-700 text-xs md:text-sm">
                                          {match.team1}
                                        </div>
                                        <div className="text-gray-700 text-sm md:text-base">
                                          {match.team1Score} ({match.team1Overs}
                                          )
                                        </div>
                                      </div>
                                      <div className="p-2 bg-red-50 rounded">
                                        <div className="font-medium text-red-700 text-xs md:text-sm">
                                          {match.team2}
                                        </div>
                                        <div className="text-gray-700 text-sm md:text-base">
                                          {match.team2Score} ({match.team2Overs}
                                          )
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700">
                              Stadium Stats Not Available
                            </h3>
                            <p className="text-gray-500">
                              Detailed stadium statistics will be updated soon.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Prediction Modal */}
      <AIPredictionModal
        isOpen={isPredictionModalOpen}
        onClose={() => setIsPredictionModalOpen(false)}
        match={{
          ...matchData,
          matchInfo: selectedMatch,
          crexOverallStats: matchData.crexOverallStats,
        }}
      />
    </>
  );
};

export default MatchDetailsPage;
