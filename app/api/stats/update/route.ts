import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { statsValidationSchema } from "../StatsSchema";
import Stats from "../StatsModel";
import { PreparedStatsData } from "../StatsData";
import { FormatErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.json();
    await statsValidationSchema.validate(data, { abortEarly: false });

    const prepareData = PreparedStatsData(data);
    const updateSub = await Stats.findByIdAndUpdate(data.statsId, prepareData, {
      new: true,
    });

    if (!updateSub) {
      return NextResponse.json(
        { success: false, message: "Stats not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        subscription: updateSub,
        message: "Stats updated successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
}
