import moment from "moment-timezone";

/**
 * Convert Crex IST date + time → All UTC fields
 */
export const normalizeCrexMatchTime = (
  matchDate: string,
  startTime: string,
  timezone?: string,
) => {
  // IST → UTC
  const utcMoment = moment
    .tz(`${matchDate} ${startTime}`, "ddd, DD MMM YYYY hh:mm A", "Asia/Kolkata")
    .utc();

  return {
    // Mongo date
    formatDate: utcMoment.toDate(),

    // For readable storage (optional but you asked)
    matchDate: utcMoment.format("ddd, DD MMM YYYY"),
    startTime: utcMoment.format("hh:mm A"),
  };
};
