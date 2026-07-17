import { NextRequest, NextResponse } from "next/server";
import SupportTicket from "../SupportModel";
import mongoose from "mongoose";
import { FormatErrorMessage } from "@/lib/utils";
import dbConnect from "../../db";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket number is required",
        },
        { status: 400 }
      );
    }

    const ticketDetails = await SupportTicket.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "user.password": 0,
        },
      },
    ]);
    return NextResponse.json(
      {
        success: true,
        message: "Order fetched successfully",
        data: ticketDetails.length > 0 ? ticketDetails[0] : {},
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: FormatErrorMessage(error),
      },
      { status: 500 }
    );
  }
};
