import { GetHtml } from "@/lib/utils";
import moment from "moment-timezone";

export const ExtractKeyObject = (text: any, key: any) => {
  if (!text || !key) return null;

  // find the key (try with quotes)
  const keyPatterns = [`"${key}"`, `'${key}'`, key];
  let keyPos = -1;
  let foundPattern = null;
  for (const p of keyPatterns) {
    const idx = text.indexOf(p);
    if (idx !== -1) {
      keyPos = idx;
      foundPattern = p;
      break;
    }
  }
  if (keyPos === -1) return null;

  // find the first '{' after the key (skip whitespace and colon)
  let braceStart = text.indexOf("{", keyPos);
  if (braceStart === -1) return null;

  // walk forward to find matching closing brace while respecting strings and escapes
  let i = braceStart;
  let depth = 0;
  let inString = false;
  let stringChar = null; // " or '
  let prevChar = null;

  while (i < text.length) {
    const ch = text[i];

    if (!inString) {
      if (ch === '"' || ch === "'") {
        inString = true;
        stringChar = ch;
      } else if (ch === "{") {
        depth += 1;
      } else if (ch === "}") {
        depth -= 1;
        if (depth === 0) {
          // include this closing brace and stop
          const jsonText = text.slice(braceStart, i + 1);

          // attempt to clean typical issues (optional)
          let cleaned = jsonText
            // remove stray control characters
            .replace(/\u0000/g, "")
            // sometimes there are trailing commas before closing braces/arrays -> remove them
            .replace(/,\s*([}\]])/g, "$1");

          try {
            return JSON.parse(cleaned);
          } catch (e) {
            // second attempt: try loosening quotes (replace single quotes to double inside)
            try {
              const alt = cleaned.replace(
                /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
                '"$2":',
              );
              return JSON.parse(alt);
            } catch (e2) {
              // failed to parse
              console.error("parse failed for extracted scheduleData:", e, e2);
              return null;
            }
          }
        }
      }
    } else {
      // inside a string
      if (ch === stringChar && prevChar !== "\\") {
        inString = false;
        stringChar = null;
      }
    }

    prevChar = ch;
    i += 1;
  }

  // no match found
  return null;
};

/* ---------- New helper functions for robust parsing ---------- */

/** Find matching close char for an opener (supports nested, respects strings/escapes) */
export const FindMatchingClose = (
  text: string,
  startIdx: number,
  openChar = "[",
  closeChar = "]",
) => {
  let i = startIdx;
  let depth = 0;
  let inString = false;
  let stringChar: string | null = null;
  let prevChar: string | null = null;

  for (; i < text.length; i++) {
    const ch = text[i];

    if (!inString) {
      if (ch === '"' || ch === "'") {
        inString = true;
        stringChar = ch;
      } else if (ch === openChar) {
        depth += 1;
      } else if (ch === closeChar) {
        depth -= 1;
        if (depth === 0) return i;
      }
    } else {
      if (ch === stringChar && prevChar !== "\\") {
        inString = false;
        stringChar = null;
      }
    }

    prevChar = ch;
  }
  return -1;
};

/** Split top-level array contents into items (handles nested arrays/objects and strings) */
export const SplitTopLevelArrayItems = (arrayText: string) => {
  const txt = arrayText.trim().replace(/^\[/, "").replace(/\]$/, "");
  const items: string[] = [];

  let i = 0;
  let start = 0;
  let inString = false;
  let stringChar: string | null = null;
  let depth = 0;
  let prevChar: string | null = null;

  while (i < txt.length) {
    const ch = txt[i];

    if (!inString) {
      if (ch === '"' || ch === "'") {
        inString = true;
        stringChar = ch;
      } else if (ch === "[" || ch === "{" || ch === "(") {
        depth += 1;
      } else if (ch === "]" || ch === "}" || ch === ")") {
        depth -= 1;
      } else if (ch === "," && depth === 0) {
        items.push(txt.slice(start, i).trim());
        start = i + 1;
      }
    } else {
      if (ch === stringChar && prevChar !== "\\") {
        inString = false;
        stringChar = null;
      }
    }

    prevChar = ch;
    i += 1;
  }

  const last = txt.slice(start).trim();
  if (last.length) items.push(last);
  return items;
};

/** Unescape a JS string literal (single- or double-quoted). Returns null if not a quoted string */
export const UnescapeJsStringLiteral = (item: string): string | null => {
  const trimmed = item.trim();
  if (!trimmed) return null;
  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  if ((first === "'" && last === "'") || (first === '"' && last === '"')) {
    const inner = trimmed.slice(1, -1);
    try {
      // Use JSON.parse on a double-quoted wrapper to honor JS escapes
      const wrapper = `"${inner.replace(/"/g, '\\"')}"`;
      return JSON.parse(wrapper);
    } catch (e) {
      // fallback simple unescape
      return inner
        .replace(/\\n/g, "\n")
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
    }
  }
  return null;
};

/* ---------- Updated main function ---------- */

export async function extractAndTransformSchedule(
  fromDate: Date | null,
  timeZone: string = "Asia/Kolkata",
): Promise<any> {
  const $: any = await GetHtml(
    "https://www.cricbuzz.com/cricket-schedule/upcoming-series/all",
  );

  let scheduleData: any = null;

  // iterate script tags and try robust extraction
  $("script").each((index: any, element: any) => {
    const scriptContent = $(element).html();
    if (!scriptContent) return;

    if (
      !scriptContent.includes("matchScheduleMap") &&
      !scriptContent.includes("scheduleData")
    ) {
      return;
    }

    // find the push location
    const pushIdx = scriptContent.indexOf("self.__next_f.push");
    if (pushIdx === -1) return;

    // find the first '[' after push (start of array argument)
    const firstBracket = scriptContent.indexOf("[", pushIdx);
    if (firstBracket === -1) return;

    const bracketClose = FindMatchingClose(
      scriptContent,
      firstBracket,
      "[",
      "]",
    );
    if (bracketClose === -1) return;

    const arrayText = scriptContent.slice(firstBracket, bracketClose + 1);

    // split into top-level items
    const items = SplitTopLevelArrayItems(arrayText);

    // try to unescape any quoted item containing matchScheduleMap
    let candidateStr: string | null = null;
    for (let it of items) {
      const un = UnescapeJsStringLiteral(it);
      if (un && un.includes("matchScheduleMap")) {
        candidateStr = un;
        break;
      }
    }

    // fallback: if not found, check raw items themselves (some builds may not quote heavily)
    if (!candidateStr) {
      for (let it of items) {
        if (it && it.includes("matchScheduleMap")) {
          candidateStr = it;
          break;
        }
      }
    }

    // final fallback: entire arrayText
    if (!candidateStr && arrayText.includes("matchScheduleMap")) {
      candidateStr = arrayText;
    }

    if (!candidateStr) return;

    // Now attempt to find scheduleData object in candidateStr
    const key = "scheduleData";
    const parsed = ExtractKeyObject(candidateStr, key);
    if (parsed) {
      // extractKeyObject returns parsed object when key is found
      scheduleData = parsed;
      return false; // break out of loop
    }

    // If extractKeyObject didn't find, try regex fallback (balanced brace captured earlier inside extractKeyObject)
    const scheduleDataRegex = /"scheduleData":\s*({[\s\S]*})/;
    const sdMatch = candidateStr.match(scheduleDataRegex);
    if (sdMatch && sdMatch[1]) {
      try {
        const cleaned = sdMatch[1]
          .replace(/,\s*([}\]])/g, "$1")
          .replace(/\u0000/g, "");
        scheduleData = JSON.parse(cleaned);
        return false;
      } catch (e) {
        try {
          const alt = sdMatch[1].replace(
            /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
            '"$2":',
          );
          scheduleData = JSON.parse(alt);
          return false;
        } catch (e2) {
          // ignore and continue
        }
      }
    }
  });

  // normalize scheduleData: extract if nested
  if (scheduleData && scheduleData.scheduleData) {
    scheduleData = scheduleData.scheduleData;
  }

  console.log("Schedule data found:", scheduleData ? "Yes" : "No");

  if (!scheduleData || !scheduleData.matchScheduleMap) {
    console.log("No valid schedule data structure found");
    return [];
  }

  // transformation (kept same as your original)
  const matches: any[] = [];

  scheduleData.matchScheduleMap.forEach((day: any) => {
    const scheduleAdWrapper = day.scheduleAdWrapper;

    if (!scheduleAdWrapper || !scheduleAdWrapper.matchScheduleList) {
      return;
    }

    scheduleAdWrapper.matchScheduleList.forEach((series: any) => {
      if (!series.matchInfo) {
        return;
      }

      series.matchInfo.forEach((match: any) => {
        const venue = match.venueInfo || {};

        const makeTeam = (t: any) => ({
          squadId: t.teamId,
          teamName: t.teamName,
          teamShortName: t.teamSName,
          teamFlagUrl: t.imageId
            ? `https://static.cricbuzz.com/a/img/v1/25x18/i1/c${
                t.imageId
              }/${String(t.teamName || "")
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")}.jpg`
            : null,
          isWinner: null,
          color: null,
          cricketScore: null,
          squadNo: null,
        });

        const formatDate = (ms: string | number | null) =>
          ms
            ? moment(Number(ms)).tz(timeZone).format("DD MMM YYYY, HH:mm")
            : null;

        const targetMatch: any = {
          tourId: series.seriesId ?? null,
          tourName: series.seriesName ?? null,
          matchId: match.matchId,
          matchName: null,
          matchDescription: match.matchDesc ?? null,
          originalStartTime:
            match.startDate != null ? String(match.startDate) : null,
          startTime: formatDate(match.startDate),
          endTime: formatDate(match.endDate),
          status: null,
          venue: {
            ground: venue.ground ?? null,
            city: venue.city ?? null,
            country: venue.country ?? null,
            timezone: venue.timezone ?? null,
          },
          tour: series.seriesCategory ?? null,
          format: series.seriesName?.toLowerCase().includes("t10")
            ? "T10"
            : (match.matchFormat ?? null),
          sport: "cricket",
          teams: [makeTeam(match.team1 || {}), makeTeam(match.team2 || {})],
        };

        matches.push(targetMatch);
      });
    });
  });

  const filterData = fromDate
    ? matches.filter(
        (item: any) =>
          moment(item.startTime, "DD MMM YYYY, HH:mm").format("YYYY-MM-DD") ===
          moment(fromDate).format("YYYY-MM-DD"),
      )
    : matches;
  return filterData;
}
