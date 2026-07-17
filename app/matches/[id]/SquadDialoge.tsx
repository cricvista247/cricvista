import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  AlertTriangle,
  Check,
  X,
  Target,
  Zap,
  TrendingUp,
  Star,
  Users,
  BarChart3,
  Shield,
  Activity,
  TargetIcon,
  Info,
  X as XIcon,
  Trophy,
  Flag,
  Globe,
  Calendar,
  Home,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface PlayerCardProps {
  player: any;
}

interface BattingStat {
  format: string;
  matches: string;
  innings: string;
  runs: string;
  hundreds: string;
  fifties: string;
  highScore: string;
  strikeRate: string;
  average: string;
  fours: string;
  sixes: string;
  ducks: string;
  rank: string;
}

interface BowlingStat {
  format: string;
  matches: string;
  innings: string;
  wickets: string;
  economy: string;
  average: string;
  best: string;
  threeWickets: string;
  fiveWickets: string;
  strikeRate: string;
  maidens: string;
  rank: string;
}

interface RecentForm {
  match: string;
  score?: string;
  figures?: string;
  scorecardUrl: string;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  const getPlayerTypeColor = (role: string) => {
    if (!role) return "bg-gray-100 text-gray-800 border-gray-300";
    if (role === "Batter") {
      return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
    } else if (role === "Bowler") {
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
    } else if (role === "All Rounder") {
      return "bg-gradient-to-r from-purple-500 to-pink-600 text-white";
    } else {
      return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const getPlayerTypeIcon = (role: string) => {
    if (!role) return <Users className="h-4 w-4" />;
    if (role === "Batter") {
      return <TargetIcon className="h-4 w-4" />;
    } else if (role === "Bowler") {
      return <Zap className="h-4 w-4" />;
    } else if (role === "All Rounder") {
      return <Star className="h-4 w-4" />;
    } else {
      return <Users className="h-4 w-4" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format?.toUpperCase()) {
      case "ODI":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "T20I":
        return "bg-gradient-to-r from-green-500 to-emerald-600";
      case "TEST":
        return "bg-gradient-to-r from-red-500 to-red-600";
      case "IPL":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      case "BBL":
        return "bg-gradient-to-r from-orange-500 to-amber-600";
      case "WC ODI":
        return "bg-gradient-to-r from-indigo-500 to-indigo-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const calculateDataCompleteness = (player: any) => {
    const fields = [
      { key: "careerStats", weight: 3 },
      { key: "recentForm", weight: 2 },
      { key: "rank", weight: 1 },
    ];

    let totalWeight = 0;
    let completedWeight = 0;

    fields.forEach((field) => {
      totalWeight += field.weight;
      const value = player[field.key];

      if (value) {
        if (field.key === "careerStats") {
          if (
            (value.batting && value.batting.length > 0) ||
            (value.bowling && value.bowling.length > 0)
          ) {
            completedWeight += field.weight;
          }
        } else if (field.key === "recentForm") {
          if (
            (value.batting && value.batting.length > 0) ||
            (value.bowling && value.bowling.length > 0)
          ) {
            completedWeight += field.weight;
          }
        } else if (field.key === "rank") {
          completedWeight += field.weight;
        }
      }
    });

    return Math.round((completedWeight / totalWeight) * 100);
  };

  const dataCompleteness = calculateDataCompleteness(player);

  // Separate batting and bowling stats
  const battingStats =
    player?.careerStats?.batting?.filter(
      (stat: BattingStat) =>
        !stat?.format?.includes("--") && stat?.matches !== "57",
    ) || [];

  const bowlingStats =
    player?.careerStats?.bowling?.filter(
      (stat: BowlingStat) =>
        !stat?.format?.includes("--") && stat?.wickets !== "57",
    ) || [];

  // Parse recent form
  const battingForm = player?.recentForm?.batting || [];
  const bowlingForm = player?.recentForm?.bowling || [];

  return (
    <TooltipProvider>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group cursor-pointer h-full">
            <div className="p-3 sm:p-4 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:scale-[1.02] h-full">
              <div className="flex items-start gap-3">
                {/* Left section with avatar */}
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-4 border-white shadow-lg flex-shrink-0">
                  <AvatarImage src={player?.image} alt={player?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                    {player?.shortName?.slice(0, 2) || "PL"}
                  </AvatarFallback>
                </Avatar>

                {/* Middle section with player info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate mb-1">
                        {player?.name}
                      </h3>
                      <Badge
                        className={`px-2 py-0.5 text-xs font-bold shadow-sm ${getPlayerTypeColor(
                          player?.role || player?.style,
                        )} w-fit`}
                      >
                        <span className="flex items-center gap-1">
                          {getPlayerTypeIcon(player?.role || player?.style)}
                          <span className="truncate">
                            {player?.role || player?.style}
                          </span>
                        </span>
                      </Badge>
                    </div>

                    {/* Icons aligned to top right */}
                    <div className="flex items-start gap-2 flex-shrink-0">
                      {player?.rank && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs px-2 py-0.5">
                              <Trophy className="h-2.5 w-2.5 mr-1" />
                              Rank
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{player.rank}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {dataCompleteness < 100 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              Data completeness: {dataCompleteness}%
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      <Eye className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>

                  {/* Player short info */}
                  <div className="mt-2 space-y-1">
                    {player?.isWK !== undefined && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <span className="font-medium">WK:</span>
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${player.isWK ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {player.isWK ? "Yes" : "No"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Data completeness bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Data Completeness</span>
                      <span className="font-medium">{dataCompleteness}%</span>
                    </div>
                    <Progress
                      value={dataCompleteness}
                      className="h-1.5 bg-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 w-[95vw] sm:w-full">
          <DialogHeader className="relative px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4 max-w-[80%]">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-4 border-white shadow-lg flex-shrink-0">
                  <AvatarImage src={player?.image} alt={player?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-base sm:text-xl">
                    {player?.shortName?.slice(0, 2) || "PL"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2 truncate">
                    {player?.name}
                    <Badge
                      className={`px-2 py-1 text-xs font-bold shadow-sm ${getPlayerTypeColor(
                        player?.role || player?.style,
                      )} flex-shrink-0`}
                    >
                      <span className="flex items-center gap-1">
                        {getPlayerTypeIcon(player?.role || player?.style)}
                        <span className="hidden sm:inline">
                          {player?.role || player?.style}
                        </span>
                        <span className="sm:hidden">
                          {(player?.role || player?.style)
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </span>
                      </span>
                    </Badge>
                    {player?.rank && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs px-2 py-1">
                        <Trophy className="h-3 w-3 mr-1" />
                        {player.rank}
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription className="flex flex-wrap items-center gap-1 sm:gap-3 mt-1 sm:mt-2 text-xs sm:text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {player?.shortName}
                    </span>
                    {player?.isWK !== undefined && (
                      <>
                        <span className="text-gray-300 hidden sm:inline">
                          •
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {player.isWK ? "Wicket Keeper" : "Non Wicket Keeper"}
                        </span>
                      </>
                    )}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto h-[calc(90vh-73px)] px-4 sm:px-6 py-4">
            {/* Data Completeness Banner */}
            {dataCompleteness < 100 && (
              <div className="mb-4 sm:mb-6">
                <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs sm:text-sm font-medium text-yellow-800 truncate">
                          Data Completeness: {dataCompleteness}%
                        </span>
                        <span className="text-xs text-yellow-600 flex-shrink-0 ml-2">
                          {dataCompleteness >= 80
                            ? "Good"
                            : dataCompleteness >= 60
                              ? "Average"
                              : "Limited"}
                        </span>
                      </div>
                      <Progress
                        value={dataCompleteness}
                        className="h-2 bg-yellow-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Tabs defaultValue="career" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4 sm:mb-6 w-full overflow-x-auto">
                <TabsTrigger
                  value="career"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Career</span>
                </TabsTrigger>
                <TabsTrigger
                  value="form"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Form</span>
                </TabsTrigger>
                <TabsTrigger
                  value="info"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Info className="h-4 w-4" />
                  <span>Info</span>
                </TabsTrigger>
              </TabsList>

              {/* Career Tab */}
              <TabsContent value="career" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Batting Stats */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        <span>Career Batting Statistics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                      {battingStats.length === 0 ? (
                        <EmptyState message="Batting statistics data not available" />
                      ) : (
                        <div className="space-y-3 sm:space-y-4">
                          {battingStats.map(
                            (stat: BattingStat, index: number) => (
                              <div
                                key={index}
                                className="p-3 sm:p-4 bg-gradient-to-r from-white to-blue-50 rounded-xl border border-blue-100"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                                  <Badge
                                    className={`${getFormatColor(stat.format)} text-white w-fit`}
                                  >
                                    {stat.format}
                                  </Badge>
                                  <div className="flex flex-wrap gap-2">
                                    <span className="text-xs sm:text-sm text-gray-600">
                                      Matches: {stat.matches}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-600">
                                      Innings: {stat.innings}
                                    </span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                                  <StatCard
                                    label="Runs"
                                    value={stat.runs}
                                    color="text-blue-600"
                                    bgColor="bg-blue-50"
                                  />
                                  <StatCard
                                    label="Average"
                                    value={stat.average}
                                    color="text-green-600"
                                    bgColor="bg-green-50"
                                  />
                                  <StatCard
                                    label="Strike Rate"
                                    value={stat.strikeRate}
                                    color="text-purple-600"
                                    bgColor="bg-purple-50"
                                  />
                                  <StatCard
                                    label="High Score"
                                    value={stat.highScore}
                                    color="text-orange-600"
                                    bgColor="bg-orange-50"
                                  />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-2">
                                  <StatCard
                                    label="100s/50s"
                                    value={`${stat.hundreds}/${stat.fifties}`}
                                    color="text-indigo-600"
                                    bgColor="bg-indigo-50"
                                  />
                                  <StatCard
                                    label="4s/6s"
                                    value={`${stat.fours}/${stat.sixes}`}
                                    color="text-pink-600"
                                    bgColor="bg-pink-50"
                                  />
                                  <StatCard
                                    label="Ducks"
                                    value={stat.ducks}
                                    color="text-red-600"
                                    bgColor="bg-red-50"
                                  />
                                  {stat.rank && stat.rank !== "--" && (
                                    <StatCard
                                      label="Rank"
                                      value={stat.rank}
                                      color="text-yellow-600"
                                      bgColor="bg-yellow-50"
                                    />
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Bowling Stats */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        <span>Career Bowling Statistics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                      {bowlingStats.length === 0 ? (
                        <EmptyState message="Bowling statistics data not available" />
                      ) : (
                        <div className="space-y-3 sm:space-y-4">
                          {bowlingStats.map(
                            (stat: BowlingStat, index: number) => (
                              <div
                                key={index}
                                className="p-3 sm:p-4 bg-gradient-to-r from-white to-green-50 rounded-xl border border-green-100"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                                  <Badge
                                    className={`${getFormatColor(stat.format)} text-white w-fit`}
                                  >
                                    {stat.format}
                                  </Badge>
                                  <div className="flex flex-wrap gap-2">
                                    <span className="text-xs sm:text-sm text-gray-600">
                                      Matches: {stat.matches}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-600">
                                      Innings: {stat.innings}
                                    </span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                                  <StatCard
                                    label="Wickets"
                                    value={stat.wickets}
                                    color="text-green-600"
                                    bgColor="bg-green-50"
                                  />
                                  <StatCard
                                    label="Average"
                                    value={stat.average}
                                    color="text-blue-600"
                                    bgColor="bg-blue-50"
                                  />
                                  <StatCard
                                    label="Economy"
                                    value={stat.economy}
                                    color="text-yellow-600"
                                    bgColor="bg-yellow-50"
                                  />
                                  <StatCard
                                    label="Best"
                                    value={stat.best}
                                    color="text-orange-600"
                                    bgColor="bg-orange-50"
                                  />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-2">
                                  <StatCard
                                    label="3W/5W"
                                    value={`${stat.threeWickets}/${stat.fiveWickets}`}
                                    color="text-indigo-600"
                                    bgColor="bg-indigo-50"
                                  />
                                  <StatCard
                                    label="Strike Rate"
                                    value={stat.strikeRate}
                                    color="text-purple-600"
                                    bgColor="bg-purple-50"
                                  />
                                  <StatCard
                                    label="Maidens"
                                    value={stat.maidens || "0"}
                                    color="text-pink-600"
                                    bgColor="bg-pink-50"
                                  />
                                  {stat.rank && stat.rank !== "--" && (
                                    <StatCard
                                      label="Rank"
                                      value={stat.rank}
                                      color="text-yellow-600"
                                      bgColor="bg-yellow-50"
                                    />
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Form Tab */}
              <TabsContent value="form" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Batting Form */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        <span>Recent Batting Form</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                      {battingForm.length === 0 ? (
                        <EmptyState message="Recent batting form data not available" />
                      ) : (
                        <div className="space-y-2 sm:space-y-3">
                          {battingForm.map(
                            (form: RecentForm, index: number) => (
                              <a
                                key={index}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-gradient-to-r from-white to-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                  <div className="min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">
                                      {form.match}
                                    </p>
                                  </div>
                                  {form.score && (
                                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs">
                                      {form.score}
                                    </Badge>
                                  )}
                                </div>
                              </a>
                            ),
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Bowling Form */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        <span>Recent Bowling Form</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                      {bowlingForm.length === 0 ? (
                        <EmptyState message="Recent bowling form data not available" />
                      ) : (
                        <div className="space-y-2 sm:space-y-3">
                          {bowlingForm.map(
                            (form: RecentForm, index: number) => (
                              <a
                                key={index}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-gradient-to-r from-white to-green-50 rounded-lg border border-green-200 hover:border-green-300 hover:shadow-sm transition-all"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                  <div className="min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">
                                      {form.match}
                                    </p>
                                  </div>
                                  {form.score && (
                                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs">
                                      {form.score}
                                    </Badge>
                                  )}
                                </div>
                              </a>
                            ),
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Info Tab */}
              <TabsContent value="info" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Player Info */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                        <span>Player Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="space-y-3 sm:space-y-4">
                        <InfoRow label="Full Name" value={player?.name} />
                        <InfoRow label="Role" value={player?.role} highlight />
                        <InfoRow label="Short Name" value={player?.shortName} />
                        <InfoRow
                          label="Wicket Keeper"
                          value={player?.isWK ? "Yes" : "No"}
                        />
                        <InfoRow label="Style" value={player?.style} />
                        <InfoRow
                          label="Rank"
                          value={player?.rank || "Not ranked"}
                        />
                        {player?.playerUrl && (
                          <div className="pt-2">
                            <a
                              href={player.playerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Globe className="h-4 w-4" />
                              View Player Profile on Crex
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Availability */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        <span>Data Availability</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="space-y-2 sm:space-y-3">
                        <DataStatus
                          label="Career Batting Stats"
                          available={battingStats.length > 0}
                        />
                        <DataStatus
                          label="Career Bowling Stats"
                          available={bowlingStats.length > 0}
                        />
                        <DataStatus
                          label="Recent Batting Form"
                          available={battingForm.length > 0}
                        />
                        <DataStatus
                          label="Recent Bowling Form"
                          available={bowlingForm.length > 0}
                        />
                        <DataStatus
                          label="Player Rank"
                          available={!!player?.rank}
                        />
                        <DataStatus
                          label="Player Image"
                          available={!!player?.image}
                        />
                        <DataStatus
                          label="Player Profile URL"
                          available={!!player?.playerUrl}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

// Helper Components
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 ${className}`}
  >
    {children}
  </div>
);

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3
    className={`text-base sm:text-lg font-semibold text-gray-900 ${className}`}
  >
    {children}
  </h3>
);

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`px-4 sm:px-6 pb-4 sm:pb-6 ${className}`}>{children}</div>
);

const StatCard = ({
  label,
  value,
  color,
  bgColor,
}: {
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}) => (
  <div className={`p-1 sm:p-2 ${bgColor} rounded-lg text-center`}>
    <div className="text-xs text-gray-600 mb-1">{label}</div>
    <div className={`text-sm font-bold ${color}`}>{value}</div>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-6 sm:py-8">
    <AlertTriangle className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
    <p className="text-gray-500 text-sm">{message}</p>
  </div>
);

const InfoRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-xs sm:text-sm text-gray-600">{label}</span>
    <span
      className={`text-xs sm:text-sm font-medium ${
        highlight ? "text-blue-600" : "text-gray-900"
      }`}
    >
      {value}
    </span>
  </div>
);

const DataStatus = ({
  label,
  available,
}: {
  label: string;
  available: boolean;
}) => (
  <div className="flex justify-between items-center">
    <span className="text-xs sm:text-sm text-gray-700 truncate mr-2">
      {label}
    </span>
    {available ? (
      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs py-1 px-2">
        <Check className="h-3 w-3 mr-1" />
        Available
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200 text-xs py-1 px-2">
        <X className="h-3 w-3 mr-1" />
        Missing
      </Badge>
    )}
  </div>
);

export default PlayerCard;
