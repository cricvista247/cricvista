import moment from "moment-timezone";

/**
 * Returns current UTC time.
 * If timezone provided → convert caller local time → UTC
 * If not provided → assume server already UTC (cron)
 */
export const getRequestNowUTC = (timezone?: string | null): Date => {
  if (!timezone) {
    // Cron case (server UTC)
    return new Date();
  }

  try {
    // Convert user's local current time to UTC
    return moment.tz(moment(), timezone).utc().toDate();
  } catch {
    return new Date();
  }
};
