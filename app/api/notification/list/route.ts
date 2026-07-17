import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import Notification from "../NotificationModel";

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

    const userId = reqData.userId || loggedInUser._id;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return NextResponse.json(
      {
        success: true,
        data: notifications,
        unreadCount,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
