import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import Notification from "../NotificationModel";
import mongoose from "mongoose";

export const POST = async (request: NextRequest) => {
  await dbConnect();

  try {
    const reqData = await request.json();
    const xUser = request.headers.get("x-user");
    const loggedInUser = xUser ? JSON.parse(xUser) : null;

    if (!loggedInUser?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (reqData.notificationId) {
      await Notification.deleteOne({
        _id: new mongoose.Types.ObjectId(reqData.notificationId),
        userId: new mongoose.Types.ObjectId(loggedInUser._id),
      });
    } else {
      await Notification.deleteMany({
        userId: new mongoose.Types.ObjectId(loggedInUser._id),
      });
    }

    return NextResponse.json(
      { success: true, message: "Notification(s) deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
