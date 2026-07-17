import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage, GetTeamShortName } from "@/lib/utils";
import moment from "moment";
import Match from "../../schedule/MatchModel";
import MatchDetails from "../../match-details/MatchDetailsModel";
import { SquadList } from "../../match-details/SquadList";
import { CrexMatchScorecard } from "../../schedule/CrexScore";
import { ExtractMatchDetails } from "../../match-details/ExtractMatchDetails";
import { Prediction } from "../../order/Prediction";

// 🔥 concurrency limiter
const asyncPool = async (limit: number, array: any[], iteratorFn: any) => {
  const ret: any[] = [];
  const executing: any[] = [];

  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    if (limit <= array.length) {
      const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
};

export const GET = async (_req: NextRequest) => {
  await dbConnect();

  try {
    console.log("CRON HIT ✅", new Date());

    const now = moment();

    const fixtures = await Match.find({
      isCompleted: true,
      formatDate: { $lte: now },
    }).lean();

    if (!fixtures.length) {
      return NextResponse.json({
        success: true,
        message: "No fixtures found",
      });
    }

    await asyncPool(3, fixtures, async (match: any) => {
      try {
        console.log("Processing match:", match._id);

        let matchDetails = null;

        /* ================= MATCH DETAILS ================= */

        if (!match.isDetailsFetched) {
          const details = await ExtractMatchDetails(match.url);

          if (details) {
            const hasPlaying11 =
              details?.squads?.[0]?.playingPlayers?.length > 0 &&
              details?.squads?.[1]?.playingPlayers?.length > 0;

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
                { upsert: true },
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
              latestSquad?.[1]?.playingPlayers?.length > 0;

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

        const status = matchDateTime.isAfter(moment())
          ? "UPCOMING"
          : result.includes("abandoned")
            ? "ABANDONED"
            : result.includes("won") ||
                result.includes("match drawn") ||
                result.includes("no result")
              ? "COMPLETED"
              : "LIVE";

        await Match.updateOne(
          { _id: match._id },
          {
            $set: {
              isCompleted:
                result.includes("abandoned") ||
                result.includes("won") ||
                result.includes("match drawn") ||
                result.includes("no result"),
              teams: updatedTeams,
              status,
              matchResult: result,
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

        console.log("Match updated:", match._id);
      } catch (err) {
        console.error("Match error:", match._id, err);
      }
    });

    return NextResponse.json({
      success: true,
      message: "Matches processed",
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
