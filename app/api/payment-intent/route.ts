import { FormatErrorMessage } from "@/lib/utils";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const reqData = await request.json();
    const xUser = request.headers.get("x-user");
    const loggedInUser = xUser ? JSON.parse(xUser) : null;
    const headers = {
      "Content-Type": "application/json",
      "x-api-version": "2025-01-01",
      "x-client-id": process.env.NEXT_PUBLIC_CASH_ID,
      "x-client-secret": process.env.NEXT_PUBLIC_CASH_KEY,
    };

    const data = {
      order_id: reqData.orderNumber,
      order_amount: Number(reqData.orderAmount || 0).toFixed(),
      order_currency: "INR",
      customer_details: {
        customer_id: reqData.orderNumber,
        customer_email: loggedInUser?.email || "",
        customer_phone: loggedInUser.mobileNumber || "",
        customer_name: loggedInUser?.name || "",
      },
      order_note: "Your order purchase will be processed soon.",
      order_meta: {
        // return_url: `${process.env.NEXT_PUBLIC_WEB_URL}/payment-success`,
        return_url: `${process.env.NEXT_PUBLIC_WEB_URL}/payment/callback`,
      },
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_CASH_URL}/orders`,
      data,
      {
        headers,
      }
    );
    return Response.json(
      {
        data: response.data,
        success: true,
        message: "Order payment intent created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
}
