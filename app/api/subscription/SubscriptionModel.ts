import mongoose, { Schema, Document, Model } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    credits: { type: Number, required: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    popular: { type: Boolean, default: false },
    icon: { type: String, default: null },
    color: { type: String, default: null },
    bgColor: { type: String, default: null },
    borderColor: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
