import mongoose, { Schema, Types } from "mongoose";
const SupportSchema = new Schema(
  {
    userId: Schema.Types.ObjectId,
    category: String,
    subject: String,
    description: String,
    ticketNumber: String,
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "low",
    },
    message: [
      {
        text: String,
        replyAt: Date,
        replyBy: Schema.Types.ObjectId,
        ticketStatus: {
          type: String,
          enum: ["open", "in-progress", "resolved", "closed"],
          default: "open",
        },
        isRead: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const SupportTicket =
  mongoose.models.SupportTicket ||
  mongoose.model("SupportTicket", SupportSchema);
export default SupportTicket;
