import moment from "moment-timezone";

/**
 * Convert stored UTC date → user timezone
 */
export const utcToUser = (utcDate: Date, timezone: string) => {
  const m = moment.utc(utcDate).tz(timezone);

  return {
    matchDate: m.format("ddd, DD MMM YYYY"),
    startTime: m.format("hh:mm A"),
    matchDateTime: m.format("DD MMM YYYY, hh:mm A"),
  };
};
