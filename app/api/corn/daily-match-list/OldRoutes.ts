import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage, NormalizeCrexUrl } from "@/lib/utils";
import { CrexNext3DaysFixturesArray } from "../CrexNext3DayList";
import Match from "../../schedule/MatchModel";
import { CrexV2Details } from "../../match-details/CrexV2Details";
import MatchDetails from "../../match-details/MatchDetailsModel";
import mongoose from "mongoose";
// import moment from "moment-timezone";
import moment from "moment";

const CHUNK_SIZE = 10;

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    console.log("CRON HIT ✅", new Date());

    // ---------------- DELETE OLD MATCHES ----------------
    const cutoffDate = moment().subtract(3, "days").format("YYYY-MM-DD");
    const fixtures = await CrexNext3DaysFixturesArray();
    // const fixtures = a.map((item: any) => ({
    //   ...item,
    //   matchDate: moment(item.matchDate, "ddd, DD MMM YYYY")
    //     .tz("Asia/Kolkata")
    //     .format("ddd, DD MMM YYYY"),
    //   startTime: moment(item.startTime, "hh:mm A")
    //     .tz("Asia/Kolkata")
    //     .format("hh:mm A"),
    //   url: NormalizeCrexUrl(item.url),
    // }));

    // 1️⃣ Old matches list
    const oldMatchList = await Match.find(
      { formatDate: { $lte: cutoffDate } },
      { _id: 1 },
    );

    const matchIds = oldMatchList.map((m) => m._id);
    // 2️⃣ MatchDetails delete
    if (matchIds.length > 0) {
      await MatchDetails.deleteMany({
        matchId: { $in: matchIds },
      });
    }

    await Match.deleteMany({
      formatDate: { $lte: cutoffDate },
    });

    // ---------------- FETCH FIXTURES ----------------

    if (!fixtures?.length) {
      return NextResponse.json({ success: true, message: "No fixtures found" });
    }

    // ---------------- UPSERT MATCHES ----------------
    const bulkOps = fixtures.map((item: any) => {
      const url = NormalizeCrexUrl(item.url);

      return {
        updateOne: {
          filter: { url },
          update: {
            // $set: { ...item, url },
            $setOnInsert: {
              ...item,
              url,
              // formatDate: moment(item.matchDate, "ddd, DD MMM YYYY")
              //   .tz("Asia/Kolkata")
              //   .format("YYYY-MM-DD"),
              formatDate: moment(item.matchDate, "ddd, DD MMM YYYY").format(
                "YYYY-MM-DD",
              ),
              createdAt: new Date(),
              isDetailsFetched: false,
            },
          },
          upsert: true,
        },
      };
    });

    await Match.bulkWrite(bulkOps);

    // ---------------- FETCH UNPROCESSED MATCHES ----------------
    const dbMatches = await Match.find({ isDetailsFetched: false });

    if (!dbMatches.length) {
      return NextResponse.json({
        success: true,
        message: "No pending match details",
      });
    }

    const successIds: mongoose.Types.ObjectId[] = [];

    // ---------------- PROCESS IN CHUNKS ----------------
    for (let i = 0; i < dbMatches.length; i += CHUNK_SIZE) {
      const chunk: any = dbMatches.slice(i, i + CHUNK_SIZE);

      const detailOps: any[] = [];

      for (const match of chunk) {
        try {
          const crexOverallStats = await CrexV2Details(match.url);

          if (!crexOverallStats) continue;

          const squads = (crexOverallStats.squads ?? []).map((team: any) => ({
            ...team,
            playingPlayers: (team.playingPlayers ?? []).map((p: any) => ({
              ...p,
              careerStats: {
                ...p.careerStats,
                bowling: (p.careerStats?.bowling ?? []).filter(
                  (b: any) => !b.format?.toLowerCase().includes("debut"),
                ),
              },
            })),
            benchPlayers: (team.benchPlayers ?? []).map((p: any) => ({
              ...p,
              careerStats: {
                ...p.careerStats,
                bowling: (p.careerStats?.bowling ?? []).filter(
                  (b: any) => !b.format?.toLowerCase().includes("debut"),
                ),
              },
            })),
          }));

          detailOps.push({
            updateOne: {
              filter: { matchId: match._id },
              update: {
                $set: {
                  matchId: match._id,
                  ...crexOverallStats,
                  squads,
                  updatedAt: new Date(),
                },
              },
              upsert: true,
            },
          });

          successIds.push(match._id);
        } catch (err) {
          console.error("DETAIL FETCH FAILED:", match.url);
        }
      }

      if (detailOps.length) {
        await MatchDetails.bulkWrite(detailOps);
      }
    }

    // ---------------- MARK FETCHED ----------------
    if (successIds.length) {
      await Match.updateMany(
        { _id: { $in: successIds } },
        {
          $set: {
            isDetailsFetched: true,
            detailsFetchedAt: new Date(),
          },
        },
      );
    }

    return NextResponse.json({
      success: true,
      fixtures: fixtures.length,
      detailsFetched: successIds.length,
    });
  } catch (error) {
    console.error("CRON ERROR ❌", error);

    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
};
