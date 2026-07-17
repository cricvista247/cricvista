import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../db";
import User from "../UserModel";
import Notification from "../../notification/NotificationModel";
import { FormatErrorMessage } from "@/lib/utils";
import { MailSend } from "@/lib/MailSend";
import {
  AdminFreeCreditsEmail,
  AdminDepositCreditsEmail,
} from "@/components/template/UserTemp";

const SOCKET_URL =
  process.env.SOCKET_SERVER_URL ||
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  `http://127.0.0.1:${process.env.PORT || 3004}`;

const notifySocket = async (endpoint: string, payload: any) => {
  try {
    await fetch(`${SOCKET_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Socket server not running — ignore
  }
};

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const body = await request.json();
    const xUser = request.headers.get("x-user");

    const loggedInUser = xUser ? JSON.parse(xUser) : null;
    if (!loggedInUser?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (loggedInUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const targetUser = await User.findById({
      _id: new mongoose.Types.ObjectId(body.userId),
    });
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const creditType = body.type || "offer";
    const updatedCredits = (targetUser.credits || 0) + (body.credits || 0);

    const updateuserCredits = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(body.userId) },
      { $set: { credits: updatedCredits } },
    );

    if (updateuserCredits) {
      // Real-time balance update via socket
      notifySocket("/credits-updated", {
        userId: body.userId,
        credits: updatedCredits,
      });

      // Create in-app notification
      const notifTitle =
        creditType === "deposit"
          ? `Deposit of ₹${body.amount || 0} successful`
          : `${body.credits} free credits added`;
      const notifMessage =
        creditType === "deposit"
          ? `Your deposit of ₹${body.amount || 0} for ${body.credits} tokens was successful. Current balance: ${updatedCredits} tokens.`
          : `${body.credits} free tokens have been added to your account by admin. Current balance: ${updatedCredits} tokens.`;

      const notification = await Notification.create({
        userId: body.userId,
        type: creditType === "deposit" ? "payment" : "credit",
        title: notifTitle,
        message: notifMessage,
        link: "/subscription",
      });

      // Real-time notification via socket
      notifySocket("/send-notification", {
        userId: body.userId,
        notification: {
          _id: notification._id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          link: notification.link,
          isRead: false,
          createdAt: notification.createdAt,
        },
      });

      if (creditType === "deposit") {
        const depositAmount = body.amount || 0;
        const emailData = {
          user: {
            name: targetUser.name,
            email: targetUser.email,
          },
          credits: updatedCredits,
          totalCreditsAdded: body.credits,
          amount: depositAmount,
          adminName: "CricVista Team",
          appUrl: process.env.NEXT_PUBLIC_API_URL,
          supportEmail: process.env.NEXT_PUBLIC_EMAIL,
          supportPhone: process.env.NEXT_PUBLIC_MOBILE,
        };

        const emailHtml = AdminDepositCreditsEmail(emailData);
        await MailSend({
          to: [targetUser.email],
          subject: `✅ Deposit Confirmed - ₹${depositAmount} for ${body.credits} Tokens`,
          html: emailHtml,
        });
      } else {
        const emailData = {
          user: {
            name: targetUser.name,
            email: targetUser.email,
          },
          credits: updatedCredits,
          totalCreditsAdded: body.credits,
          reason:
            "CricVista added bonus tokens to your account as a special gesture.",
          adminName: "CricVista Team",
          appUrl: process.env.NEXT_PUBLIC_API_URL,
          supportEmail: process.env.NEXT_PUBLIC_EMAIL,
          supportPhone: process.env.NEXT_PUBLIC_MOBILE,
        };

        const emailHtml = AdminFreeCreditsEmail(emailData);
        await MailSend({
          to: [targetUser.email],
          subject: `🎁 ${body.credits} Free Credits Added to Your CricVista Account!`,
          html: emailHtml,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Credits send successfully",
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
