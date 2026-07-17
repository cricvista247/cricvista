import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "6bf6680598a374557023eabfc280e3e930bf080b"
);
export async function generateToken(payload: any, expiresIn: string) {
  let data = {
    _id: payload._id.toString(),
    name: payload.name,
    email: payload.email,
    mobileNumber: payload.mobileNumber,
    username: payload.username,
    role: payload.role,
    isActive: payload.isActive,
    credits: Number(payload.credits ?? 0),
    agreeToTerms: payload.agreeToTerms,
  };

  return await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" }) // Algorithm for HMAC
    .setExpirationTime(expiresIn) // Expiration time
    .sign(SECRET_KEY);
}

export const GenerateOTP = (date: any) => {
  const timestamp = date.getTime();

  // Create a 6 digit OTP by taking modulo
  const otp = String(timestamp % 1_000_000).padStart(6, "0");

  return otp;
};

export async function GenerateOTPToken(payload: any) {
  let data = {
    createdAt: payload.createdAt,
    email: payload.email,
    otp: payload.otp,
    isVerified: payload.isVerified,
  };

  return await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" }) // Algorithm for HMAC
    .setExpirationTime("5m") // Expiration time
    .sign(SECRET_KEY);
}

export const VerifyOTPToken = async (body: any) => {
  const cookieStore = await cookies();
  const otpToken = cookieStore.get("otp_token")?.value;

  if (!otpToken) {
    return {
      isSuccess: false,
      message: "OTP token is missing or expired.",
      code: 400,
    };
    // return NextResponse.json(
    //   {
    //     success: false,
    //     message: "OTP token is missing or expired.",
    //   },
    //   { status: 400 }
    // );
  }
  const payload: any = (await jwtVerify(otpToken, SECRET_KEY)).payload;

  // Convert createdAt from token → Date
  const createdAt = new Date(payload.createdAt);

  const otp = GenerateOTP(createdAt);

  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  if (
    diffMinutes > 5 ||
    payload.otp !== body.otp ||
    payload.email !== body.email ||
    payload.otp !== otp
  ) {
    if (diffMinutes > 5) {
      return { isSuccess: false, message: "OTP has expired!", code: 400 };
    }

    if (payload.email !== body.email) {
      return { isSuccess: false, message: "Email does not match!", code: 400 };
    }

    if (payload.otp !== body.otp) {
      return { isSuccess: false, message: "Invalid OTP!", code: 400 };
    }

    if (payload.otp !== otp) {
      return {
        isSuccess: false,
        message: "OTP is incorrect or manipulated!",
        code: 400,
      };
    }
  } else {
    const newOtpToken = await GenerateOTPToken({
      createdAt: createdAt,
      email: body.email,
      otp: otp,
      isVerified: true,
    });

    return { isSuccess: true, token: newOtpToken, payload: payload };
  }
};
