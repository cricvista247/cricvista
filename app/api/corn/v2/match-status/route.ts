import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../db";
import {
  FormatErrorMessage,
  GetTeamShortName,
} from "@/lib/utils";
import moment from "moment";
import Match from "../../../schedule/MatchModel";
import MatchDetails from "../../../match-details/MatchDetailsModel";
import { SquadList } from "../../../match-details/SquadList";
import { CrexMatchScorecard } from "../../../schedule/CrexScore";
import { Prediction } from "../../../order/Prediction";
import { ExtractMatchDetails } from "../../../match-details/ExtractMatchDetails";

export const GET = async (_req: NextRequest) => {
  await dbConnect();

  try {
    console.log("MATCH STATUS V2 CRON HIT ✅", new Date());
    const now = moment();

    // Fetch exactly ONE match that is not completed
    const match = await Match.findOne({
      isCompleted: false,
      formatDate: { $lte: now },
    }).sort({ updatedAt: 1 }); // Process the one that was updated longest ago

    if (!match) {
      return NextResponse.json({
        success: true,
        message: "No live or upcoming matches require status updates at this time.",
      });
    }

    console.log("Processing status for match:", match._id, match.url);

    let matchDetails = null;

    /* ================= MATCH DETAILS (Fallback) ================= */

    if (!match.isDetailsFetched) {
      const details = await ExtractMatchDetails(`${match.url}`);

      if (details) {
        const hasPlaying11 =
          details?.squads?.[0]?.playingPlayers?.length > 0 &&
          details?.squads?.[0]?.playingPlayers?.length <= 12 &&
          details?.squads?.[1]?.playingPlayers?.length > 0 &&
          details?.squads?.[1]?.playingPlayers?.length <= 12;

        const analysis = await Prediction({
          ...details,
          matchInfo: match,
        });

        await Promise.all([
          MatchDetails.updateOne(
            { matchId: match._id },
            {
              $set: {
                ...details,
                updatedAt: new Date(),
              },
            },
            { upsert: true }
          ),
          Match.updateOne(
            { _id: match._id },
            {
              $set: {
                isPlayingPlayerFetched: hasPlaying11,
                prediction: analysis,
                isDetailsFetched: true,
                detailsFetchedAt: new Date(),
              },
            },
          ),
        ]);

        matchDetails = details;
      }
    }

    /* ================= PLAYING XI ================= */

    if (!match.isPlayingPlayerFetched) {
      if (!matchDetails) {
        matchDetails = await MatchDetails.findOne({
          matchId: match._id,
        });
      }

      if (matchDetails?.squads) {
        const latestSquad = await SquadList(
          `${match.url}/match-details`,
          matchDetails.squads,
        );

        const hasPlaying11 =
          latestSquad?.[0]?.playingPlayers?.length > 0 &&
          latestSquad?.[0]?.playingPlayers?.length <= 12 &&
          latestSquad?.[1]?.playingPlayers?.length > 0 &&
          latestSquad?.[1]?.playingPlayers?.length <= 12;

        const analysis = await Prediction({
          ...(matchDetails.toObject?.() || matchDetails), // ✅ fix
          squads: latestSquad,
          matchInfo: match,
        });

        await Promise.all([
          MatchDetails.updateOne(
            { matchId: match._id },
            {
              $set: {
                squads: latestSquad,
              },
            },
          ),
          Match.updateOne(
            { _id: match._id },
            {
              $set: {
                prediction: analysis,
                isPlayingPlayerFetched: hasPlaying11,
                updatedAt: new Date(),
              },
            },
          ),
        ]);
      }
    }

    /* ================= SCORECARD ================= */

    const scoreCard = await CrexMatchScorecard(
      `${match.url}/match-scorecard`,
    );

    const result = scoreCard?.result?.toLowerCase() ?? "";

    const updatedTeams = (match.teams ?? []).map((dbTeam: any) => {
      const scTeam = scoreCard?.teams?.find(
        (t: any) => t?.flagUrl === dbTeam?.teamFlagUrl,
      );

      return {
        ...dbTeam,
        teamShortName: scTeam?.name ?? GetTeamShortName(dbTeam.teamName),
        cricketScore: scTeam ? `${scTeam.score} (${scTeam.overs})` : null,
      };
    });

    const matchDateTime = moment(match.formatDate);
    const isOldMatch = now.diff(matchDateTime, "days") >= 2;

    const status = isOldMatch
      ? "COMPLETED"
      : matchDateTime.isAfter(now)
        ? "UPCOMING"
        : result.includes("abandoned")
          ? "ABANDONED"
          : result.includes("won") ||
              result.includes("match drawn") ||
              result.includes("no result")
            ? "COMPLETED"
            : "LIVE";
            
    const isCompleted = isOldMatch || status === "COMPLETED";

    await Match.updateOne(
      { _id: match._id },
      {
        $set: {
          isCompleted,
          teams: updatedTeams,
          status,
          matchResult: result,
          updatedAt: new Date(), // Important: ensure this is updated so it gets pushed to the back of the queue
          score: scoreCard
            ? {
                score: (scoreCard.teams ?? []).map((t: any) => ({
                  team: t.name,
                  run: `${t.score} (${t.overs})`,
                })),
                result: scoreCard?.result ?? "",
              }
            : null,
        },
      },
    );

    console.log("Match status updated successfully:", match._id);

    return NextResponse.json({
      success: true,
      message: `Match status processed successfully for match: ${match._id}`,
    });
  } catch (error) {
    console.error("CRON ERROR ", error);

    return NextResponse.json(
      {
        success: false,
        error: FormatErrorMessage(error),
      },
      { status: 500 },
    );
  }
};
