/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Target,
  CalendarCog,
} from "lucide-react";

interface CricketScore {
  runs: number;
  overs: string;
  balls: string;
  status: "COMPLETED" | "IN_PROGRESS" | "DECLARED";
  wickets: number;
}

interface Team {
  squadId: number;
  teamName: string;
  teamShortName: string;
  teamFlagUrl: string;
  isWinner: boolean | null;
  color: string;
  cricketScore: CricketScore[];
  squadNo: number | null;
}

interface Tour {
  id: number;
  name: string;
}

interface Match {
  matchId: number;
  matchName: string;
  matchDescription: string;
  startTime: string;
  status: "NOT_STARTED" | "LIVE" | "COMPLETED" | "ABANDONED";
  venue: string;
  tour: Tour;
  format: string;
  sport: string;
  teams: Team[];
}

interface MatchCardProps {
  match: Match;
  showPredictButton?: boolean;
  onClick?: () => void;
}

const MatchCard = ({
  match,
  showPredictButton = false,
  onClick,
}: MatchCardProps) => {
  const team1 = match.teams[0];
  const team2 = match.teams[1];

  // Helper function to get total balls from overs for different formats
  const getTotalBalls = (format: string): number => {
    switch (format.toUpperCase()) {
      case "T10":
        return 60; // 10 overs * 6 balls
      case "T20":
      case "T20I":
        return 120; // 20 overs * 6 balls
      case "ODI":
        return 300; // 50 overs * 6 balls
      case "TEST":
        return 0; // No ball limit in Test matches
      default:
        return 120;
    }
  };

  // Helper function to calculate balls bowled from overs string
  const getBallsBowled = (overs: string): number => {
    if (!overs || overs === "0") return 0;

    const parts = overs.split(".");
    const completedOvers = parseInt(parts[0]) || 0;
    const extraBalls = parseInt(parts[1]) || 0;

    return completedOvers * 6 + extraBalls;
  };

  // Helper function to calculate remaining balls
  const getRemainingBalls = (format: string, overs: string): number => {
    const totalBalls = getTotalBalls(format);
    if (totalBalls === 0) return 0; // Test match

    const ballsBowled = getBallsBowled(overs);
    return Math.max(0, totalBalls - ballsBowled);
  };

  // Helper function to format score display
  const formatScore = (
    team: Team,
    isSecondInnings: boolean = false
  ): string => {
    if (!team.cricketScore || team.cricketScore.length === 0) {
      return "Yet to bat";
    }

    const scores = team.cricketScore.map((score, index) => {
      const runs = score.runs ?? 0;
      const wickets = score.wickets ?? 0;
      const overs = score.overs || "0";

      // For Test matches, don't show balls
      if (match.format.toUpperCase() === "TEST") {
        if (score.status === "DECLARED") {
          return `${runs}/${wickets} (${overs} ov) dec`;
        }
        return `${runs}/${wickets} (${overs} ov)`;
      }

      return `${runs}/${wickets} (${overs})`;
    });

    return scores.join(" & ");
  };

  // Helper function to get match status text
  const getMatchStatusText = (): string => {
    const team1 = match.teams[0];
    const team2 = match.teams[1];
    const team1Innings = team1.cricketScore || [];
    const team2Innings = team2.cricketScore || [];

    // 🟢 1. Abandoned or Not Started
    if (match.status === "ABANDONED") return "Match Abandoned";

    if (match.status === "NOT_STARTED") {
      return `Starts ${new Date(match.startTime).toLocaleDateString()}`;
    }

    // 🟢 2. Completed match
    if (match.status === "COMPLETED") {
      if (team1.isWinner) return `${team1.teamShortName} won the match`;
      if (team2.isWinner) return `${team2.teamShortName} won the match`;
      return "Match completed";
    }

    // 🟢 3. LIVE match (detailed test logic)
    if (match.status === "LIVE") {
      // ✅ Calculate total runs from all innings
      const t1Total = team1Innings.reduce((sum, s) => sum + s.runs, 0);
      const t2Total = team2Innings.reduce((sum, s) => sum + s.runs, 0);

      const t1InningsCount = team1Innings.length;
      const t2InningsCount = team2Innings.length;

      // --- Case 1: India batted first, declared, WI followed on ---
      if (
        match.format === "TEST" &&
        t1InningsCount === 1 &&
        t2InningsCount === 2
      ) {
        const t1Runs = team1Innings[0].runs;
        const t2First = team2Innings[0].runs;
        const t2Second = team2Innings[1].runs;
        const t2TotalRuns = t2First + t2Second;

        // 🧮 Check if follow-on is in play
        const followOn = t1Runs - t2First >= 200;

        if (followOn) {
          const trailBy = t1Runs - t2TotalRuns;
          const wicketsDown = team2Innings[1].wickets ?? 0;

          if (trailBy > 0 && wicketsDown < 10) {
            return `${team2.teamShortName} trail by ${trailBy} runs with ${
              10 - wicketsDown
            } wickets remaining`;
          }

          if (trailBy <= 0) {
            return `${team2.teamShortName} lead by ${Math.abs(
              trailBy
            )} runs with ${10 - wicketsDown} wickets remaining`;
          }

          // If all out in 2nd innings
          if (wicketsDown === 10 && trailBy > 0) {
            return `${team1.teamShortName} need ${trailBy + 1} runs to win`;
          }
        }
      }

      // --- Case 2: Normal 4th innings situation ---
      if (
        match.format === "TEST" &&
        ((t1InningsCount === 2 && t2InningsCount === 1) ||
          (t1InningsCount === 1 && t2InningsCount === 2))
      ) {
        const t1Runs = t1Total;
        const t2Runs = t2Total;

        const target =
          t1Runs - (t2Runs - (team2Innings.slice(-1)[0]?.runs || 0)) + 1;
        const currentRuns = team2Innings.slice(-1)[0]?.runs || 0;
        const currentWickets = team2Innings.slice(-1)[0]?.wickets || 0;

        const runsNeeded = target - currentRuns;
        if (runsNeeded > 0 && currentWickets < 10) {
          return `${team2.teamShortName} need ${runsNeeded} runs with ${
            10 - currentWickets
          } wickets remaining`;
        }

        if (runsNeeded <= 0) {
          return `${team2.teamShortName} won the match`;
        }
      }

      // --- Case 3: First innings ongoing ---
      if (t1InningsCount === 1 && t2InningsCount === 0) {
        return `${team1.teamShortName} batting first`;
      }

      // --- Case 4: Second innings ongoing ---
      if (t1InningsCount === 1 && t2InningsCount === 1) {
        const target = t1InningsCount && t1Total > t2Total ? t1Total + 1 : 0;
        const current = team2Innings[0];
        if (current.status === "IN_PROGRESS") {
          const runsNeeded = target - current.runs;
          return `${team2.teamShortName} need ${runsNeeded} runs`;
        }
      }

      // --- Case 5: Follow-on active (team2 batting again) ---
      if (t1InningsCount === 1 && t2InningsCount === 2) {
        const t1Runs = team1Innings[0].runs;
        const t2FirstRuns = team2Innings[0].runs;
        const t2Second = team2Innings[1];
        const totalRuns = t2FirstRuns + t2Second.runs;
        const trailBy = t1Runs - totalRuns;

        if (trailBy > 0) {
          return `${team2.teamShortName} trail by ${trailBy} runs with ${
            10 - (t2Second.wickets ?? 0)
          } wickets remaining`;
        } else {
          return `${team2.teamShortName} lead by ${Math.abs(trailBy)} runs`;
        }
      }

      return "Match in progress";
    }

    // 🟢 Fallback
    return "Match status unknown";
  };

  // Determine if team2 is in second innings
  const isTeam2SecondInnings =
    team1?.cricketScore?.length > 0 && team2?.cricketScore?.length > 0;

  return (
    <Card
      className="group hover:shadow-xl transition-all duration-300 border-0 bg-white cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Match Header */}
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <CalendarCog className="h-3 w-3" />
            {/* <MapPin className="h-3 w-3" /> */}
            <span className="truncate">{match.tour.name}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                match.status === "LIVE"
                  ? "destructive"
                  : match.status === "COMPLETED"
                  ? "default"
                  : "secondary"
              }
            >
              {match.status === "LIVE"
                ? "🔴 LIVE"
                : match.status === "ABANDONED"
                ? "⚠️ ABANDONED"
                : match.status === "NOT_STARTED"
                ? "UPCOMING"
                : match.status}
            </Badge>
            <Badge variant="outline">{match.format}</Badge>
          </div>
          <div className="text-sm text-gray-500">{match.matchDescription}</div>
        </div>

        {/* Teams and Scores */}
        <div className="space-y-4 mb-4">
          {/* Team 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={team1.teamFlagUrl}
                alt={team1.teamName}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {team1.teamShortName}
                </h3>
                <p className="text-xs text-gray-500">{team1.teamName}</p>
              </div>
              {team1.isWinner && match.status === "COMPLETED" && (
                <Trophy className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">
                {formatScore(team1)}
              </div>
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={team2.teamFlagUrl}
                alt={team2.teamName}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {team2.teamShortName}
                </h3>
                <p className="text-xs text-gray-500">{team2.teamName}</p>
              </div>
              {team2.isWinner && match.status === "COMPLETED" && (
                <Trophy className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">
                {formatScore(team2, isTeam2SecondInnings)}
              </div>
            </div>
          </div>
        </div>

        {/* Match Status */}
        <div className="text-center py-3 px-4 bg-gray-50 rounded-lg mb-4">
          <p className="text-sm font-medium text-gray-700">
            {getMatchStatusText()}
          </p>
        </div>

        {/* Match Info */}
        <div className="space-y-2 text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{match.venue}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3" />
            <span>{new Date(match.startTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3" />
            <span>{new Date(match.startTime).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Action Button */}
        {showPredictButton && match.status !== "ABANDONED" && (
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <Target className="h-4 w-4 mr-2" />
            {match.status === "COMPLETED" ? "View Analysis" : "Get Analysis"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;
