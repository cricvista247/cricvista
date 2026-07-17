import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../db";
import { FormatErrorMessage } from "@/lib/utils";
import { AdvanceMatchDetails } from "./AdvanceMatchDetails";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const reqData = await request.json();
    const advanceMatchDetails = await AdvanceMatchDetails(reqData.url);
  } catch (error: any) {
    const statusCode = error.statusCode || error.status || 500; // fallback to 500
    return NextResponse.json(
      {
        success: false,
        error: FormatErrorMessage(error),
      },
      { status: statusCode }
    );
  }
};
