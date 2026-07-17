import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../db";
import User from "../UserModel";
import { FormatErrorMessage } from "@/lib/utils";
import moment from "moment";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const body = await request.json();
    const xUser = request.headers.get("x-user");
    const loggedInUser = xUser ? JSON.parse(xUser) : null;
    if (!loggedInUser?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let targetUser;
    let updatedCredits;

    // ✅ Case 1: Daily ad reward (user claims credit for the day)
    if (body.type === "daily") {
      targetUser = await User.findOne({
        _id: new mongoose.Types.ObjectId(loggedInUser._id),
      });
      if (!targetUser) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      // Check last claim date
      const today = moment();
      const lastClaim = targetUser.lastAdCreditDate
        ? moment(targetUser.lastAdCreditDate)
        : null;

      if (lastClaim && lastClaim.isSame(today, "day")) {
        return NextResponse.json(
          { success: false, message: "Already claimed today's free credit." },
          { status: 400 }
        );
      }

      updatedCredits = (targetUser.credits || 0) + 1;

      await User.updateOne(
        { _id: new mongoose.Types.ObjectId(loggedInUser._id) },
        { $set: { credits: updatedCredits, lastAdCreditDate: today } }
      );
    }

    // ✅ Case 2: Purchase approval (admin grants credits to another user)
    else if (body.type === "purchase") {
      if (loggedInUser.role !== "admin") {
        return NextResponse.json(
          { success: false, message: "Forbidden" },
          { status: 403 }
        );
      }

      targetUser = await User.findById({
        _id: new mongoose.Types.ObjectId(body.userId),
      });
      if (!targetUser) {
        return NextResponse.json(
          { success: false, message: "Target user not found" },
          { status: 404 }
        );
      }

      updatedCredits = (targetUser.credits || 0) + (body.credits || 0);

      await User.updateOne(
        { _id: new mongoose.Types.ObjectId(body.userId) },
        { $set: { credits: updatedCredits } }
      );
    }

    // ❌ Invalid type
    else {
      return NextResponse.json(
        { success: false, message: "Invalid type parameter" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Credits updated successfully",
        data: { credits: updatedCredits },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
