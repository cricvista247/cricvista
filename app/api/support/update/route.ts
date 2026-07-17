import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import SupportTicket from "../SupportModel";
import Notification from "../../notification/NotificationModel";
import mongoose from "mongoose";

export const POST = async (request: NextRequest) => {
  await dbConnect();

  try {
    const reqData = await request.json();
    const xUser = request.headers.get("x-user");
    const loggedInUser = xUser ? JSON.parse(xUser) : null;

    if (!reqData.ticketId) {
      return NextResponse.json(
        { success: false, message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const checkTicket = await SupportTicket.findById(
      new mongoose.Types.ObjectId(reqData.ticketId)
    );

    if (!checkTicket) {
      return NextResponse.json(
        { success: false, message: "Invalid ticket id" },
        { status: 400 }
      );
    }

    // --- Prepare message ---
    const isUser = checkTicket.userId.toString() === loggedInUser._id;
    let messageText = reqData.text || "";

    if (
      (reqData.status === "resolved" && reqData.ticketStatus === "resolved") ||
      (reqData.status === "closed" && reqData.ticketStatus === "closed")
    ) {
      messageText =
        "Ticket closed successfully. This chat will now be closed.";
    }

    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      text: messageText,
      replyAt: new Date(),
      replyBy: new mongoose.Types.ObjectId(loggedInUser._id),
      ticketStatus: reqData.status || "in-progress",
      isRead: !isUser, // if user sends → support unread, if support sends → user unread
    };

    // --- Step 1: Push new message + update status/priority ---
    await SupportTicket.updateOne(
      { _id: new mongoose.Types.ObjectId(reqData.ticketId) },
      {
        $push: { message: newMessage },
        $set: {
          ...(reqData.status ? { status: reqData.status } : {}),
          ...(reqData.priority ? { priority: reqData.priority } : {}),
          ...(reqData.description ? { description: reqData.description } : {}),
          ...(reqData.category ? { category: reqData.category } : {}),
          ...(reqData.subject ? { subject: reqData.subject } : {}),
        },
      }
    );

    // --- Notification: if admin replied, notify the user ---
    if (!isUser && messageText) {
      await Notification.create({
        userId: checkTicket.userId,
        type: "support",
        title: "New reply on your ticket",
        message: messageText.length > 100 ? messageText.slice(0, 100) + "..." : messageText,
        link: `/support?ticketId=${reqData.ticketId}`,
      });
    }

    // --- Step 2: Mark opposite party messages as read ---
    await SupportTicket.updateOne(
      { _id: new mongoose.Types.ObjectId(reqData.ticketId) },
      {
        $set: { "message.$[elem].isRead": true },
      },
      {
        arrayFilters: [
          {
            "elem.isRead": false,
            "elem.replyBy": {
              $ne: new mongoose.Types.ObjectId(loggedInUser._id),
            },
          },
        ],
      }
    );

    // --- Fetch updated ticket with all messages ---
    const updatedTicket = await SupportTicket.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(reqData.ticketId) },
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
    ]);

    return NextResponse.json(
      {
        success: true,
        data: updatedTicket[0],
        message: "Support ticket updated successfully",
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
