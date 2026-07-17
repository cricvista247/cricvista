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

    const existing = await Subscription.findOne({ name: data.name });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Subscription with this name already exists",
        },
        { status: 409 }
      );
    }
    const prepareData = SubscriptionData(data);
    const newSub = await Subscription.create(prepareData);

    return NextResponse.json(
      { success: true, subscription: newSub },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
}
