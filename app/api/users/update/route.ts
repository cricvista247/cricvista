import { NextRequest, NextResponse } from "next/server";

import mongoose from "mongoose";
import dbConnect from "../../db";
import { UserData } from "../UserData";
import User from "../UserModel";
import { FormatErrorMessage } from "@/lib/utils";
import { MailSend } from "@/lib/MailSend";
import { UserAccountClosureTemp } from "@/components/template/UserTemp";
import moment from "moment";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const body = await request.json();
    const xUser = request.headers.get("x-user");
    const loggedInUser = xUser ? JSON.parse(xUser) : null;

    let updateData = {};
    if (body.name) {
      updateData = { ...updateData, name: body.name };
    }
    if (body.email) {
      const findEmail = await User.findOne({
        email: body.email,
        _id: { $ne: new mongoose.Types.ObjectId(body.userId) },
      });
      if (findEmail) {
        return NextResponse.json(
          { success: false, message: "Email already exists" },
          { status: 400 }
        );
      } else {
        updateData = { ...updateData, email: body.email };
      }
    }
    if (body.mobileNumber) {
      const findMobile = await User.findOne({
        mobileNumber: body.mobileNumber,
        _id: { $ne: new mongoose.Types.ObjectId(body.userId) },
      });
      if (findMobile) {
        return NextResponse.json(
          { success: false, message: "Mobile number already exists" },
          { status: 400 }
        );
      } else {
        updateData = { ...updateData, mobileNumber: body.mobileNumber };
      }
    }
    if (loggedInUser.role === "admin") {
      if (body.hasOwnProperty("isActive")) {
        updateData = { ...updateData, isActive: body.isActive };
      }
      if (body.status) {
        updateData = { ...updateData, status: body.status };
      }
      if (body.remarks) {
        updateData = { ...updateData, remarks: body.remarks };
      }
    }

    const update = await User.updateOne(
      {
        _id: new mongoose.Types.ObjectId(body.userId),
      },
      { $set: updateData }
    );

    if (update) {
      if (body.isActive === false && body.status !== "active") {
        const findUser = await User.findOne({
          _id: new mongoose.Types.ObjectId(body.userId),
        });
        await MailSend({
          to: [findUser.email],
          subject: `User Account ${
            findUser.status === "banned" ? "Banned" : "Suspension"
          } (${findUser.username}) - CricVista`,
          html: UserAccountClosureTemp({
            status: findUser.status || "",
            username: findUser.username,
            date: moment(findUser.updatedAt).format("MMMM DD, YYYY HH:mm"),
            reason: findUser.remarks || "NA",
          }),
        });
      }
    }

    return NextResponse.json(
      { success: true, message: "User updated successfully", data: update },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
};
