import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage, GenerateTicketNumber } from "@/lib/utils";
import { SupportTicketValidation } from "../SupportSchema";
import mongoose from "mongoose";
import SupportTicket from "../SupportModel";
import User from "../../users/UserModel";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const reqData = await request.json();
    await SupportTicketValidation.validate(reqData, { abortEarly: false });
    const xUser = request.headers.get("x-user");
    const loggedInUser = xUser ? JSON.parse(xUser) : null;

    let userId: any = "";
    if (reqData.username) {
      const findUser = await User.findOne({ username: reqData.username });
      if (!findUser) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }
      userId = new mongoose.Types.ObjectId(findUser._id);
    } else {
      userId = new mongoose.Types.ObjectId(loggedInUser._id);
    }

    const ticketData = {
      userId: userId,
      subject: reqData.subject,
      description: reqData.description,
      ticketNumber: GenerateTicketNumber(reqData.category),
      category: reqData.category,
      status: reqData.status || "in-progress",
      priority: reqData.priority || "medium",
      message: [
        {
          _id: new mongoose.Types.ObjectId(),
          text: reqData.description,
          replyAt: new Date(),
          replyBy: new mongoose.Types.ObjectId(loggedInUser._id),
          ticketStatus: reqData.status || "in-progress",
          isRead: false,
        },
      ],
    };

    const newTicket = await SupportTicket.create(ticketData);
    return NextResponse.json(
      {
        success: true,
        data: newTicket,
        message: "Support ticket created successfully",
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
