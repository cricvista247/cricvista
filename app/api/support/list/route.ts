import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import SupportTicket from "../SupportModel";
import mongoose from "mongoose";

export const POST = async (request: NextRequest) => {
  await dbConnect();

  try {
    const reqData = await request.json();

    // 🔹 Build match conditions
    let matchConditions: any = {};

    if (reqData.search) {
      matchConditions.$or = [
        { "user.name": { $regex: reqData.search, $options: "i" } },
        { "user.email": { $regex: reqData.search, $options: "i" } },
        { ticketNumber: { $regex: reqData.search, $options: "i" } },
      ];
    }

    if (reqData.userId) {
      matchConditions.userId = new mongoose.Types.ObjectId(reqData.userId);
    }
    if (reqData.ticketId) {
      matchConditions._id = new mongoose.Types.ObjectId(reqData.ticketId);
    }

    if (reqData.status) {
      matchConditions.status = { $regex: reqData.status, $options: "i" };
    }

    // 🔹 Base pipeline
    let pipeline: any[] = [
      {
        $match: Object.keys(matchConditions).length > 0 ? matchConditions : {},
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
        $lookup: {
          from: "users",
          localField: "message.replyBy",
          foreignField: "_id",
          as: "replyUsers",
        },
      },
      {
        $addFields: {
          message: {
            $map: {
              input: "$message",
              as: "msg",
              in: {
                _id: "$$msg._id",
                text: "$$msg.text",
                replyAt: "$$msg.replyAt",
                ticketStatus: "$$msg.ticketStatus",
                replyBy: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$replyUsers",
                        as: "ru",
                        cond: {
                          $eq: ["$$ru._id", "$$msg.replyBy"],
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          category: 1,
          subject: 1,
          description: 1,
          ticketNumber: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            _id: 1,
            name: 1,
            username: 1,
            email: 1,
            mobile: 1,
          },
          message: {
            _id: 1,
            text: 1,
            replyAt: 1,
            ticketStatus: 1,
            replyBy: {
              _id: 1,
              name: 1,
              username: 1,
              email: 1,
              mobile: 1,
            },
          },
        },
      },
    ];

    // if (Object.keys(matchConditions).length > 0) {
    //   pipeline.push({ $match: matchConditions });
    // }

    // 🔹 Count total
    const count = await SupportTicket.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);
    const total = count.length > 0 ? count[0].total : 0;

    // 🔹 Pagination
    if (reqData.page && reqData.limit) {
      const page = Number(reqData.page) || 1;
      const limit = Number(reqData.limit) || 10;
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    // 🔹 Sort latest first
    pipeline.push({ $sort: { createdAt: -1 } });

    const data = await SupportTicket.aggregate(pipeline);

    return NextResponse.json(
      { success: true, data, count: total },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
