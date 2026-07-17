import { FormatErrorMessage } from "@/lib/utils";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id") || "";
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_CASH_URL}/orders/${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2025-01-01",
          "x-client-id": process.env.NEXT_PUBLIC_CASH_ID,
          "x-client-secret": process.env.NEXT_PUBLIC_CASH_KEY,
        },
      }
    );

    const orderStatus = response.data.order_status;
    return NextResponse.json({
      status: orderStatus === "PAID" ? "SUCCESS" : "FAILED",
      raw: response.data,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
}
