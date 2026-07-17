import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { generateToken, SECRET_KEY } from "../users/UtilAuth";
import { parse, serialize } from "cookie";
import { FormatErrorMessage } from "@/lib/utils";

export const POST = async (request: NextRequest) => {
  try {
    const cookies = parse(request.headers.get("cookie") || "");
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return NextResponse.json(
        { status: false, message: "No refresh token provided" },
        { status: 401 },
      );
    }

    const { payload } = await jwtVerify(refreshToken, SECRET_KEY);

    const newAccessToken = await generateToken({ ...payload }, "20d");

    const newRefreshToken = await generateToken({ ...payload }, "30d");

    // set refresh token in secure cookie
    const cookie = serialize("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // allow insecure on localhost
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // safe for local dev
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    const response = NextResponse.json(
      {
        status: true,
        accessToken: newAccessToken,
        message: "Token generated successfully",
      },
      { status: 200 },
    );
    response.headers.set("Set-Cookie", cookie);
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: FormatErrorMessage(error) },
      { status: 403 },
    );
  }
};
