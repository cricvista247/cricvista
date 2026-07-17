import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../db";
import { FormatErrorMessage } from "@/lib/utils";
import { CrexNext3DaysFixturesArray } from "../../CrexNext3DayList";
import Match from "../../../schedule/MatchModel";
import MatchDetails from "../../../match-details/MatchDetailsModel";
import moment from "moment";
import { TeamRank } from "../../../match-details/TeamRank";

export const GET = async () => {
  await dbConnect();

  try {
    console.log("DAILY MATCH LIST V2 HIT ✅", new Date());

    // ---------------- DELETE OLD MATCHES ----------------
    const cutoffDate = moment().subtract(7, "days").toDate();

    const oldMatches = await Match.find(
      { formatDate: { $lte: cutoffDate } },
      { _id: 1 },
    );

    const matchIds = oldMatches.map((m) => m._id);

    if (matchIds.length) {
      await MatchDetails.deleteMany({ matchId: { $in: matchIds } });
    }

    await Match.deleteMany({ formatDate: { $lte: cutoffDate } });

    // ---------------- FETCH FIXTURES ----------------
    const fixtures = await CrexNext3DaysFixturesArray();

    if (!fixtures?.length) {
      return NextResponse.json({
        success: true,
        message: "No fixtures found",
      });
    }

    // ---------------- FILTER ----------------
    const filteredMatches = fixtures.filter((match: any) => {
      if (!match?.teams?.length) return false;

      return (
        match.teams[0]?.teamName !== "Team 1 (TBC)" &&
        match.teams[1]?.teamShortName !== "Team" &&
        !match?.matchDescription?.toLowerCase().includes("test") &&
        !match?.url?.toLowerCase().includes("test") &&
        !match?.url?.toLowerCase().includes("match-county-championship")
      );
    });

    // ---------------- EXISTING MATCHES ----------------
    const existingMatches = await Match.find(
      { url: { $in: filteredMatches.map((m: any) => m.url) } },
      { url: 1 },
    );

    const existingUrlSet = new Set(existingMatches.map((m) => m.url));

    // ---------------- NEW MATCHES ONLY ----------------
    const newMatches = filteredMatches.filter(
      (match: any) => !existingUrlSet.has(match.url),
    );

    console.log("New matches:", newMatches.length);

    // ---------------- INSERT NEW MATCHES ----------------
    for (const match of newMatches) {
      try {
        const matchStartUTC = moment.utc(
          `${match.matchDate} ${match.startTime}`,
          "ddd, DD MMM YYYY h:mm A",
        );

        const prepareTeam = await Promise.all(
          (match?.teams ?? []).map(async (team: any) => {
            const teamRank = await TeamRank(
              team.teamName,
              team.teamName?.includes("Women") ? "WOMEN" : "MEN",
              match.format,
            );

            return { ...team, teamRank };
          }),
        );

        await Match.insertOne({
          ...match,
          teams: prepareTeam,
          isCompleted: false,
          isPlayingPlayerFetched: false,
          isDetailsFetched: false,
          formatDate: matchStartUTC.toDate(),
          url: match.url,
          createdAt: new Date(),
        });

        console.log("✅ Inserted:", match.url);
      } catch (err) {
        console.error("Insert error:", match.url, err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Match list updated successfully. ${newMatches.length} new matches inserted.`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("CRON ERROR ❌", error);

    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
};
