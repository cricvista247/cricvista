import mongoose, { Schema } from "mongoose";

const StatsSchema = new mongoose.Schema(
  {
    originalName: String,
    publicName: String,
    type: {
      type: String,
      enum: ["stadium", "player"],
      default: "player",
    },
  },
  { timestamps: true }
);

const Stats = mongoose.models?.Stats || mongoose.model("Stats", StatsSchema);

export default Stats;
