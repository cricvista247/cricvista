import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { subscriptionValidationSchema } from "../AubscriptionSchema";
import Subscription from "../SubscriptionModel";
import { SubscriptionData } from "../SubscriptionData";
import { FormatErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.json();

    await subscriptionValidationSchema.validate(data, { abortEarly: false });
    const prepareData = SubscriptionData(data);
    const updatedSub = await Subscription.findByIdAndUpdate(
      data.subscriptionId,
      prepareData,
      {
        new: true,
      }
    );
    if (!updatedSub) {
      return NextResponse.json(
        { success: false, message: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, subscription: updatedSub });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
}
