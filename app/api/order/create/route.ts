import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { orderValidationSchema } from "../OrderSchema";
import { PrepareOrderData } from "../OrderData";
import { FormatErrorMessage } from "@/lib/utils";
import Order from "../OrderModel";
import mongoose from "mongoose";
import User from "../../users/UserModel";
import Notification from "../../notification/NotificationModel";
import moment from "moment";
import axios from "axios";

/* ================= HELPERS ================= */

const toObjectId = (id: any) =>
  id instanceof mongoose.Types.ObjectId ? id : new mongoose.Types.ObjectId(id);

/* ================= API ================= */

export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    const data = await req.json();
    const xUser = req.headers.get("x-user");
    const loggedInUser = xUser ? JSON.parse(xUser) : null;

    if (!loggedInUser?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await orderValidationSchema.validate(data, { abortEarly: false });

    const userId = toObjectId(loggedInUser._id);

    /* ================= USER ================= */

    const findUser = await User.findById(userId);
    if (!findUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    /* ================= PREDICTION ================= */

    if (data.ordertype === "prediction") {
      const existingPrediction = await Order.findOne({
        userId,
        paymentMode: "DEDUCTION",
        matchId: toObjectId(data.matchId),
      });

      if (existingPrediction) {
        return NextResponse.json(
          { success: true, message: "Already subscribed", credits: 0 },
          { status: 200 },
        );
      }

      if ((findUser.credits ?? 0) < (data.credits ?? 0)) {
        return NextResponse.json(
          { success: false, message: "Not sufficient credits" },
          { status: 402 },
        );
      }
    }

    /* ================= DAILY FREE CREDIT ================= */

    if (data.ordertype === "credit") {
      const startOfDay = moment().startOf("day").toDate();
      const endOfDay = moment().endOf("day").toDate();

      const alreadyClaimed = await Order.findOne({
        userId,
        ordertype: "credit",
        status: "completed",
        paymentMode: "PROMOTION",
        paymentDate: { $gte: startOfDay, $lte: endOfDay },
      });

      if (alreadyClaimed) {
        return NextResponse.json(
          { success: false, message: "Already claimed today's free credit" },
          { status: 400 },
        );
      }
    }

    /* ================= PREPARE ORDER ================= */

    let prepareData = PrepareOrderData({
      ...data,
      userId,
      matchId: data.matchId ? toObjectId(data.matchId) : null,
    });

    /* ================= PAYMENT VERIFY ================= */

    if (data.ordertype === "purchase" && data.paymentIntentId) {
      const duplicatePayment = await Order.findOne({
        paymentId: data.paymentIntentId,
      });

      if (duplicatePayment) {
        return NextResponse.json(
          { success: false, message: "Duplicate payment intent" },
          { status: 409 },
        );
      }

      const headers = {
        "Content-Type": "application/json",
        "x-api-version": "2025-01-01",
        "x-client-id": process.env.NEXT_PUBLIC_CASH_ID!,
        "x-client-secret": process.env.NEXT_PUBLIC_CASH_KEY!,
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CASH_URL}/orders/${data.paymentIntentId}`,
        { headers, timeout: 10000 },
      );

      const orderBody = response.data;
      const orderStatus = (
        orderBody?.order_status ||
        orderBody?.order?.status ||
        orderBody?.status ||
        ""
      )
        .toString()
        .toUpperCase();

      if (orderStatus === "PAID") {
        prepareData.paymentStatus = true;
        prepareData.status = "completed";
        prepareData.subscriptionId = new mongoose.Types.ObjectId(
          data.subscriptionId,
        );

        prepareData.paymentDate = orderBody?.order_time
          ? new Date(orderBody.order_time)
          : new Date();

        prepareData.paymentDetails = orderBody;
      } else {
        prepareData.paymentStatus = false;
        prepareData.status = "failed";
        prepareData.subscriptionId = new mongoose.Types.ObjectId(
          data.subscriptionId,
        );
      }
    }

    /* ================= DUPLICATE ORDER ================= */

    const existingOrder = await Order.findOne({
      orderNumber: prepareData.orderNumber,
    });

    if (existingOrder) {
      return NextResponse.json(
        {
          success: true,
          message: "Order already exists",
          data: existingOrder,
        },
        { status: 200 },
      );
    }

    /* ================= CREATE ORDER ================= */

    const createdOrder = await Order.create({
      ...prepareData,
      _id: new mongoose.Types.ObjectId(),
    });

    /* ================= CREDIT UPDATE ================= */

    if (createdOrder.paymentStatus) {
      if (createdOrder.ordertype === "prediction") {
        await User.updateOne(
          { _id: userId },
          { $inc: { credits: -createdOrder.credits } },
        );
      }

      if (createdOrder.ordertype === "credit") {
        await User.updateOne(
          { _id: userId },
          { $inc: { credits: createdOrder.credits } },
        );
        await Notification.create({
          userId: userId,
          type: "credit",
          title: "Daily tokens received",
          message: `You received ${createdOrder.credits} free prediction tokens.`,
          link: "/matches",
        });
      }

      if (
        createdOrder.ordertype === "purchase" &&
        createdOrder.status === "completed"
      ) {
        await User.updateOne(
          { _id: userId },
          {
            $inc: { credits: createdOrder.credits },
            $set: {
              dailyBoostTokenPurchaseDate:
                data.subscriptionType === "starter" ? new Date() : null,
            },
          },
        );
        await Notification.create({
          userId: userId,
          type: "payment",
          title: "Payment successful",
          message: `Your payment was verified and ${createdOrder.credits} tokens have been added to your account.`,
          link: "/matches",
        });
      }
    }

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: createdOrder,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 },
    );
  }
};
