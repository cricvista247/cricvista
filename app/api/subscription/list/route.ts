import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import Subscription from "../SubscriptionModel";
import { FormatErrorMessage } from "@/lib/utils";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const subscriptions = await Subscription.find().sort({ price: 1 });
    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
}
