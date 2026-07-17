import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema(
  {
    teamName: { type: String, default: null },
    teamShortName: { type: String, default: null },
    teamFlagUrl: { type: String, default: null },

    // upcoming => null, completed => "117/8"
    cricketScore: { type: Schema.Types.Mixed, default: null },
  },
  { _id: false },
);

const ScoreItemSchema = new Schema(
  {
    team: { type: String, default: null }, // "GGW"
    run: { type: String, default: null }, // "117/8"
  },
  { _id: false },
);

const ScoreSchema = new Schema(
  {
    score: { type: [ScoreItemSchema], default: [] }, // UPCOMING => [], COMPLETED => list
    result: { type: String, default: "" }, // UPCOMING => "", COMPLETED => "RCBW Won"
  },
  { _id: false },
);

const MatchSchema = new Schema(
  {
    matchId: { type: String, default: null }, // "1XM", "21I"

    url: { type: String, default: null }, // your json "url"

    matchName: { type: String, default: null },
    matchDescription: { type: String, default: null },

    startTime: { type: String, default: null }, // "6:40 AM" OR null
    matchDate: { type: String, default: null }, // "Wed, 21 Jan 2026"

    status: {
      type: String,
      default: null,
      enum: [
        "UPCOMING",
        "LIVE",
        "COMPLETED",
        "ABANDONED",
        "CANCELLED",
        "NO RESULT",
        null,
      ],
    },
    formatDate: { type: Date, default: null }, // "2026-01-21"
    format: { type: String, default: null }, // T20
    sport: { type: String, default: "cricket" },
    teams: { type: [TeamSchema], default: [] },
    details: { type: Object, default: null },
    detailsUpdatedAt: { type: Date, default: null },
    score: { type: ScoreSchema, default: () => ({ score: [], result: "" }) },
  },
  { timestamps: true },
);

const MatchList =
  mongoose.models.MatchList || mongoose.model("MatchList", MatchSchema);

export default MatchList;
