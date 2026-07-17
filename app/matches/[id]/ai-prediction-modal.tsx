/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  Trophy,
  Users,
  Star,
  Zap,
  BarChart3,
  Sparkles,
  Brain,
  Shield,
  Target,
  Wifi,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  Cloud,
  CloudRain,
  Sun,
  Droplets,
  BarChart4,
  Thermometer,
  Users2,
  TargetIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { updateCredits } from "@/store/slices/authSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserOrderCredit } from "@/app/MainService";
import { Prediction } from "@/app/api/order/Prediction";

// Interfaces based on the actual JSON structure
interface Player {
  name: string;
  shortName: string;
  role: string;
  isWK: boolean;
  image: string;
  style: string;
  impactRun: number;
  impactWicket: number;
  impactRunConced: number;
  impactScore: number;
}

interface TeamPrediction {
  name: string;
  shortName: string;
  flag: string;
  firstInnings: {
    min: number;
    max: number;
    predicted: number;
    wickets: number;
  };
  winnerPrediction: {
    probability: number;
    confidence: string;
    hint: {
      hintMessage: string;
      badgeColor: string;
      color: string;
    };
  };
  topBatsman: Player;
  topBowler: Player;
  keyPlayers: Player[];
}

interface Dream11Player extends Player {
  team: string;
  isCaptain: boolean;
  isViceCaptain: boolean;
}

interface RecentMatch {
  team1: string;
  team1Score: string;
  team1Overs: string;
  team2: string;
  team2Score: string;
  team2Overs: string;
  result: string;
  series: string;
  url: string;
}

interface VenueRecord {
  vs: string;
  score: string;
}

interface PredictionData {
  team1: TeamPrediction;
  team2: TeamPrediction;
  dream11Team: Dream11Player[];
  venueStats: {
    matches: string;
    winBatFirst: string;
    winBowlFirst: string;
    avg1stInns: string;
    avg2ndInns: string;
  };
  venueWeather: {
    temperature: string;
    condition: string;
    humidity: string;
    rainChance: string;
  };
  recentMatchOnVenue?: RecentMatch[];
}

const AIPredictionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  match: any;
}> = ({ isOpen, onClose, match }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const { selectedMatch } = useSelector((state: RootState) => state.matches);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(
    null,
  );

  const handleGetPrediction = async () => {
    try {
      setIsLoading(true);

      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      if (!user || user.credits < 1) {
        toast.error("Insufficient credits. Please purchase more credits.");
        return;
      }

      if (!selectedMatch?._id) {
        toast.error("Match not selected");
        return;
      }

      const payload = {
        ordertype: "prediction",
        userId: user.id,
        credits: 1,
        status: "completed",
        paymentStatus: true,
        paymentMode: "DEDUCTION",
        paymentDate: new Date(),
        matchId: selectedMatch._id,
      };

      const res = await UserOrderCredit(payload);
      dispatch(updateCredits(user.credits - (res?.credits ?? 1)));

      await new Promise((r) => setTimeout(r, 300));

      // const data: any = await GetNewAnalysis(match);
      const data: any = await Prediction(match);

      console.log("Prediction Data:", data);
      setPredictionData(data);
      toast.success("AI Analysis generated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    if (!role) return <Users className="h-4 w-4" />;
    if (role.includes("Batter") || role.includes("Batsman")) {
      return <TargetIcon className="h-4 w-4" />;
    } else if (role.includes("Bowler")) {
      return <Zap className="h-4 w-4" />;
    } else if (role.includes("All Rounder")) {
      return <Star className="h-4 w-4" />;
    } else {
      return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    if (!role) return "bg-gray-100 text-gray-800 border-gray-300";
    if (role.includes("Batter") || role.includes("Batsman")) {
      return "bg-blue-100 text-blue-800";
    } else if (role.includes("Bowler")) {
      return "bg-red-100 text-red-800";
    } else if (role.includes("All Rounder")) {
      return "bg-purple-100 text-purple-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidenceClass = (confidence: string) => {
    if (!confidence) return "bg-gray-100 text-gray-800 border-gray-300";
    switch (confidence) {
      case "High":
        return "bg-green-100 text-green-800 border-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Low":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    if (!confidence) return <Wifi className="h-4 w-4 text-gray-600" />;
    switch (confidence) {
      case "High":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Medium":
        return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case "Low":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTeamColor = (teamNumber: number) => {
    return teamNumber === 1
      ? "from-blue-600 to-indigo-600"
      : "from-purple-600 to-pink-600";
  };

  const getTeamBgColor = (teamNumber: number) => {
    return teamNumber === 1
      ? "from-blue-50 to-indigo-50"
      : "from-purple-50 to-pink-50";
  };

  const getTeamBorderColor = (teamNumber: number) => {
    return teamNumber === 1 ? "border-blue-200" : "border-purple-200";
  };

  const getTeamTextColor = (teamNumber: number) => {
    return teamNumber === 1 ? "text-blue-600" : "text-purple-600";
  };

  const getWeatherIcon = (condition: string) => {
    if (!condition) return <Cloud className="h-5 w-5 text-blue-500" />;
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("rain") || lowerCondition.includes("thunder"))
      return <CloudRain className="h-5 w-5 text-blue-500" />;
    if (
      lowerCondition.includes("sun") ||
      lowerCondition.includes("clear") ||
      lowerCondition.includes("sunny")
    )
      return <Sun className="h-5 w-5 text-yellow-500" />;
    if (lowerCondition.includes("cloud"))
      return <Cloud className="h-5 w-5 text-gray-500" />;
    return <Cloud className="h-5 w-5 text-blue-500" />;
  };

  const formatNumber = (num: number | undefined, decimals: number = 0) => {
    if (num === undefined || num === null) return "0";
    return num.toFixed(decimals);
  };

  const checkSquad =
    match?.squadList?.[0]?.benchPlayer?.length === 0 &&
    match?.squadList?.[0]?.playingPlayer?.length === 0 &&
    match?.squadList?.[1]?.benchPlayer?.length === 0 &&
    match?.squadList?.[1]?.playingPlayer?.length === 0;

  if (!predictionData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="w-full h-full p-4 md:mx-auto md:my-6 md:w-[95%] md:max-w-2xl md:h-auto bg-white md:rounded-2xl md:shadow-xl overflow-hidden flex flex-col"
          aria-label="AI Match Analysis Modal"
        >
          <DialogHeader className="sticky top-0 z-20 bg-white border-b px-2 py-3 md:px-6 md:py-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center space-x-2 text-base md:text-xl">
                <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Brain className="h-4 w-4 md:h-6 md:w-6 text-white" />
                </div>
                <span>AI Match Analysis</span>
              </DialogTitle>
              <DialogClose className="ml-3 inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100">
                <span className="sr-only">Close</span>
                <X className="h-5 w-5 text-gray-600" />
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto -mx-4 md:mx-0 px-4 md:px-6 py-4 md:py-6">
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-red-800 mb-2">
                    ⚖️ LEGAL DISCLAIMER
                  </h3>
                  <p className="text-xs text-orange-700">
                    AI Confidence Score represents the model&apos;s statistical assessment and is not betting advice. CricVista provides AI-powered cricket analytics for informational and entertainment purposes only.
                  </p>
                </div>
              </div>
            </div>

            {checkSquad ? (
              <div className="text-center py-6 md:py-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Brain className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  Team Squads Not Available Yet
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-md mx-auto px-4">
                  ⏳ Both team squads haven't been announced yet. Please check
                  back later when the teams are finalized to get accurate AI
                  insights.
                </p>
              </div>
            ) : (
              <div className="text-center py-6 md:py-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Brain className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  Get AI-Powered Match Analysis
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-md mx-auto px-4">
                  Our advanced AI analyzes 50+ factors including player form,
                  pitch conditions, weather, and historical data to provide
                  accurate analysis.
                </p>
                <Button
                  onClick={handleGetPrediction}
                  disabled={isLoading}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 text-white rounded-md"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing Match...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get AI Analysis (1 Credit)
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-full h-full p-0 md:mx-auto md:my-6 md:w-[95%] md:max-w-7xl md:h-auto bg-white md:rounded-2xl md:shadow-xl overflow-hidden flex flex-col"
        aria-label="AI Match Analysis Modal"
      >
        <DialogHeader className="sticky top-0 z-20 bg-white border-b px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center">
                <Brain className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-base md:text-xl lg:text-2xl font-semibold">
                  AI Match Analysis
                </DialogTitle>
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={predictionData.team1?.flag}
                      alt={predictionData.team1?.shortName || "Team 1"}
                      className="w-5 h-5 md:w-6 md:h-6 rounded object-cover"
                    />
                    <span className="font-medium truncate max-w-[90px] md:max-w-[140px]">
                      {predictionData.team1?.shortName || "Team 1"}
                    </span>
                  </div>
                  <span className="text-gray-300">vs</span>
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={predictionData.team2?.flag}
                      alt={predictionData.team2?.shortName || "Team 2"}
                      className="w-5 h-5 md:w-6 md:h-6 rounded object-cover"
                    />
                    <span className="font-medium truncate max-w-[90px] md:max-w-[140px]">
                      {predictionData.team2?.shortName || "Team 2"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <DialogClose className="ml-3 inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100">
              <span className="sr-only">Close</span>
              <X className="h-5 w-5 text-gray-600" />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-red-800 mb-2">
                  ⚖️ IMPORTANT LEGAL NOTICE
                </h3>
                  <p className="text-xs text-orange-700">
                    AI Confidence Score represents the model&apos;s statistical assessment and is not betting advice. CricVista provides AI-powered cricket analytics for informational and entertainment purposes only.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Winner Prediction Card */}
            <Card className="border-0 shadow-sm md:shadow-md">
              <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                  <Trophy className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                  <span>AI Match Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                  {/* Team 1 */}
                  <div
                    className={`p-4 md:p-6 rounded-xl border ${getTeamBorderColor(1)} bg-gradient-to-br ${getTeamBgColor(1)} text-center`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-start md:space-x-4">
                      <img
                        src={predictionData.team1?.flag}
                        alt={predictionData.team1?.shortName}
                        className="w-9 h-9 md:w-12 md:h-12 rounded-lg shadow-sm mx-auto md:mx-0 object-cover"
                      />
                      <div className="mt-2 md:mt-0">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                          {predictionData.team1?.shortName}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 truncate max-w-[180px]">
                          {predictionData.team1?.name}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`mt-4 text-2xl md:text-3xl font-extrabold ${getTeamTextColor(1)}`}
                    >
                      {predictionData.team1?.winnerPrediction?.probability?.toFixed(
                        2,
                      )}
                      %
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 mt-3">
                      <div
                        className={`h-2 md:h-3 rounded-full bg-gradient-to-r ${getTeamColor(1)} transition-all duration-500`}
                        style={{
                          width: `${predictionData.team1?.winnerPrediction?.probability || 0}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-center">
                      <Badge
                        variant="outline"
                        className={`${getConfidenceClass(predictionData.team1?.winnerPrediction?.confidence || "")} text-xs md:text-sm px-2 py-0.5 md:px-3 md:py-1 flex items-center space-x-2`}
                      >
                        {getConfidenceIcon(
                          predictionData.team1?.winnerPrediction?.confidence ||
                            "",
                        )}
                        <span>
                          {predictionData.team1?.winnerPrediction?.confidence ||
                            "Unknown"}
                        </span>
                      </Badge>
                    </div>

                    <div
                      className={`mt-3 md:mt-4 text-xs md:text-sm p-2 md:p-3 rounded-lg border ${predictionData.team1?.winnerPrediction?.hint?.color || "border-gray-200"}`}
                    >
                      {predictionData.team1?.winnerPrediction?.hint
                        ?.hintMessage || "No prediction hint available"}
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div
                    className={`p-4 md:p-6 rounded-xl border ${getTeamBorderColor(2)} bg-gradient-to-br ${getTeamBgColor(2)} text-center`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-start md:space-x-4">
                      <img
                        src={predictionData.team2?.flag}
                        alt={predictionData.team2?.shortName}
                        className="w-9 h-9 md:w-12 md:h-12 rounded-lg shadow-sm mx-auto md:mx-0 object-cover"
                      />
                      <div className="mt-2 md:mt-0">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                          {predictionData.team2?.shortName}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 truncate max-w-[180px]">
                          {predictionData.team2?.name}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`mt-4 text-2xl md:text-3xl font-extrabold ${getTeamTextColor(2)}`}
                    >
                      {predictionData.team2?.winnerPrediction?.probability?.toFixed(
                        2,
                      )}
                      %
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 mt-3">
                      <div
                        className={`h-2 md:h-3 rounded-full bg-gradient-to-r ${getTeamColor(2)} transition-all duration-500`}
                        style={{
                          width: `${predictionData.team2?.winnerPrediction?.probability || 0}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-center">
                      <Badge
                        variant="outline"
                        className={`${getConfidenceClass(predictionData.team2?.winnerPrediction?.confidence || "")} text-xs md:text-sm px-2 py-0.5 md:px-3 md:py-1 flex items-center space-x-2`}
                      >
                        {getConfidenceIcon(
                          predictionData.team2?.winnerPrediction?.confidence ||
                            "",
                        )}
                        <span>
                          {predictionData.team2?.winnerPrediction?.confidence ||
                            "Unknown"}
                        </span>
                      </Badge>
                    </div>

                    <div
                      className={`mt-3 md:mt-4 text-xs md:text-sm p-2 md:p-3 rounded-lg border ${predictionData.team2?.winnerPrediction?.hint?.color || "border-gray-200"}`}
                    >
                      {predictionData.team2?.winnerPrediction?.hint
                        ?.hintMessage || "No prediction hint available"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* First Innings Score Prediction */}
            <Card className="border-0 shadow-sm md:shadow-md">
              <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                  <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  <span>First Innings Score Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                  {/* Team 1 */}
                  <div
                    className={`p-4 md:p-6 rounded-xl border ${getTeamBorderColor(1)} bg-gradient-to-br ${getTeamBgColor(1)} text-center`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={predictionData.team1?.flag}
                          alt={predictionData.team1?.shortName}
                          className="w-8 h-8 md:w-10 md:h-10 rounded object-cover"
                        />
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          {predictionData.team1?.shortName}
                        </h3>
                      </div>

                      <div
                        className={`text-2xl md:text-3xl font-bold ${getTeamTextColor(1)} mb-3`}
                      >
                        {predictionData.team1?.firstInnings?.predicted || 0}
                      </div>

                      <div className="text-xs md:text-sm text-gray-600 bg-white py-2 px-3 md:px-4 rounded-lg border mb-2 w-full">
                        Range:{" "}
                        <span className="font-semibold">
                          {predictionData.team1?.firstInnings?.min || 0} -{" "}
                          {predictionData.team1?.firstInnings?.max || 0}
                        </span>
                      </div>

                      <div className="text-xs md:text-sm text-gray-600 bg-white py-2 px-3 md:px-4 rounded-lg border w-full">
                        Forecast Wickets:{" "}
                        <span className="font-semibold text-red-600">
                          {predictionData.team1?.firstInnings?.wickets || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div
                    className={`p-4 md:p-6 rounded-xl border ${getTeamBorderColor(2)} bg-gradient-to-br ${getTeamBgColor(2)} text-center`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={predictionData.team2?.flag}
                          alt={predictionData.team2?.shortName}
                          className="w-8 h-8 md:w-10 md:h-10 rounded object-cover"
                        />
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          {predictionData.team2?.shortName}
                        </h3>
                      </div>

                      <div
                        className={`text-2xl md:text-3xl font-bold ${getTeamTextColor(2)} mb-3`}
                      >
                        {predictionData.team2?.firstInnings?.predicted || 0}
                      </div>

                      <div className="text-xs md:text-sm text-gray-600 bg-white py-2 px-3 md:px-4 rounded-lg border mb-2 w-full">
                        Range:{" "}
                        <span className="font-semibold">
                          {predictionData.team2?.firstInnings?.min || 0} -{" "}
                          {predictionData.team2?.firstInnings?.max || 0}
                        </span>
                      </div>

                      <div className="text-xs md:text-sm text-gray-600 bg-white py-2 px-3 md:px-4 rounded-lg border w-full">
                        Forecast Wickets:{" "}
                        <span className="font-semibold text-red-600">
                          {predictionData.team2?.firstInnings?.wickets || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Top Batsmen */}
              <Card className="border-0 shadow-sm md:shadow-md">
                <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                  <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                    <Target className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                    <span>Top Batsmen Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                  <div className="space-y-4 md:space-y-6">
                    {/* Team 1 Batsman */}
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border ${getTeamBorderColor(1)} bg-gradient-to-r ${getTeamBgColor(1)}`}
                    >
                      <img
                        src={
                          predictionData.team1?.topBatsman?.image ||
                          "/placeholder-player.png"
                        }
                        alt={predictionData.team1?.topBatsman?.name}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-lg shadow-sm object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                          <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">
                              {predictionData.team1?.topBatsman?.name ||
                                "Unknown"}
                            </h3>
                          </div>
                          <Badge
                            className={`${getRoleColor(predictionData.team1?.topBatsman?.role || "")} text-xs md:text-sm whitespace-nowrap`}
                          >
                            {getRoleIcon(
                              predictionData.team1?.topBatsman?.role || "",
                            )}
                            <span className="ml-1 truncate">
                              {predictionData.team1?.topBatsman?.role ||
                                "Player"}
                            </span>
                          </Badge>
                        </div>

                        <div className="text-xs md:text-sm text-gray-600 mb-3">
                          {predictionData.team1?.name}
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-white rounded-lg border">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Impact Runs
                            </div>
                            <div className="text-sm font-bold text-green-600">
                              {formatNumber(
                                predictionData.team1?.topBatsman?.impactRun,
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Impact Score
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              {formatNumber(
                                predictionData.team1?.topBatsman?.impactScore,
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Style</div>
                            <div className="text-xs font-bold text-purple-600 truncate">
                              {predictionData.team1?.topBatsman?.style?.split(
                                " ",
                              )[0] || "RHB"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Team 2 Batsman */}
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border ${getTeamBorderColor(2)} bg-gradient-to-r ${getTeamBgColor(2)}`}
                    >
                      <img
                        src={
                          predictionData.team2?.topBatsman?.image ||
                          "/placeholder-player.png"
                        }
                        alt={predictionData.team2?.topBatsman?.name}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-lg shadow-sm object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                          <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">
                              {predictionData.team2?.topBatsman?.name ||
                                "Unknown"}
                            </h3>
                          </div>
                          <Badge
                            className={`${getRoleColor(predictionData.team2?.topBatsman?.role || "")} text-xs md:text-sm whitespace-nowrap`}
                          >
                            {getRoleIcon(
                              predictionData.team2?.topBatsman?.role || "",
                            )}
                            <span className="ml-1 truncate">
                              {predictionData.team2?.topBatsman?.role ||
                                "Player"}
                            </span>
                          </Badge>
                        </div>

                        <div className="text-xs md:text-sm text-gray-600 mb-3">
                          {predictionData.team2?.name}
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-white rounded-lg border">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Impact Runs
                            </div>
                            <div className="text-sm font-bold text-green-600">
                              {formatNumber(
                                predictionData.team2?.topBatsman?.impactRun,
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Impact Score
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              {formatNumber(
                                predictionData.team2?.topBatsman?.impactScore,
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Style</div>
                            <div className="text-xs font-bold text-purple-600 truncate">
                              {predictionData.team2?.topBatsman?.style?.split(
                                " ",
                              )[0] || "RHB"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Bowlers */}
              <Card className="border-0 shadow-sm md:shadow-md">
                <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                  <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                    <Zap className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    <span>Top Bowlers Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                  <div className="space-y-4 md:space-y-6">
                    {/* Team 1 Bowler */}
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border ${getTeamBorderColor(1)} bg-gradient-to-r ${getTeamBgColor(1)}`}
                    >
                      <img
                        src={
                          predictionData.team1?.topBowler?.image ||
                          "/placeholder-player.png"
                        }
                        alt={predictionData.team1?.topBowler?.name}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-lg shadow-sm object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                          <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">
                              {predictionData.team1?.topBowler?.name ||
                                "Unknown"}
                            </h3>
                          </div>
                          <Badge
                            className={`${getRoleColor(predictionData.team1?.topBowler?.role || "")} text-xs md:text-sm whitespace-nowrap`}
                          >
                            {getRoleIcon(
                              predictionData.team1?.topBowler?.role || "",
                            )}
                            <span className="ml-1 truncate">
                              {predictionData.team1?.topBowler?.role ||
                                "Player"}
                            </span>
                          </Badge>
                        </div>

                        <div className="text-xs md:text-sm text-gray-600 mb-3">
                          {predictionData.team1?.name}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-white rounded-lg border">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Impact Wickets
                            </div>
                            <div className="text-sm font-bold text-purple-600">
                              {formatNumber(
                                predictionData.team1?.topBowler?.impactWicket,
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Impact Score
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              {formatNumber(
                                predictionData.team1?.topBowler?.impactScore,
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Team 2 Bowler */}
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border ${getTeamBorderColor(2)} bg-gradient-to-r ${getTeamBgColor(2)}`}
                    >
                      <img
                        src={
                          predictionData.team2?.topBowler?.image ||
                          "/placeholder-player.png"
                        }
                        alt={predictionData.team2?.topBowler?.name}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-lg shadow-sm object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                          <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">
                              {predictionData.team2?.topBowler?.name ||
                                "Unknown"}
                            </h3>
                          </div>
                          <Badge
                            className={`${getRoleColor(predictionData.team2?.topBowler?.role || "")} text-xs md:text-sm whitespace-nowrap`}
                          >
                            {getRoleIcon(
                              predictionData.team2?.topBowler?.role || "",
                            )}
                            <span className="ml-1 truncate">
                              {predictionData.team2?.topBowler?.role ||
                                "Player"}
                            </span>
                          </Badge>
                        </div>

                        <div className="text-xs md:text-sm text-gray-600 mb-3">
                          {predictionData.team2?.name}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-white rounded-lg border">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Impact Wickets
                            </div>
                            <div className="text-sm font-bold text-purple-600">
                              {formatNumber(
                                predictionData.team2?.topBowler?.impactWicket,
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              Impact Score
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              {formatNumber(
                                predictionData.team2?.topBowler?.impactScore,
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dream11 Team Section */}
            {predictionData.dream11Team &&
              predictionData.dream11Team.length > 0 && (
                <Card className="border-0 shadow-sm md:shadow-md">
                  <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                    <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                      <Users2 className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                      <span>Dream11 Team Suggestion</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {predictionData.dream11Team.map((player, index) => (
                        <div
                          key={index}
                          className={`relative p-3 rounded-lg border ${
                            player.team === "SL"
                              ? "border-blue-200 bg-blue-50/50"
                              : "border-purple-200 bg-purple-50/50"
                          } hover:shadow-md transition-shadow`}
                        >
                          {player.isCaptain && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                              C
                            </div>
                          )}
                          {player.isViceCaptain && !player.isCaptain && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                              VC
                            </div>
                          )}

                          <div className="flex flex-col items-center">
                            <img
                              src={player.image || "/placeholder-player.png"}
                              alt={player.name}
                              className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-white shadow-sm"
                            />

                            <h4 className="text-sm font-semibold text-center truncate w-full">
                              {player.shortName}
                            </h4>

                            <Badge
                              className={`${getRoleColor(player.role)} text-[10px] px-2 py-0.5 mt-1`}
                            >
                              {player.role}
                            </Badge>

                            <Badge
                              variant="outline"
                              className="text-[10px] mt-1 bg-white"
                            >
                              {player.team}
                            </Badge>
                          </div>

                          {/* Impact Stats */}
                          <div className="mt-3 pt-2 border-t border-gray-200">
                            <div className="grid grid-cols-3 gap-1 text-center">
                              <div>
                                <div className="text-[8px] text-gray-500">
                                  Runs
                                </div>
                                <div className="text-xs font-semibold text-green-600">
                                  {formatNumber(player.impactRun)}
                                </div>
                              </div>
                              <div>
                                <div className="text-[8px] text-gray-500">
                                  Wkts
                                </div>
                                <div className="text-xs font-semibold text-blue-600">
                                  {formatNumber(player.impactWicket)}
                                </div>
                              </div>
                              <div>
                                <div className="text-[8px] text-gray-500">
                                  Pts
                                </div>
                                <div className="text-xs font-semibold text-purple-600">
                                  {formatNumber(player.impactScore)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Key Players Section */}
            <Card className="border-0 shadow-sm md:shadow-md">
              <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                  <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                  <span>Key Players</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Team 1 Key Players */}
                  <div>
                    <h3 className="text-sm font-semibold text-blue-600 mb-3 flex items-center gap-2 pb-2 border-b border-blue-200">
                      <img
                        src={predictionData.team1?.flag}
                        alt=""
                        className="w-5 h-5 rounded"
                      />
                      {predictionData.team1?.name} - Key Players
                    </h3>
                    <div className="space-y-2">
                      {predictionData.team1?.keyPlayers?.map((player, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-sm transition-shadow"
                        >
                          <img
                            src={player.image || "/placeholder-player.png"}
                            alt={player.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="truncate">
                                <span className="text-sm font-medium text-gray-900">
                                  {player.shortName}
                                </span>
                                <p className="text-xs text-gray-500 truncate">
                                  {player.style}
                                </p>
                              </div>
                              <Badge
                                className={`${getRoleColor(player.role)} text-[10px] whitespace-nowrap`}
                              >
                                {player.role}
                              </Badge>
                            </div>

                            {/* Impact Stats Grid */}
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              <div className="bg-white/80 rounded px-2 py-1 text-center">
                                <div className="text-[8px] text-gray-500">
                                  Impact Runs
                                </div>
                                <div className="text-xs font-bold text-green-600">
                                  {formatNumber(player.impactRun)}
                                </div>
                              </div>
                              <div className="bg-white/80 rounded px-2 py-1 text-center">
                                <div className="text-[8px] text-gray-500">
                                  Impact Wkts
                                </div>
                                <div className="text-xs font-bold text-blue-600">
                                  {formatNumber(player.impactWicket)}
                                </div>
                              </div>
                              <div className="bg-white/80 rounded px-2 py-1 text-center">
                                <div className="text-[8px] text-gray-500">
                                  Impact Pts
                                </div>
                                <div className="text-xs font-bold text-purple-600">
                                  {formatNumber(player.impactScore)}
                                </div>
                              </div>
                            </div>

                            {/* Bowling Concession (if applicable) */}
                            {player.impactRunConced > 0 && (
                              <div className="mt-1 text-[8px] text-gray-400 text-right">
                                Runs conceded:{" "}
                                {formatNumber(player.impactRunConced)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team 2 Key Players */}
                  <div>
                    <h3 className="text-sm font-semibold text-purple-600 mb-3 flex items-center gap-2 pb-2 border-b border-purple-200">
                      <img
                        src={predictionData.team2?.flag}
                        alt=""
                        className="w-5 h-5 rounded"
                      />
                      {predictionData.team2?.name} - Key Players
                    </h3>
                    <div className="space-y-2">
                      {predictionData.team2?.keyPlayers?.map((player, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-100 hover:shadow-sm transition-shadow"
                        >
                          <img
                            src={player.image || "/placeholder-player.png"}
                            alt={player.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="truncate">
                                <span className="text-sm font-medium text-gray-900">
                                  {player.shortName}
                                </span>
                                <p className="text-xs text-gray-500 truncate">
                                  {player.style}
                                </p>
                              </div>
                              <Badge
                                className={`${getRoleColor(player.role)} text-[10px] whitespace-nowrap`}
                              >
                                {player.role}
                              </Badge>
                            </div>

                            {/* Impact Stats Grid */}
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              <div className="bg-white/80 rounded px-2 py-1 text-center">
                                <div className="text-[8px] text-gray-500">
                                  Impact Runs
                                </div>
                                <div className="text-xs font-bold text-green-600">
                                  {formatNumber(player.impactRun)}
                                </div>
                              </div>
                              <div className="bg-white/80 rounded px-2 py-1 text-center">
                                <div className="text-[8px] text-gray-500">
                                  Impact Wkts
                                </div>
                                <div className="text-xs font-bold text-blue-600">
                                  {formatNumber(player.impactWicket)}
                                </div>
                              </div>
                              <div className="bg-white/80 rounded px-2 py-1 text-center">
                                <div className="text-[8px] text-gray-500">
                                  Impact Pts
                                </div>
                                <div className="text-xs font-bold text-purple-600">
                                  {formatNumber(player.impactScore)}
                                </div>
                              </div>
                            </div>

                            {/* Bowling Concession (if applicable) */}
                            {player.impactRunConced > 0 && (
                              <div className="mt-1 text-[8px] text-gray-400 text-right">
                                Runs conceded:{" "}
                                {formatNumber(player.impactRunConced)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Conditions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Venue Statistics */}
              <Card className="border-0 shadow-sm md:shadow-md">
                <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                  <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                    <BarChart4 className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    <span>Venue Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {predictionData.venueStats?.matches || "N/A"}
                        </div>
                        <div className="text-xs text-gray-600">
                          Total Matches
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {predictionData.venueStats?.avg1stInns || "N/A"}
                        </div>
                        <div className="text-xs text-gray-600">
                          Avg 1st Inns
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Batting First Wins
                          </span>
                          <span className="font-medium">
                            {predictionData.venueStats?.winBatFirst}
                          </span>
                        </div>
                        <Progress
                          value={parseInt(
                            predictionData.venueStats?.winBatFirst || "0",
                          )}
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Bowling First Wins
                          </span>
                          <span className="font-medium">
                            {predictionData.venueStats?.winBowlFirst}
                          </span>
                        </div>
                        <Progress
                          value={parseInt(
                            predictionData.venueStats?.winBowlFirst || "0",
                          )}
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">
                        Average 2nd Innings Score
                      </div>
                      <div className="text-lg font-bold text-purple-600">
                        {predictionData.venueStats?.avg2ndInns} runs
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Conditions */}
              <Card className="border-0 shadow-sm md:shadow-md">
                <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                  <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                    <Cloud className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    <span>Weather Conditions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Temperature
                        </span>
                      </div>
                      <div className="text-lg font-bold">
                        {predictionData.venueWeather?.temperature}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg text-center">
                        <div className="flex justify-center mb-2">
                          {getWeatherIcon(
                            predictionData.venueWeather?.condition,
                          )}
                        </div>
                        <div className="text-xs text-gray-500">Condition</div>
                        <div className="text-sm font-medium">
                          {predictionData.venueWeather?.condition}
                        </div>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg text-center">
                        <Droplets className="h-5 w-5 text-green-500 mx-auto mb-2" />
                        <div className="text-xs text-gray-500">Humidity</div>
                        <div className="text-sm font-medium">
                          {predictionData.venueWeather?.humidity}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CloudRain className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">Rain Chance</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={parseInt(
                            predictionData.venueWeather?.rainChance?.split(
                              " ",
                            )[0] || "0",
                          )}
                          className="flex-1 h-2"
                        />
                        <span className="text-sm font-bold">
                          {predictionData.venueWeather?.rainChance}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Final Disclaimer */}
            <div className="mt-4 p-4 rounded-lg border border-red-300 bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-orange-800 mb-2">
                    ⚖️ DISCLAIMER
                  </h4>
                  <p className="text-xs text-orange-700">
                    AI Confidence Score represents the model&apos;s statistical assessment and is not betting advice. CricVista provides AI-powered cricket analytics for informational and entertainment purposes only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIPredictionModal;
