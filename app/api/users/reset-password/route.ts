import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import User from "../UserModel";
import { GenerateOTP, GenerateOTPToken, VerifyOTPToken } from "../UtilAuth";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {
  ResetPasswordSuccessTem,
  ResetPasswordTem,
} from "@/components/template/reset-password-tem";
import { MailSend } from "@/lib/MailSend";

export const POST = async (request: NextRequest) => {
  await dbConnect();

  try {
    const reqData = await request.json();

    const user = await User.findOne({
      $or: [
        { email: reqData.userId },
        { username: reqData.userId },
        { mobileNumber: Number(reqData.userId) },
      ],
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 404 }
      );
    }
    if (reqData.type === "generate-otp") {
      // const date = new Date();
      // const otp = GenerateOTP(date);
      // await MailSend({
      //   to: [user.email],
      //   subject: "OTP generated for password reset",
      //   html: ResetPasswordTem({
      //     username: user.username,
      //     otp: otp,
      //   }),
      // });
      // return NextResponse.json(
      //   {
      //     success: true,
      //     message: "OTP generated successfully!",
      //     createdAt: date,
      //   },
      //   { status: 200 }
      // );

      let date = new Date();
      const otp = GenerateOTP(date);
      const otpToken = await GenerateOTPToken({
        createdAt: date,
        email: user.email,
        otp: otp,
        isVerified: false,
      });
      if (otpToken) {
        await MailSend({
          to: [user.email],
          subject: "Unlock Predictions - CricVista Email Verification OTP",
          html: ResetPasswordTem({
            username: user.username,
            otp: otp,
          }),
        });
      }

      const response = NextResponse.json(
        {
          success: true,
          message: "OTP sent successfully.",
        },
        { status: 200 }
      );

      response.cookies.set({
        name: "otp_token",
        value: otpToken,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 300,
      });

      return response;
    }
    if (reqData.type === "verify-otp") {
      const newOtpToken: any = await VerifyOTPToken({
        email: user.email,
        otp: reqData.otp,
      });

      if (!newOtpToken.isSuccess) {
        return NextResponse.json(
          {
            success: false,
            message: newOtpToken.message,
          },
          { status: newOtpToken.code }
        );
      }

      const response = NextResponse.json(
        {
          success: true,
          message: "OTP sent successfully.",
        },
        { status: 200 }
      );

      response.cookies.set({
        name: "otp_token",
        value: newOtpToken.token,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 300,
      });

      return response;
    } else if (reqData.type === "reset-password") {
      if (reqData.hasOwnProperty("oldPassword")) {
        const isValidPassword = await bcrypt.compare(
          reqData.oldPassword,
          user.password
        );
        if (!isValidPassword) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid old password.",
            },
            { status: 403 }
          );
        }
      } else {
        const checkOtpToken: any = await VerifyOTPToken({
          email: user.email,
          otp: reqData.otp,
        });
        if (!checkOtpToken.isSuccess || !checkOtpToken.payload.isVerified) {
          return NextResponse.json(
            {
              success: false,
              message: checkOtpToken.message || "OTP not verified!",
            },
            { status: checkOtpToken.code || 400 }
          );
        }
      }
      const password = await bcrypt.hash(reqData.password, 10);
      const updateUser = await User.updateOne(
        { _id: new mongoose.Types.ObjectId(user._id) },
        { $set: { password } }
      );
      if (updateUser) {
        await MailSend({
          to: [user.email],
          subject: "Password reset successfully!",
          html: ResetPasswordSuccessTem({
            email: user.email,
            username: user.username,
          }),
        });
        return NextResponse.json(
          {
            success: true,
            message: "Password reset successfully!",
          },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request!",
        },
        { status: 400 }
      );
    }
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
