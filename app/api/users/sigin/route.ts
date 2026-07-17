import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, ApiResponse } from "@/types/api";
import { generateToken } from "../UtilAuth";
import dbConnect from "../../db";
import User from "../UserModel";
import bcrypt from "bcrypt";
import { UserData } from "../UserData";
import { FormatErrorMessage } from "@/lib/utils";
import { serialize } from "cookie";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body: LoginRequest = await request.json();
    const { userId, password } = body;

    // Validation
    if (!userId || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        } as ApiResponse,
        { status: 400 },
      );
    }

    // Find user
    // Match by username, email or mobileNumber
    const user = await User.findOne({
      $or: [
        { email: userId },
        { username: userId },
        { mobileNumber: Number(userId) },
      ],
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found!",
        } as ApiResponse,
        { status: 401 },
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password.",
        } as ApiResponse,
        { status: 403 },
      );
    }

    // Generate token
    const prepareResponse = UserData(user);

    const accessToken = await generateToken(
      {
        ...prepareResponse,
        _id: user._id,
      },
      "15m",
    );

    const refreshToken = await generateToken(
      {
        ...prepareResponse,
        _id: user._id,
      },
      "20d",
    );

    const cookie = serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // allow insecure on localhost
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // safe for local dev
      path: "/",
      maxAge: 60 * 60 * 24 * 20, // 20 day
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        data: {
          user: { ...prepareResponse, _id: user._id },
          token: accessToken,
        },
      },
      {
        status: 200,
        headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: FormatErrorMessage(error),
      } as ApiResponse,
      { status: 500 },
    );
  }
}
