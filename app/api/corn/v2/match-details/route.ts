import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../db";
import { FormatErrorMessage } from "@/lib/utils";
import Match from "../../../schedule/MatchModel";
import MatchDetails from "../../../match-details/MatchDetailsModel";
import { ExtractMatchDetails } from "../../../match-details/ExtractMatchDetails";
import { Prediction } from "../../../order/Prediction";

export const GET = async () => {
  await dbConnect();

  try {
    console.log("MATCH DETAILS V2 CRON HIT ✅", new Date());

    // Fetch exactly ONE match that hasn't had its details fetched yet
    const match = await Match.findOne({ isDetailsFetched: false }).sort({ createdAt: -1 });

    if (!match) {
      return NextResponse.json({
        success: true,
        message: "No matches require details fetching at this time.",
      });
    }

    console.log("Processing details for match:", match._id, match.url);

    const stats = await ExtractMatchDetails(`${match.url}`);

    if (!stats) {
      // Mark as fetched anyway or maybe handled differently?
      // Let's mark it true so we don't get stuck in an infinite loop, or we can just skip it
      await Match.updateOne({ _id: match._id }, { $set: { isDetailsFetched: true } });
      return NextResponse.json({ success: true, message: "Stats extraction failed or empty, marked as fetched to avoid loop." });
    }

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

    return NextResponse.json(
      {
        success: true,
        message: `Match details updated successfully for match: ${match._id}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("MATCH DETAILS CRON ERROR ❌", error);

    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
};
