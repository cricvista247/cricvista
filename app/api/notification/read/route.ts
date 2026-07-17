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
      await Notification.updateOne(
        {
          _id: new mongoose.Types.ObjectId(reqData.notificationId),
          userId: new mongoose.Types.ObjectId(loggedInUser._id),
        },
        { $set: { isRead: true } }
      );
    } else {
      await Notification.updateMany(
        { userId: new mongoose.Types.ObjectId(loggedInUser._id), isRead: false },
        { $set: { isRead: true } }
      );
    }

    return NextResponse.json(
      { success: true, message: "Notifications marked as read" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
