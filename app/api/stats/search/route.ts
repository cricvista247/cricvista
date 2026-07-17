import {
  FormatErrorMessage,
  GetPSearchList,
  GetStadiumList,
} from "@/lib/utils";
import dbConnect from "../../db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const data = await req.json();
    let responseData: any[] = [];
    if (data.type === "player") {
      responseData = await GetPSearchList(data.srchValue);
    }
    if (data.type === "stadium") {
      responseData = await GetStadiumList(data.srchValue);
    }

    return NextResponse.json(
      { succes: true, data: responseData },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
