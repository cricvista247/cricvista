import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    orderNumber: String,
    ordertype: {
      type: String,
      enum: ["purchase", "prediction", "credit"],
      default: "purchase",
    },
    price: { type: Number, default: null },
    matchId: {
      type: Schema.Types.ObjectId,
      // ref: "Match", // 👈 your match model name
      default: null,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    userId: Schema.Types.ObjectId,
    credits: { type: Number, default: null },
    paymentStatus: { type: Boolean, default: false },
    paymentId: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "refunded", "completed", "failed"],
      default: "pending",
    },
    paymentMode: {
      type: String,
      default: null,
      enum: ["UPI", "NETBANKING", "QRCODE", "PROMOTION", "DEDUCTION"],
    },
    remarks: { type: String, default: null },
    paymentDetails: { type: Array, default: null },
    paymentDate: { type: Date, default: null },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
