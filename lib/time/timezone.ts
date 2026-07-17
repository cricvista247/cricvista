import moment from "moment-timezone";

/* ======================================================
   GET USER TIMEZONE
====================================================== */
export const getUserTimezone = (body?: any, req?: any): string => {
  return (
    body?.timezone ||
    req?.headers?.get?.("x-timezone") ||
    req?.headers?.get?.("timezone") ||
    "UTC"
  );
};

/* ======================================================
   USER SELECTED DAY → UTC RANGE
   (very important for cross-country users)
====================================================== */
export const getUserDayUtcRange = (
  date: string | undefined,
  timezone: string,
) => {
  const base = date ? moment.tz(date, timezone) : moment.tz(timezone);

  return {
    startUtc: base.clone().startOf("day").utc().toDate(),
    endUtc: base.clone().endOf("day").utc().toDate(),
    userMoment: base,
  };
};

/* ======================================================
   UTC → USER TIME (for response)
====================================================== */
export const utcToUser = (utcDate: Date, timezone: string) => {
  const m = moment.utc(utcDate).tz(timezone);

  return {
    matchDate: m.format("ddd, DD MMM YYYY"),
    startTime: m.format("hh:mm A"),
    matchDateTime: m.format("DD MMM YYYY, hh:mm A"),
    iso: m.toISOString(),
  };
};

/* ======================================================
   MATCH STATUS ENGINE (CORE LOGIC)
====================================================== */
export const getMatchStatus = (
  matchUtcDate: Date,
  crexStatus?: string,
  resultText?: string,
): "UPCOMING" | "LIVE" | "COMPLETED" | "ABANDONED" => {
  const start = moment.utc(matchUtcDate);
  const now = moment.utc();
  const result = resultText?.toLowerCase() || "";

  // 1️⃣ real result highest priority
  if (result.includes("abandoned")) return "ABANDONED";
  if (result.includes("won")) return "COMPLETED";

  // 2️⃣ crex live
  if (crexStatus === "LIVE") return "LIVE";

  // 3️⃣ time fallback
  if (start.isAfter(now)) return "UPCOMING";

  // started but result not declared
  return "LIVE";
};
