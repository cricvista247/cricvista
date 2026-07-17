import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage, SendPrediction, SendPredictionResult } from "@/lib/utils";
import Match from "../../schedule/MatchModel";

export const GET = async (_req: NextRequest) => {
  await dbConnect();

  try {
    console.log("TELEGRAM NOTIFICATION CRON HIT ✅", new Date());

    let messagesSent = 0;

    // Phase 1: Send Prediction Messages (when playing11 is fetched and prediction is not sent)
    const matchesForPrediction = await Match.find({
      isPlayingPlayerFetched: true,
      status: { $ne: "COMPLETED" },
      isPredictionMessageSent: { $ne: true },
      prediction: { $ne: null }
    }).lean();

    for (const match of matchesForPrediction) {
      if (match.prediction) {
        const res = await SendPrediction(match.prediction);
        if (res) {
          await Match.updateOne(
            { _id: match._id },
            { $set: { isPredictionMessageSent: true } }
          );
          messagesSent++;
        }
      }
    }

    // Phase 2: Send Prediction Result Messages (when match is completed, prediction was sent, but result not sent)
    const matchesForResult = await Match.find({
      $or: [{ status: "COMPLETED" }, { isCompleted: true }],
      isPredictionMessageSent: true,
      isResultMessageSent: { $ne: true },
      matchResult: { $ne: null },
      prediction: { $ne: null }
    }).lean();

    for (const match of matchesForResult) {
      if (match.prediction && match.matchResult) {
        const team1 = match.prediction.team1?.name || "";
        const team2 = match.prediction.team2?.name || "";

        const finalWinner =
          match.prediction.team1?.winnerPrediction?.probability >
          match.prediction.team2?.winnerPrediction?.probability
            ? team1
            : team2;

        // Check if actual result contains the predicted winner's name
        const matchResultLower = match.matchResult.toLowerCase();
        const predictedWinnerLower = finalWinner.toLowerCase();

        // Pass if the result contains the name of the predicted winner (e.g. "India won by 10 runs" contains "india")
        const isPassed = matchResultLower.includes(predictedWinnerLower) || matchResultLower.includes(predictedWinnerLower.split(" ")[0]);

        const res = await SendPredictionResult(match.prediction, isPassed, match.matchResult);
        
        if (res) {
          await Match.updateOne(
            { _id: match._id },
            { $set: { isResultMessageSent: true } }
          );
          messagesSent++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed Telegram notifications. Messages sent: ${messagesSent}`,
    });
  } catch (error) {
    console.error("TELEGRAM NOTIFICATION CRON ERROR ", error);

    return NextResponse.json(
      {
        success: false,
        error: FormatErrorMessage(error),
      },
      { status: 500 },
    );
  }
};
