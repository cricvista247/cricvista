import { FormatErrorMessage, GetTeamShortName } from "@/lib/utils";
import dbConnect from "../db";
import { CrexMatchScorecard } from "./CrexScore";
import Match from "./MatchModel";
import moment from "moment-timezone";

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
        !match?.matchDescription?.toLowerCase().includes("test") &&
        !match?.url?.toLowerCase().includes("test") &&
        !match?.url?.toLowerCase().includes("match-county-championship")
      );
    });

    const now = moment().tz(timezone);

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
      return matchDateTime.isBefore(now);
    });

    const processedLiveMatches = await Promise.all(
      [...liveMatches].map(async (match: any) => {
        let result = "";

        try {
          const matchId = match._id;

          const scoreCardRes = await CrexMatchScorecard(
              `${match.url}/match-scorecard`,
            ),
            scoreCard = scoreCardRes;
          result = scoreCard?.result?.toLowerCase() ?? "";

          let prediction = match.prediction;

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

    const finalPrepareData = sortedData.map((item: any) => {
      const matchDateTime = moment
        .utc(`${item.matchDate} ${item.startTime}`, "ddd, DD MMM YYYY h:mm A")
        .tz(timezone);
      let data = {
        ...item,
        matchDate: matchDateTime.format("ddd, DD MMM YYYY"),
        startTime: matchDateTime.format("hh:mm A"),
        matchDateTimeUser: matchDateTime.format("DD MMM YYYY, hh:mm A"),
      };

      return data;
    });

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
