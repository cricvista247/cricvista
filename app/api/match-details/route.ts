import { NextRequest } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../db";
import { FilterSquad, FormatErrorMessage } from "@/lib/utils";
import { SquadList } from "./SquadList";
import MatchDetails from "./MatchDetailsModel";
import Match from "../schedule/MatchModel";

import { Prediction } from "../order/Prediction";
import { CrexV2Details } from "./CrexV2Details";
import { ExtractMatchDetails } from "./ExtractMatchDetails";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();

    if (!body?._id) {
      return Response.json(
        { success: false, error: "Match id required" },
        { status: 400 },
      );
    }

    const matchId = new mongoose.Types.ObjectId(body._id);

    //  faster than aggregate
    const [match, matchDetails]: any = await Promise.all([
      Match.findById(matchId).lean(),
      MatchDetails.findOne({ matchId }).lean(),
    ]);

    const matchInfo = { ...body };

    /**
     * ===============================
     * IF MATCH NOT FOUND → SCRAPE
     * ===============================
     */
    if (!matchDetails) {
      const crexOverallStats: any = await ExtractMatchDetails(`${body.url}`);

      if (!crexOverallStats) {
        return Response.json(
          { success: false, error: "Failed to fetch match details" },
          { status: 500 },
        );
      }

      //  upsert safe
      await MatchDetails.insertOne({
        matchId,
        ...crexOverallStats,
        updatedAt: new Date(),
      });

      const hasPlaying11 =
        crexOverallStats?.squads?.[0]?.playingPlayers?.length > 0 &&
        crexOverallStats?.squads?.[0]?.playingPlayers?.length <= 12 &&
        crexOverallStats?.squads?.[1]?.playingPlayers?.length > 0 &&
        crexOverallStats?.squads?.[1]?.playingPlayers?.length <= 12;

      const analysis = await Prediction({
        ...crexOverallStats,
        matchInfo,
      });

      await Match.updateOne(
        { _id: matchId },
        {
          $set: {
            prediction: analysis,
            isPlayingPlayerFetched: hasPlaying11,
            isDetailsFetched: true,
            detailsFetchedAt: new Date(),
            updatedAt: new Date(),
          },
        },
      );

      return Response.json(
        {
          data: {
            ...crexOverallStats,
            matchInfo,
          },
        },
        { status: 200 },
      );
    }

    /**
     * ===============================
     * IF MATCH FOUND
     * ===============================
     */

    if (match?.isPlayingPlayerFetched) {
      return Response.json(
        {
          data: {
            ...matchDetails,
            matchInfo,
          },
        },
        { status: 200 },
      );
    }

    //  Fetch Latest Squad
    const latestSquad = await SquadList(
      `${body.url}/match-details`,
      matchDetails?.squads,
    );

    const hasPlaying11 =
      latestSquad?.[0]?.playingPlayers?.length > 0 &&
      latestSquad?.[0]?.playingPlayers?.length <= 12 &&
      latestSquad?.[1]?.playingPlayers?.length > 0 &&
      latestSquad?.[1]?.playingPlayers?.length <= 12;

    //  update + prediction parallel
    const [analysis] = await Promise.all([
      Prediction({
        ...matchDetails,
        squads: latestSquad,
        matchInfo,
      }),

      MatchDetails.updateOne(
        { matchId },
        {
          $set: {
            squads: latestSquad,
            updatedAt: new Date(),
          },
        },
      ),
    ]);

    await Match.updateOne(
      { _id: matchId },
      {
        $set: {
          prediction: analysis,
          isPlayingPlayerFetched: hasPlaying11,
          isDetailsFetched: true,
          detailsFetchedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    return Response.json(
      {
        data: {
          ...matchDetails,
          squads: latestSquad,
          matchInfo,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("MATCH DETAILS ERROR:", error);

    return Response.json(
      { success: false, error: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
}
