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

    const existing = await Stats.findOne({
      originalName: data.originalName,
      publicName: data.publicName,
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Stats with this name already exists",
        },
        { status: 409 }
      );
    }
    const prepareData = PreparedStatsData(data);
    const newSub = await Stats.create(prepareData);
    return NextResponse.json(
      {
        success: true,
        subscription: newSub,
        message: "Stats inserted successfully",
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
