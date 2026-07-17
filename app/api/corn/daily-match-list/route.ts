import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import { CrexNext3DaysFixturesArray } from "../CrexNext3DayList";
import Match from "../../schedule/MatchModel";
import MatchDetails from "../../match-details/MatchDetailsModel";
import moment from "moment";
import { TeamRank } from "../../match-details/TeamRank";
import { Prediction } from "../../order/Prediction";
import { CrexV2Details } from "../../match-details/CrexV2Details";
import { ExtractMatchDetails } from "../../match-details/ExtractMatchDetails";

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

export const GET = async () => {
  await dbConnect();

  try {
    console.log("CRON HIT ✅", new Date());

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
    await asyncPool(5, newMatches, async (match: any) => {
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
    });

    // ---------------- FETCH UNPROCESSED MATCHES ----------------
    const dbMatches = await Match.find({ isDetailsFetched: false });

    await asyncPool(3, dbMatches, async (match: any) => {
      try {
        // const stats = await CrexV2Details(`${match.url}/match-details`);

        const stats = await ExtractMatchDetails(`${match.url}`);

        if (!stats) return;

        // if (!stats?.teams || stats.teams.length < 2) {
        //   console.log("⚠️ Skipping bad data:", match.url);
        //   return;
        // }

        const hasPlaying11 =
          stats?.squads?.[0]?.playingPlayers?.length > 0 &&
          stats?.squads?.[0]?.playingPlayers?.length <= 12 &&
          stats?.squads?.[1]?.playingPlayers?.length > 0 &&
          stats?.squads?.[1]?.playingPlayers?.length <= 12;

        await MatchDetails.updateOne(
          { matchId: match._id },
          {
            $set: {
              matchId: match._id,
              ...stats,
              updatedAt: new Date(),
            },
          },
          { upsert: true },
        );
        // 🔥 insert only if not exists (no overwrite)
        // const existingDetails = await MatchDetails.findOne({
        //   matchId: match._id,
        // });

        // if (!existingDetails) {
        //   await MatchDetails.insertOne({
        //     matchId: match._id,
        //     ...stats,
        //     updatedAt: new Date(),
        //   });
        // } else {
        //   await MatchDetails.updateOne(
        //     { matchId: match._id },
        //     { $set: { ...stats, updatedAt: new Date() } },
        //   );
        // }

        const analysis = await Prediction({
          ...stats,
          matchInfo: match,
        });

        await Match.updateOne(
          { _id: match._id },
          {
            $set: {
              isPlayingPlayerFetched: hasPlaying11,
              prediction: analysis,
              isDetailsFetched: true,
              detailsFetchedAt: new Date(),
            },
          },
        );
      } catch (err) {
        console.error("Processing error:", match.url, err);
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Match list updated successfully",
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
