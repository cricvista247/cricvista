import { FormatErrorMessage, GetTeamShortName } from "@/lib/utils";
import dbConnect from "../db";
import { CrexMatchScorecard } from "./CrexScore";
import Match from "./MatchModel";
import MatchDetails from "../match-details/MatchDetailsModel";
import mongoose from "mongoose";
import moment from "moment-timezone";
import { Prediction } from "../order/Prediction";
import { SquadList } from "../match-details/SquadList";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const timezone = body?.timezone || "UTC";

    const base = body?.fromDate
      ? moment.tz(body.fromDate, timezone)
      : moment.tz(timezone);

    const todayStart = base.clone().startOf("day").utc().toDate();
    const todayEnd = base.clone().endOf("day").utc().toDate();
    const selectedDate = base.format("YYYY-MM-DD");

    const dbMatches = await Match.aggregate([
      {
        $match: {
          $or: [
            { formatDate: { $gte: todayStart, $lte: todayEnd } },
            { formatDate: { $lt: todayStart }, isCompleted: false },
          ],
        },
      },
      { $sort: { formatDate: 1 } },
    ]);

    const filteredMatches = dbMatches.filter((match: any) => {
      if (!match?.teams?.length) return false;

      return (
        match.teams[0]?.teamName !== "Team 1 (TBC)" &&
        match.teams[1]?.teamShortName !== "Team" &&
        !match?.matchDescription?.toLowerCase().includes("test")
      );
    });

    const now = moment().tz(timezone);

    const completedMatch = filteredMatches.filter(
      (item: any) => item.status === "COMPLETED",
    );

    const upcomingMatch = filteredMatches
      .filter((item: any) =>
        moment.utc(item.formatDate).tz(timezone).isAfter(now),
      )
      .map((item: any) => ({
        ...item,
        status: "UPCOMING",
        teams: item.teams.map((team: any) => ({
          ...team,
          teamShortName: GetTeamShortName(team.teamName),
        })),
      }));

    const liveMatches = filteredMatches.filter((item: any) => {
      const matchDateTime = moment.utc(item.formatDate).tz(timezone);
      return matchDateTime.isBefore(now) && item.status !== "COMPLETED";
    });

    const processedLiveMatches = await Promise.all(
      [...liveMatches, ...completedMatch].map(async (match: any) => {
        let scoreCard: any = null;
        let result = "";

        try {
          const matchId = match._id;

          // 🔥 parallel fetch (faster)
          const [scoreCardRes, details] = await Promise.all([
            CrexMatchScorecard(`${match.url}/match-scorecard`),
            MatchDetails.findOne({ matchId }),
          ]);

          scoreCard = scoreCardRes;
          result = scoreCard?.result?.toLowerCase() ?? "";

          let updatedSquads = details?.squads;
          let prediction = match.prediction;

          /* ================= PLAYING XI ================= */

          if (!match.isPlayingPlayerFetched && details?.squads) {
            const latestSquad = await SquadList(
              `${match.url}/match-details`,
              details.squads,
            );

            const hasPlaying11 =
              latestSquad?.[0]?.playingPlayers?.length > 0 &&
              latestSquad?.[1]?.playingPlayers?.length > 0;

            if (hasPlaying11) {
              updatedSquads = latestSquad;

              //  DB updates parallel
              await Promise.all([
                MatchDetails.updateOne(
                  { matchId },
                  {
                    $set: {
                      squads: latestSquad,
                      updatedAt: new Date(),
                    },
                  },
                ),
                Match.updateOne(
                  { _id: matchId },
                  {
                    $set: {
                      matchResult: result,
                      isPlayingPlayerFetched: true,
                      updatedAt: new Date(),
                    },
                  },
                ),
              ]);
            }
          }

          /* ================= PREDICTION ================= */

          if (!prediction && details) {
            const analysis = await Prediction({
              ...details,

              squads: updatedSquads,
              matchInfo: match,
            });

            prediction = analysis;

            // 🔥 save async (non-blocking feel)
            await Match.updateOne(
              { _id: matchId },
              {
                $set: {
                  matchResult: result,
                  prediction: analysis,
                  updatedAt: new Date(),
                },
              },
            );
          }

          /* ================= TEAM UPDATE ================= */

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

          const status =
            result.includes("won") ||
            result.includes("match drawn") ||
            result.includes("no result")
              ? "COMPLETED"
              : result.includes("abandoned")
                ? "ABANDONED"
                : "LIVE";

          return {
            ...match,
            teams: updatedTeams,
            status,
            prediction,
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
          };
        } catch (err) {
          console.error("Match error:", match._id, err);
          return match;
        }
      }),
    );

    const sortedData = [
      // ...completedMatch,
      ...upcomingMatch,
      ...processedLiveMatches,
    ]
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(a.formatDate).getTime() - new Date(b.formatDate).getTime(),
      )
      .filter((item: any) => {
        const matchDate = moment
          .utc(item.formatDate)
          .tz(timezone)
          .format("YYYY-MM-DD");

        if (item.status === "LIVE") return true;

        if (
          (item.status === "UPCOMING" || item.status === "COMPLETED") &&
          matchDate === selectedDate
        )
          return true;

        return false;
      });

    const finalPrepareData = await Promise.all(
      sortedData.map(async (item: any) => {
        const matchDateTime = moment
          .utc(`${item.matchDate} ${item.startTime}`, "ddd, DD MMM YYYY h:mm A")
          .tz(timezone);
        let data = {
          ...item,

          matchDate: matchDateTime.format("ddd, DD MMM YYYY"),
          startTime: matchDateTime.format("hh:mm A"),
          matchDateTimeUser: matchDateTime.format("DD MMM YYYY, hh:mm A"),
        };

        // if (item.status === "COMPLETED") {
        //   const details = await MatchDetails.findOne({
        //     matchId: new mongoose.Types.ObjectId(item._id),
        //   });

        //   if (details) {
        //     const analysis = await Prediction({
        //       ...details,
        //       squads: details.squads,
        //       matchInfo: item,
        //     });

        //     data.prediction = analysis;
        //   }
        // }

        return data;
      }),
    );

    return Response.json(
      {
        data: finalPrepareData,
        success: true,
        message: "Schedule fetched successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: FormatErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
