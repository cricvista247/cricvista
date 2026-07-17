import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../db";
import User from "../UserModel";
import { FormatErrorMessage } from "@/lib/utils";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const reqData = await request.json();

    let query: any = [
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orderDetails",
        },
      },
    ];

    const data = await User.aggregate([
      {
        $match: reqData.hasOwnProperty("userId")
          ? {
              _id: new mongoose.Types.ObjectId(reqData.userId),
            }
          : {},
      },

      ...query,
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: { password: 0 },
      },
    ]);

    return NextResponse.json(
      { success: true, message: "Data fetched successfully", data: data },
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
