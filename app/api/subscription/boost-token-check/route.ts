import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import User from "../../users/UserModel";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const data = await req.json();

    const findUser = await User.findById(data._id);

    if (!findUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // 👉 Get today start (IST safe)
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1);

    const lastPurchase = findUser.dailyBoostTokenPurchaseDate;

    //  Already purchased today
    if (
      lastPurchase &&
      lastPurchase >= todayStart &&
      lastPurchase < tomorrowStart
    ) {
      return NextResponse.json(
        {
          success: true,
          data: { isBuyAble: false },
          message: "You have already purchased today",
        },
        { status: 200 },
      );
    }

    // ✅ Allow purchase
    // findUser.dailyBoostTokenPurchaseDate = new Date();
    // await findUser.save();

    return NextResponse.json(
      {
        success: true,
        data: { isBuyAble: true },
        message: "Token purchased successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
}
