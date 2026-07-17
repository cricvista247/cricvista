import moment from "moment-timezone";

/**
 * Get timezone from request
 * manual hit -> header timezone
 * cron -> fallback UTC
 */
export const getRequestTimezone = (req?: Request | any): string => {
  try {
    if (!req) return "UTC";

    const tz =
      req.headers?.get?.("x-timezone") ||
      req.headers?.get?.("timezone") ||
      req.headers?.["x-timezone"] ||
      req.headers?.["timezone"];

    return tz || "UTC";
  } catch {
    return "UTC";
  }
};

/**
 * Convert CREX displayed time -> UTC Date
 * CREX always renders time in viewer timezone
 */
export const crexToUTC = (
  matchDate: string,
  startTime: string,
  sourceTimezone: string = "UTC",
) => {
  const localMoment = moment.tz(
    `${matchDate} ${startTime}`,
    "ddd, DD MMM YYYY hh:mm A",
    sourceTimezone,
  );

  const utcMoment = localMoment.clone().utc();

  return {
    utcDate: utcMoment.toDate(), // Mongo store
    utcISO: utcMoment.toISOString(), // debugging
    utcMatchDate: utcMoment.format("ddd, DD MMM YYYY"),
    utcStartTime: utcMoment.format("hh:mm A"),
    sourceTimezone,
  };
};

/**
 * Check match started (always UTC)
 */
export const isMatchStarted = (utcDate: Date) => {
  return moment.utc().isAfter(moment.utc(utcDate));
};

/**
 * Convert UTC -> user timezone (for frontend APIs)
 */
export const utcToUserTime = (utcDate: Date, timezone: string) => {
  return moment.utc(utcDate).tz(timezone).format("ddd, DD MMM YYYY hh:mm A");
};
