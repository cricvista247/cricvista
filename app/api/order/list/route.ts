import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import Order from "../OrderModel";
import mongoose from "mongoose";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const reqData = await request.json();

    let query: any = [];
    if (reqData.hasOwnProperty("ordertype") && reqData.ordertype) {
      query.push({
        ordertype: reqData.ordertype,
      });
    }

    if (reqData.hasOwnProperty("status") && reqData.status) {
      query.push({
        status: reqData.status,
      });
    }
    if (reqData.hasOwnProperty("username") && reqData.username) {
      query.push({
        "user.username": { $regex: reqData.username, $options: "i" },
      });
    }
    if (reqData.hasOwnProperty("email") && reqData.email) {
      query.push({
        "user.email": { $regex: reqData.email, $options: "i" },
      });
    }
    if (reqData.hasOwnProperty("mobileNumber") && reqData.mobileNumber) {
      query.push({
        "user.mobileNumber": { $regex: reqData.mobileNumber, $options: "i" },
      });
    }
    if (reqData.hasOwnProperty("orderNumber") && reqData.orderNumber) {
      query.push({
        orderNumber: { $regex: reqData.orderNumber, $options: "i" },
      });
    }

    let pipeline: any[] = [
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
      {
        $match: {
          $and: query.length > 0 ? query : [{}],
        },
      },
    ];

    if (reqData.hasOwnProperty("userId") && reqData.userId) {
      query.push({
        userId: new mongoose.Types.ObjectId(reqData.userId),
      });
    }

    const count = await Order.aggregate([...pipeline, { $count: "total" }]);
    const total = count.length > 0 ? count[0].total : 0;

    if (reqData.hasOwnProperty("page") && reqData.hasOwnProperty("limit")) {
      const page = reqData.page;
      const limit = reqData.limit;
      const skip: any = page * limit - limit;
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    const data = await Order.aggregate([
      ...pipeline,
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    const totalFailedOrder = data.filter(
      (item: any) => item.status === "failed"
    );
    const totalCompletedOrder = data.filter(
      (item: any) => item.status === "completed"
    );
    const totalRevenue = data
      .filter(
        (item: any) =>
          item.paymentStatus &&
          item.status === "completed" &&
          item.ordertype === "purchase"
      )
      .reduce((sum: number, order: any) => sum + order.price, 0);
    return NextResponse.json(
      {
        success: true,
        data: data,
        count: total,
        overview: [
          { value: total, name: "Total Orders" },
          { value: totalCompletedOrder.length, name: "Completed" },
          { value: totalFailedOrder.length, name: "Failed" },
          { value: totalRevenue, name: "Revenue" },
        ],
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
