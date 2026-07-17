import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { load } from "cheerio";
import axios from "axios";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const BASE_URL =
//   process.env.NEXT_PUBLIC_BASE_URL || "https://sport-predict-aejs.onrender.com";
export const BASE_URL = " ";

export const CustomStyles = {
  headCells: {
    style: {
      fontWeight: "600",
      fontSize: "14px",
      backgroundColor: "#f9fafb",
    },
  },
  rows: {
    style: {
      minHeight: "56px",
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #e5e7eb",
      paddingTop: "10px",
    },
  },
};

export const GetHtml = async (url: string) => {
  try {
    if (!url) return null;

    const response = await axios.get(url, {
      timeout: 15000,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    if (!response?.data) return null;

    const $ = load(response.data);
    return $;
  } catch (error: any) {
    // log error internally but return empty
    console.error("GetHtml Error:", error?.message || error);
    return null; // return empty instead of throwing
  }
};

export const GetPSearchList = async (searchTerm: string) => {
  const url = "https://advancecricket.com/player-load";
  const formData = new FormData();

  formData.append("text", searchTerm);

  try {
    const { data } = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 15000, // prevent stuck requests
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const $ = load(data);
    const playerList: { name: string; url: string }[] = [];

    $("a[title$='Stats']").each((_, el) => {
      const name = $(el).find("b.card-title").text().trim();
      const href = $(el).attr("href");

      if (name && href) {
        playerList.push({
          name,
          url: href.startsWith("http")
            ? href
            : `https://advancecricket.com${href}`,
        });
      }
    });

    return playerList.length > 0 ? playerList : [];
  } catch (error: any) {
    console.error(
      `GetPSearchList error for "${searchTerm}":`,
      error?.message || error,
    );
    return []; // always return empty on error
  }
};

export const GetStadiumList = async (searchTerm: string) => {
  const url = "https://advancecricket.com/player-load";

  // quick guard
  if (!searchTerm) return [];

  const formData = new FormData();
  formData.append("stadium", searchTerm);

  try {
    const { data } = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 15000, // avoid hanging requests
      validateStatus: (status) => status >= 200 && status < 400, // treat 4xx/5xx as error
    });

    if (!data) return [];

    const $ = load(data);
    const stadiums: { name: string; url: string }[] = [];

    $(".row.row-cols-1.row-cols-lg-3 .col").each((_, element) => {
      const name = $(element).find("b.card-title").text().trim();
      const href = $(element).find("a").attr("href") || "";

      if (name && href) {
        const stadiumUrl = href.startsWith("http")
          ? href
          : `https://advancecricket.com${href}`;
        stadiums.push({ name, url: stadiumUrl });
      }
    });

    return stadiums.length > 0 ? stadiums : [];
  } catch (err) {
    // internal logging only — function never throws
    console.error(
      `GetStadiumList error for "${searchTerm}":`,
      (err as any)?.message || err,
    );
    return [];
  }
};

export const GetTeamList = async (searchTerm: string) => {
  const url = "https://advancecricket.com/player-load";

  if (!searchTerm) return [];

  const formData = new FormData();
  formData.append("team", searchTerm);

  try {
    const { data } = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 15000, // prevents long wait
      validateStatus: (status) => status >= 200 && status < 400,
    });

    if (!data) return [];

    const $ = load(data);
    const teams: { name: string; url: string }[] = [];

    $(".row.row-cols-1.row-cols-lg-3 .col").each((_, element) => {
      const name = $(element).find("b.card-title").text().trim();
      const href = $(element).find("a").attr("href") || "";

      if (name && href) {
        const teamUrl = href.startsWith("http")
          ? href
          : `https://advancecricket.com${href}`;
        teams.push({ name, url: teamUrl });
      }
    });

    return teams.length > 0 ? teams : [];
  } catch (err) {
    console.error(
      `GetTeamList error for "${searchTerm}":`,
      (err as any)?.message || err,
    );
    return [];
  }
};

export const TransAdvanceStatData = (originalData: any) => {
  if (Object.keys(originalData).length > 0) {
    // Extract recent matches
    const recentMatch = originalData.data.teamHeadToHead.segments
      .find((segment: any) => segment.type === "RECENT_FORM")
      .data.squads.map((teamData: any) => {
        return {
          teamName: teamData.team.shortName,
          match: teamData.recentMatches.map((match: any) => {
            const team1 = match.squads[0];
            const team2 = match.squads[1];
            return {
              team1: team1.team.shortName,
              team2: team2.team.shortName,
              format: match.format,
              status: match.status,
              date: match.date,
              location: match.location,
              result: match.result,
              team1Score: team1.score,
              team2Score: team2.score,
              winner: team1.isWinner
                ? team1.team.shortName
                : team2.team.shortName,
            };
          }),
        };
      });

    // Extract head-to-head data
    const h2hData = originalData.data.teamHeadToHead.segments.find(
      (segment: any) => segment.type === "H2H",
    ).data;
    const h2h = {
      h2hStat: h2hData.resultCompare.squads.map((team: any) => ({
        team1: team.team.shortName,
        win: team.gameWon,
        totalPlay: h2hData.resultCompare.totalPlayed,
      })),
      recentH2HMatch: [
        {
          match: h2hData.recentMatches.matches.map((match: any) => {
            const team1 = match.squads[0];
            const team2 = match.squads[1];
            return {
              team1: team1.team.shortName,
              team2: team2.team.shortName,
              format: match.format,
              status: match.status,
              date: match.date,
              location: match.location,
              result: match.result,
              team1Score: team1.score,
              team2Score: team2.score,
              winner: team1.isWinner
                ? team1.team.shortName
                : team2.team.shortName,
            };
          }),
        },
      ],
    };

    // Extract team strengths
    const teamStrengthData = originalData.data.teamHeadToHead.segments.find(
      (segment: any) => segment.type === "TEAM_STRENGTH",
    ).data;
    const teamStrength = teamStrengthData.squadChaseDefend.data[0].values.map(
      (value: any, index: any) => ({
        teamName: teamStrengthData.squads[index].shortName,
        battingFirstWin: `${value}%`,
        bowlingFirstWin: `${teamStrengthData.squadChaseDefend.data[1].values[index]}%`,
      }),
    );

    return {
      recentMatch,
      h2h,
      teamStrength,
    };
  } else {
    return {
      recentMatch: [],
      h2h: {
        h2hStat: [],
        recentH2HMatch: [],
      },
      teamStrength: [],
    };
  }
};

export const CleanName = (name: any) => {
  return (
    name
      // Replace curly apostrophes (’‘) and normal apostrophes (') and capitalize next letter
      .replace(/[’'‘]([a-z])/gi, (_: any, char: any) => char.toUpperCase())
      // Replace hyphens and commas with space
      .replace(/[-,]+/g, " ")
      // Replace multiple spaces with a single space
      .replace(/\s+/g, " ")
      .trim()
  );
};

export const FormatErrorMessage = (error: any) => {
  if (error.errors) {
    // Case 1: error.errors is an array
    if (Array.isArray(error.errors)) {
      return error.errors.join(", ") || "Validation error occurred";
    }

    // Case 2: error.errors is an object (common in Zod/Mongoose validation errors)
    if (typeof error.errors === "object") {
      return Object.values(error.errors)
        .map((err: any) => err?.message || String(err))
        .join(", ");
    }

    // Case 3: already a string
    if (typeof error.errors === "string") {
      return error.errors;
    }
  } else if (error.message) {
    return error.message;
  }

  return "An unknown error occurred";
};

export const getHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

export const getHeadersWithToken = () => {
  const token = localStorage.getItem("token"); // or whatever key you used
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const GenerateTicketNumber = (type: any) => {
  // Mapping option to prefix
  const prefixes: any = {
    general: "GEN",
    payment: "PAY",
    prediction: "PRE",
    technical: "TEC",
    account: "ACC",
  };

  // Get prefix based on type
  const prefix = prefixes[type] || "GEN";

  // Current date (YYYYMMDD)
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  // Random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000);

  // Final Ticket Number
  return `${prefix}${date}${random}`;
};

export const ParseScore = (scoreStr: any) => {
  if (!scoreStr || scoreStr.includes("-0 ()")) return null; // invalid or abandoned
  const [runsWickets, oversStr] = scoreStr.split(" ");
  const [runs, wickets] = runsWickets.split("-").map(Number);
  const overs = parseFloat(oversStr?.replace(/[()]/g, "")) || 0;
  return { runs, wickets, overs };
};

export const FindWinner = (team: any, selectedMatch: any, teamName: any) => {
  const prepareData = team.map((match: any) => {
    const findTeamShortName = selectedMatch?.teams.find(
      (item: any) => item.teamName === teamName,
    )?.teamShortName;

    const team1Score: any = ParseScore(match.team1?.score);
    const team2Score: any = ParseScore(match.team2?.score);

    let winnerType = "";
    let winner = "";

    if (match.result.toLowerCase().includes("abandoned")) {
      winner = "A";
    } else if (!team1Score || !team2Score) {
      winner = "A";
    } else if (match.result.toLowerCase().includes("dls")) {
      if (
        match.result.toLowerCase().includes(`${teamName.toLowerCase()} beat`)
      ) {
        if (match.result.toLowerCase().includes("wickets")) {
          winner = "W";
          winnerType = "bowling";
        } else {
          winner = "W";
          winnerType = "batting";
        }
      } else {
        winner = "L";
        winnerType = "";
      }
    } else if (team1Score.runs > team2Score.runs) {
      winner =
        match.team1?.name.toLowerCase() ===
        findTeamShortName?.toLocaleLowerCase()
          ? "W"
          : "L";
      winnerType = "batting";
    } else if (team2Score.runs > team1Score.runs) {
      winner =
        match.team2?.name.toLowerCase() ===
        findTeamShortName?.toLocaleLowerCase()
          ? "W"
          : "L";
      winnerType = "bowling";
    }

    return { ...match, winner, winnerType };
  });

  return prepareData;
};

export const ToFixed = (num: string | number, digit?: number | string) => {
  const digitValue = digit ? Number(digit) : 2;
  return Number(Number(num).toFixed(digitValue));
};

export const CheckIntValue = (num: any, digit?: number | string) => {
  const digitValue = digit ? Number(digit) : 2;
  const n = Number(num);

  if (Number.isNaN(n)) return 0;
  return Number(n.toFixed(digitValue));
};

// safe divide helper to avoid division by 0 / NaN
export const SafeDivide = (a: number, b: number) => {
  if (!Number.isFinite(a)) return 0;
  if (!b || !Number.isFinite(b)) return 0;

  return a / b;
};

export const SortArray = (arr: any[]) => {
  return arr.sort(
    (a: any, b: any) =>
      moment(b.date, "DD/MM/YY").valueOf() -
      moment(a.date, "DD/MM/YY").valueOf(),
  );
};
export const findModeOver = (format: any) => {
  switch (format) {
    case "t20":
    case "dt20":
      return { over: 20, bowlerOverLimit: 4 };

    case "odi":
    case "dodi":
      return { over: 50, bowlerOverLimit: 10 };

    case "t10":
      return { over: 10, bowlerOverLimit: 2 };

    case "test":
      return { over: 100, bowlerOverLimit: 25 };

    case "hundred":
      return { over: 16.4, bowlerOverLimit: 3.28 };

    default:
      return { over: 20, bowlerOverLimit: 4 };
  }
};
export const FindMatchOver = (format: any) => {
  return format === "T20"
    ? { over: 20, bowlerOverLimit: 4 }
    : format === "ODI"
      ? { over: 50, bowlerOverLimit: 10 }
      : format === "T10"
        ? { over: 10, bowlerOverLimit: 2 }
        : format === "TEST"
          ? { over: 100, bowlerOverLimit: 25 }
          : { over: 16.4, bowlerOverLimit: 3.28 };
};

export const GetDefaultRolePrediction = (role: any, format: any) => {
  const getRoleCategory = (role = "") => {
    const r = role.toLowerCase();

    if (r.includes("bowling allrounder")) return "BOWL_AR";
    if (r.includes("batting allrounder")) return "BAT_AR";
    if (r.includes("allrounder")) return "BAT_AR"; // generic allrounder

    if (r.includes("bowler")) return "BOWLER";

    // wk, wk-batter, batter etc.
    return "BATTER";
  };
  const DEFAULT_ROLE_VALUES: any = {
    t20: {
      BATTER: {
        runs: 16,
        wkts: 0,
        overs: 0,
        runsConceded: 0,
        strikeRate: 114.29,
        totalBallsFaced: 14,
        economy: 0,
        battingPoint: 28,
        bowlingPoint: 0,
      },
      BOWLER: {
        runs: 4,
        wkts: 0.67,
        overs: 4,
        runsConceded: 26,
        strikeRate: 80.0,
        totalBallsFaced: 5,
        economy: 6.5,
        battingPoint: 6,
        bowlingPoint: 32,
      },
      BAT_AR: {
        runs: 18,
        wkts: 0.4,
        overs: 2.5,
        runsConceded: 24,
        strikeRate: 150.0,
        totalBallsFaced: 12,
        economy: 9.6,
        battingPoint: 22,
        bowlingPoint: 24,
      },
      BOWL_AR: {
        runs: 12,
        wkts: 0.5,
        overs: 3,
        runsConceded: 25,
        strikeRate: 120.0,
        totalBallsFaced: 10,
        economy: 8.33,
        battingPoint: 16,
        bowlingPoint: 28,
      },
    },

    t10: {
      BATTER: {
        runs: 12,
        wkts: 0,
        overs: 0,
        runsConceded: 0,
        strikeRate: 120.0,
        totalBallsFaced: 10,
        economy: 0,
        battingPoint: 22,
        bowlingPoint: 0,
      },
      BOWLER: {
        runs: 3,
        wkts: 0.5,
        overs: 2,
        runsConceded: 17,
        strikeRate: 75.0,
        totalBallsFaced: 4,
        economy: 8.5,
        battingPoint: 4,
        bowlingPoint: 26,
      },
      BAT_AR: {
        runs: 14,
        wkts: 0.35,
        overs: 1.2,
        runsConceded: 15,
        strikeRate: 155.56,
        totalBallsFaced: 9,
        economy: 12.5,
        battingPoint: 18,
        bowlingPoint: 20,
      },
      BOWL_AR: {
        runs: 10,
        wkts: 0.4,
        overs: 1.5,
        runsConceded: 16,
        strikeRate: 125.0,
        totalBallsFaced: 8,
        economy: 10.67,
        battingPoint: 14,
        bowlingPoint: 24,
      },
    },

    hundred: {
      BATTER: {
        runs: 20,
        wkts: 0,
        overs: 0,
        runsConceded: 0,
        strikeRate: 111.11,
        totalBallsFaced: 18,
        economy: 0,
        battingPoint: 32,
        bowlingPoint: 0,
      },
      BOWLER: {
        runs: 6,
        wkts: 0.7,
        overs: 3.3,
        runsConceded: 30,
        strikeRate: 85.71,
        totalBallsFaced: 7,
        economy: 9.09,
        battingPoint: 8,
        bowlingPoint: 34,
      },
      BAT_AR: {
        runs: 22,
        wkts: 0.45,
        overs: 2,
        runsConceded: 28,
        strikeRate: 129.41,
        totalBallsFaced: 17,
        economy: 14.0,
        battingPoint: 26,
        bowlingPoint: 26,
      },
      BOWL_AR: {
        runs: 16,
        wkts: 0.55,
        overs: 2.5,
        runsConceded: 29,
        strikeRate: 114.29,
        totalBallsFaced: 14,
        economy: 11.6,
        battingPoint: 20,
        bowlingPoint: 30,
      },
    },

    odi: {
      BATTER: {
        runs: 35,
        wkts: 0,
        overs: 0,
        runsConceded: 0,
        strikeRate: 87.5,
        totalBallsFaced: 40,
        economy: 0,
        battingPoint: 42,
        bowlingPoint: 0,
      },
      BOWLER: {
        runs: 8,
        wkts: 1.3,
        overs: 10,
        runsConceded: 52,
        strikeRate: 66.67,
        totalBallsFaced: 12,
        economy: 5.2,
        battingPoint: 8,
        bowlingPoint: 40,
      },
      BAT_AR: {
        runs: 32,
        wkts: 0.8,
        overs: 6,
        runsConceded: 48,
        strikeRate: 88.89,
        totalBallsFaced: 36,
        economy: 8.0,
        battingPoint: 36,
        bowlingPoint: 32,
      },
      BOWL_AR: {
        runs: 25,
        wkts: 1.0,
        overs: 8,
        runsConceded: 50,
        strikeRate: 83.33,
        totalBallsFaced: 30,
        economy: 6.25,
        battingPoint: 28,
        bowlingPoint: 36,
      },
    },

    test: {
      BATTER: {
        runs: 40,
        wkts: 0,
        overs: 0,
        runsConceded: 0,
        strikeRate: 53.33,
        totalBallsFaced: 75,
        economy: 0,
        battingPoint: 48,
        bowlingPoint: 0,
      },
      BOWLER: {
        runs: 10,
        wkts: 2.0,
        overs: 20,
        runsConceded: 60,
        strikeRate: 41.67,
        totalBallsFaced: 24,
        economy: 3.0,
        battingPoint: 10,
        bowlingPoint: 44,
      },
      BAT_AR: {
        runs: 38,
        wkts: 1.5,
        overs: 12,
        runsConceded: 55,
        strikeRate: 54.29,
        totalBallsFaced: 70,
        economy: 4.58,
        battingPoint: 40,
        bowlingPoint: 38,
      },
      BOWL_AR: {
        runs: 30,
        wkts: 1.8,
        overs: 15,
        runsConceded: 58,
        strikeRate: 54.55,
        totalBallsFaced: 55,
        economy: 3.87,
        battingPoint: 32,
        bowlingPoint: 42,
      },
    },
  };

  const roleKey = getRoleCategory(role); // BATTER / BOWLER / BAT_AR / BOWL_AR
  const formatConfig =
    DEFAULT_ROLE_VALUES[format.toLowerCase()] || DEFAULT_ROLE_VALUES.t20;
  return formatConfig[roleKey] || formatConfig.BATTER;
};

// ---------- Helpers (assumed to exist) ----------
// findModeOver(mode: string) => { over: number }
// SortArray<T>(arr: T[]): T[]
// CheckIntValue(num: any, digit?: number | string): number
// SafeDivide(a: number, b: number): number

// ---------- 1. Career Bowling (all formats combined, by rows) ----------

export const CalculateBowlingG = (bowlingStats: any[]) => {
  const rows = bowlingStats || [];

  const prepared = rows.map((item: any) => {
    const modeOver = findModeOver((item.mode || "").toLowerCase());
    const matches = CheckIntValue(item.matches);
    const balls = CheckIntValue(item.balls);
    const runs = CheckIntValue(item.runs);
    const wickets = CheckIntValue(item.wicket);
    const maxOversPerMatch = modeOver?.over || 0;

    const totalOversBowled = SafeDivide(balls, 6);
    const avgOversPerMatch = SafeDivide(totalOversBowled, matches);

    // 0–100: how much of the maximum spell he bowls on average
    const avgOverPercentage =
      maxOversPerMatch > 0 ? (avgOversPerMatch / maxOversPerMatch) * 100 : 0;

    // runs/over & wickets/over for this row
    const avgRunsPerOver = SafeDivide(runs, balls) * 6;
    const avgWicketsPerOver = SafeDivide(wickets, balls) * 6;

    return {
      run: avgRunsPerOver,
      wicket: avgWicketsPerOver,
      eco: CheckIntValue(item.economy),
      avgOverPercentage: CheckIntValue(avgOverPercentage),
    };
  });

  const total = prepared.reduce(
    (acc, curr) => {
      acc.run += curr.run;
      acc.wicket += curr.wicket;
      acc.eco += curr.eco;
      acc.avgOverPercentage += curr.avgOverPercentage;
      return acc;
    },
    {
      run: 0,
      wicket: 0,
      eco: 0,
      avgOverPercentage: 0,
    },
  );

  const count = prepared.length;

  const avgEconmy = CheckIntValue(SafeDivide(total.eco, count));
  const avgRunsPerOver = CheckIntValue(SafeDivide(total.run, count));
  const avgWicket = CheckIntValue(SafeDivide(total.wicket, count));
  const avgOverPercentage = CheckIntValue(
    SafeDivide(total.avgOverPercentage, count),
  );

  return { avgEconmy, avgWicket, avgOverPercentage, avgRunsPerOver };
};

// ---------- 2. Career Batting (all formats combined, by rows) ----------

export const CalculateBattingG = (battingStats: any[]) => {
  const rows = battingStats || [];

  const prepared = rows.map((item: any) => {
    const modeOver = findModeOver((item.mode || "").toLowerCase());
    const matches = CheckIntValue(item.matches);
    const balls = CheckIntValue(item.balls);
    const runs = CheckIntValue(item.runs);
    const strikeRate = CheckIntValue(item.strikeRate);
    const maxBallsPerMatch = (modeOver?.over || 0) * 6;

    const avgBallsPerMatch = SafeDivide(balls, matches);

    // 0–100: how many of the team's balls he faces on avg
    const avgBallsPercentage =
      maxBallsPerMatch > 0 ? (avgBallsPerMatch / maxBallsPerMatch) * 100 : 0;

    // runs per ball for this row
    const avgRunsPerBall = SafeDivide(runs, balls);

    return {
      run: avgRunsPerBall,
      strikeRate,
      avgBallPercentage: CheckIntValue(avgBallsPercentage),
    };
  });

  const total = prepared.reduce(
    (acc, curr) => {
      acc.run += curr.run;
      acc.strikeRate += curr.strikeRate;
      acc.avgBallPercentage += curr.avgBallPercentage;
      return acc;
    },
    {
      run: 0,
      strikeRate: 0,
      avgBallPercentage: 0,
    },
  );

  const count = prepared.length;

  const run = CheckIntValue(SafeDivide(total.run, count)); // average runs per ball across rows
  const avgStrikeRate = CheckIntValue(SafeDivide(total.strikeRate, count));
  const avgBallPercentage = CheckIntValue(
    SafeDivide(total.avgBallPercentage, count),
  );

  return { run, avgStrikeRate, avgBallPercentage };
};

// ---------- 3. Fantasy (last 20 games) ----------

export const CalculateFantasy = (fantasy: any[]) => {
  const sorted = SortArray(fantasy || []).slice(0, 20);

  const result = sorted.reduce(
    (acc, curr) => {
      const bat = CheckIntValue(curr.bat);
      const bowl = CheckIntValue(curr.bowl);
      acc.bat += bat;
      acc.bowl += bowl;
      return acc;
    },
    { bat: 0, bowl: 0 },
  );

  const count = sorted.length;

  const avgRunsPoint = CheckIntValue(SafeDivide(result.bat, count));
  const avgBowlPoint = CheckIntValue(SafeDivide(result.bowl, count));

  return { avgRunsPoint, avgBowlPoint };
};

// ---------- 4. Recent Batting Form (last 20 innings) ----------

export const CalculateBatting = (battingForm: any[]) => {
  const sorted = SortArray(battingForm || []).slice(0, 20);

  const mapped = sorted.map((innings: any) => {
    const runStr = innings.run;
    let runs = 0;
    let balls = 0;

    if (runStr && typeof runStr === "string" && runStr.includes("(")) {
      const [r, b] = runStr.replace(")", "").split("(");
      runs = Number(r.trim()) || 0;
      balls = Number(b.trim()) || 0;
    }

    const strikeRate =
      innings.sr === "DNB" || innings.sr === "" || innings.sr == null
        ? 0
        : Number(innings.sr);

    return {
      runs,
      ballFaced: balls,
      strikeRate: CheckIntValue(strikeRate),
    };
  });

  const total = mapped.reduce(
    (acc, curr) => {
      acc.runs += curr.runs;
      acc.ballFaced += curr.ballFaced;
      acc.strikeRate += curr.strikeRate;
      return acc;
    },
    { runs: 0, ballFaced: 0, strikeRate: 0 },
  );

  const count = mapped.length;

  const averageRuns = CheckIntValue(SafeDivide(total.runs, count));
  const averageBallsFaced = CheckIntValue(SafeDivide(total.ballFaced, count));
  const averageStrikeRate = CheckIntValue(SafeDivide(total.strikeRate, count));

  return { averageRuns, averageBallsFaced, averageStrikeRate };
};

// ---------- 5. Recent Bowling Form (last 20 matches) ----------

export const CalculateBowling = (bowlingForm: any[]) => {
  const sorted = SortArray(bowlingForm || []).slice(0, 20);

  const mapped = sorted.map((item: any) => {
    const overRaw = CheckIntValue(item.o); // "6.2", "4.0", "DNB" -> 0
    let avgOverFactor = 0;

    if (overRaw > 0 && overRaw <= 4) {
      avgOverFactor = overRaw / 20;
    } else if (overRaw > 4 && overRaw <= 10) {
      avgOverFactor = overRaw / 50;
    } else if (overRaw > 10) {
      avgOverFactor = overRaw / 100;
    }

    const avgRunsPerOver = CheckIntValue(SafeDivide(item.r, overRaw));
    const avgWicketPerOver = CheckIntValue(SafeDivide(item.w, overRaw));

    return {
      over: overRaw,
      run: avgRunsPerOver,
      wicket: avgWicketPerOver,
      eco: CheckIntValue(item.eco),
      avgOver: CheckIntValue(avgOverFactor),
    };
  });

  const total = mapped.reduce(
    (acc, curr) => {
      acc.run += curr.run;
      acc.wicket += curr.wicket;
      acc.eco += curr.eco;
      acc.avgOver += curr.avgOver;
      return acc;
    },
    {
      run: 0,
      wicket: 0,
      eco: 0,
      avgOver: 0,
    },
  );

  const count = mapped.length;

  const avgEconmy = CheckIntValue(SafeDivide(total.eco, count));
  const avgWicket = CheckIntValue(SafeDivide(total.wicket, count));
  const avgOver = CheckIntValue(SafeDivide(total.avgOver, count));
  const avgRunsConsumed = CheckIntValue(SafeDivide(total.run, count));

  return { avgEconmy, avgWicket, avgOver, avgRunsConsumed };
};

export const PercentageToValue = (percentage: any, total: any) => {
  if (!percentage || !total) return 0;
  return Number(((percentage / 100) * total).toFixed(2));
};

export const playerPredictionScoreCalculate = (
  data: any,
  matchOver: number,
) => {
  // weights
  const W_RECENT = 1;
  const W_CAREER = 0.6;
  const W_STADIUM = 0.2;

  // normalize percentage-like inputs:
  // if value <= 1, treat as fraction (0.17 -> 17%)

  // convert "percentage of match overs/balls" to overs/balls using provided helper
  const pctToBalls = (pct: any) => {
    return CheckIntValue(SafeDivide(pct, 100) * matchOver * 6);
  };

  const pctToOvers = (pct: any) => {
    return CheckIntValue(SafeDivide(pct, 100) * matchOver);
  };

  // -------------------------
  // Batting
  // -------------------------
  // const fantasyBattingRuns = data.fantasyStats?.avgRunsPoint || 0;

  // recent
  const recentRuns = data.recentBattingFormStats?.averageRuns;
  const recentBalls = data.recentBattingFormStats?.averageBallsFaced;
  const recentSR = data.recentBattingFormStats?.averageStrikeRate;

  // career (batting)
  const battingCareerBalls = pctToBalls(data.battingStats?.avgBallPercentage);
  const battingCareerSR = data.battingStats?.avgStrikeRate || 0;
  // battingStats.run interpreted as runs-per-ball (as in your original)
  const battingCareerRuns = CheckIntValue(
    data.battingStats?.run * battingCareerBalls,
    0,
  );

  // stadium (batting)
  const battingStadiumBalls = pctToBalls(
    data.statdiumBattingStats?.avgBallPercentage,
  );
  const battingStadiumSR = data.statdiumBattingStats?.avgStrikeRate || 0;
  const battingStadiumRuns = CheckIntValue(
    data.statdiumBattingStats?.run * battingStadiumBalls,
    0,
  );

  // weighted combined batting metrics (50% recent, 30% career, 20% stadium)
  const totalRuns = CheckIntValue(
    recentRuns * W_RECENT +
      battingCareerRuns * W_CAREER +
      battingStadiumRuns * W_STADIUM,
    2,
  );

  // const totalAvgStrikeRate = CheckIntValue(
  //   recentSR * W_RECENT +
  //     battingCareerSR * W_CAREER +
  //     battingStadiumSR * W_STADIUM,
  //   2
  // );

  const totalAvgBallFaced = CheckIntValue(
    recentBalls * W_RECENT +
      battingCareerBalls * W_CAREER +
      battingStadiumBalls * W_STADIUM,
    2,
  );
  const totalAvgStrikeRate = CheckIntValue(
    SafeDivide(totalRuns, totalAvgBallFaced) * 100,
  );

  // -------------------------
  // Bowling
  // -------------------------
  // const fantasyBowlingPoints = data.fantasyStats?.avgBowlPoint || 0;

  // recent bowling

  // avgOver in recent data might be fraction or percent; convert to overs in this match
  const recentOvers = CheckIntValue(
    data.recentBowlingFormStats?.avgOver * matchOver,
  );
  const recentWicket = CheckIntValue(
    data.recentBowlingFormStats?.avgWicket * recentOvers,
  );

  const recentRunsConceded = CheckIntValue(
    data.recentBowlingFormStats?.avgRunsConsumed * recentOvers,
  );
  const recentEcon = CheckIntValue(recentRunsConceded / recentOvers);

  // career bowling
  const bowlingCareerOvers = pctToOvers(data.bowlingStats?.avgOverPercentage);
  const bowlingCareerWicketsPerOver = data.bowlingStats?.avgWicket || 0;
  const bowlingCareerWickets = CheckIntValue(
    bowlingCareerWicketsPerOver * bowlingCareerOvers,
    2,
  );
  // prefer avgRunsPerOver if present, else fallback to econ
  const bowlingCareerRunsPerOver = data.bowlingStats?.avgRunsPerOver;
  const bowlingCareerRuns = CheckIntValue(
    bowlingCareerRunsPerOver * bowlingCareerOvers,
    2,
  );
  const bowlingCareerEcon = CheckIntValue(
    SafeDivide(bowlingCareerRuns, bowlingCareerOvers),
  );

  // stadium bowling
  const bowlingStadiumOvers = pctToOvers(
    data.statdiumBowlingStats?.avgOverPercentage,
  );

  const bowlingStadiumWicketsPerOver =
    data.statdiumBowlingStats?.avgWicket || 0;
  const bowlingStadiumWickets = CheckIntValue(
    bowlingStadiumWicketsPerOver * bowlingStadiumOvers,
    2,
  );
  const bowlingStadiumRunsPerOver = data.statdiumBowlingStats?.avgRunsPerOver;
  const bowlingStadiumRuns = CheckIntValue(
    bowlingStadiumRunsPerOver * bowlingStadiumOvers,
    2,
  );
  const bowlingStadiumEcon = CheckIntValue(
    SafeDivide(bowlingStadiumRuns, bowlingStadiumOvers),
  );

  // weighted bowling aggregates (50% recent, 30% career, 20% stadium)
  const totalAvgOvers = CheckIntValue(
    recentOvers * W_RECENT +
      bowlingCareerOvers * W_CAREER +
      bowlingStadiumOvers * W_STADIUM,
    2,
  );

  const totalAvgWickets = CheckIntValue(
    recentWicket * W_RECENT +
      bowlingCareerWickets * W_CAREER +
      bowlingStadiumWickets * W_STADIUM,
    2,
  );

  const totalAvgRunsConceded = CheckIntValue(
    recentRunsConceded * W_RECENT +
      bowlingCareerRuns * W_CAREER +
      bowlingStadiumRuns * W_STADIUM,
    2,
  );

  const totalAvgEconomy = totalAvgOvers
    ? CheckIntValue(SafeDivide(totalAvgRunsConceded, totalAvgOvers), 2)
    : 0;

  // -------------------------
  // Return
  // -------------------------
  return {
    batting: {
      // fantasyBattingRuns: CheckIntValue(fantasyBattingRuns, 2),
      totalRuns,
      totalAvgStrikeRate,
      totalAvgBallFaced,
      weights: { recent: W_RECENT, career: W_CAREER, stadium: W_STADIUM },
    },
    bowling: {
      // fantasyBowlingPoints: CheckIntValue(fantasyBowlingPoints, 2),
      totalAvgOvers,
      totalAvgWickets,
      totalAvgRunsConceded,
      totalAvgEconomy,
      weights: { recent: W_RECENT, career: W_CAREER, stadium: W_STADIUM },
    },
  };
};

export const GetConfidence = (chance: number) => {
  switch (true) {
    case chance < 30:
      return "Low";
    case chance >= 30 && chance <= 55:
      return "Medium";
    case chance > 55:
      return "High";
    default:
      return "Unknown";
  }
};

export const GetHint = (team1Chance: number, team2Chance: number) => {
  switch (true) {
    // Team 2 is strong favorite
    case team1Chance < 30 && team2Chance >= 70:
      return {
        team1: {
          message: "❌ Low confidence - Statistical factors unfavorable",
          color: "text-red-600 bg-red-50 border-red-200",
          badgeColor: "bg-red-100 text-red-800",
        },
        team2: {
          message: "✅ Favorable conditions - Positive indicators detected",
          color: "text-green-600 bg-green-50 border-green-200",
          badgeColor: "bg-green-100 text-green-800",
        },
      };

    // Team 1 is strong favorite
    case team2Chance < 30 && team1Chance >= 70:
      return {
        team1: {
          message: "✅ Favorable conditions - Positive indicators detected",
          color: "text-green-600 bg-green-50 border-green-200",
          badgeColor: "bg-green-100 text-green-800",
        },
        team2: {
          message: "❌ Low confidence - Statistical factors unfavorable",
          color: "text-red-600 bg-red-50 border-red-200",
          badgeColor: "bg-red-100 text-red-800",
        },
      };

    // Team 2 is moderate favorite
    case team1Chance >= 30 && team1Chance <= 45 && team2Chance >= 55:
      return {
        team1: {
          message: "⚠️ Moderate confidence - Mixed statistical signals",
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          badgeColor: "bg-yellow-100 text-yellow-800",
        },
        team2: {
          message: "🟢 Strong indicators - Multiple factors aligned",
          color: "text-green-600 bg-green-50 border-green-200",
          badgeColor: "bg-green-100 text-green-800",
        },
      };

    // Team 1 is moderate favorite
    case team2Chance >= 30 && team2Chance <= 45 && team1Chance >= 55:
      return {
        team1: {
          message: "🟢 Strong indicators - Multiple factors aligned",
          color: "text-green-600 bg-green-50 border-green-200",
          badgeColor: "bg-green-100 text-green-800",
        },
        team2: {
          message: "⚠️ Moderate confidence - Mixed statistical signals",
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          badgeColor: "bg-yellow-100 text-yellow-800",
        },
      };

    // Balanced match - both teams competitive
    case team1Chance >= 45 && team2Chance >= 50:
      return {
        team1: {
          message: "🟡 Neutral outlook - Monitor additional metrics",
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          badgeColor: "bg-yellow-100 text-yellow-800",
        },
        team2: {
          message: "🟢 Preferred pick - Statistical advantage noted",
          color: "text-green-600 bg-green-50 border-green-200",
          badgeColor: "bg-green-100 text-green-800",
        },
      };

    // Balanced match - both teams competitive (reverse)
    case team2Chance >= 45 && team1Chance >= 50:
      return {
        team1: {
          message: "🟢 Preferred pick - Statistical advantage noted",
          color: "text-green-600 bg-green-50 border-green-200",
          badgeColor: "bg-green-100 text-green-800",
        },
        team2: {
          message: "🟡 Neutral outlook - Monitor additional metrics",
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          badgeColor: "bg-yellow-100 text-yellow-800",
        },
      };

    // Very close match
    case Math.abs(team1Chance - team2Chance) <= 5:
      return {
        team1: {
          message: "⚖️ Balanced match - No clear statistical advantage",
          color: "text-blue-600 bg-blue-50 border-blue-200",
          badgeColor: "bg-blue-100 text-blue-800",
        },
        team2: {
          message: "⚖️ Balanced match - No clear statistical advantage",
          color: "text-blue-600 bg-blue-50 border-blue-200",
          badgeColor: "bg-blue-100 text-blue-800",
        },
      };

    // Default case for unknown scenarios
    default:
      return {
        team1: {
          message: "🔍 Review detailed analysis for deeper insights",
          color: "text-gray-600 bg-gray-50 border-gray-200",
          badgeColor: "bg-gray-100 text-gray-800",
        },
        team2: {
          message: "🔍 Review detailed analysis for deeper insights",
          color: "text-gray-600 bg-gray-50 border-gray-200",
          badgeColor: "bg-gray-100 text-gray-800",
        },
      };
  }
};

export const PickTop = (players: any[], keyPath: string) => {
  if (!Array.isArray(players) || players.length === 0) return null;
  // shallow copy then sort
  const copy = players.slice();
  copy.sort((a: any, b: any) => {
    const av = a?.[keyPath.split(".")[0]] || 0;
    const bv = b?.[keyPath.split(".")[0]] || 0;
    // handle nested keys if needed (but your data has flat keys under batting/bowling)
    return (
      (b?.[keyPath.split(".")[0]]?.[keyPath.split(".")[1]] || 0) -
      (a?.[keyPath.split(".")[0]]?.[keyPath.split(".")[1]] || 0)
    );
  });
  return copy[0] || null;
};

export const PickTopBowler = (players: any[], overLimit: number) => {
  const sortArray = players.sort(
    (a: any, b: any) => b.bowling.totalAvgWickets - a.bowling.totalAvgWickets,
  );
  let check = {
    ...sortArray[0],
    bowling: {
      ...sortArray[0].bowling,
      totalAvgOvers:
        sortArray[0].bowling.totalAvgOvers > overLimit
          ? overLimit
          : sortArray[0].bowling.totalAvgOvers,
    },
  };
  return check;
};
export const PickTopBatter = (players: any[]) => {
  const sortArray = players.sort(
    (a: any, b: any) => b.batting.totalRuns - a.batting.totalRuns,
  );
  return sortArray[0];
};

export const MaxMin = (score: number, wicket: number) => {
  const predicted = Math.floor(CheckIntValue(score));
  let wickets =
    wicket + wicket / 2 > 10
      ? 10
      : Math.floor(CheckIntValue((wicket + wicket / 2).toFixed(0)));

  // wicket cap: max 10
  if (wickets > 10) wickets = 10;

  // Convert wickets (0–10) into factor 0..1
  const factor = wickets / 10;

  // Dynamic ranges
  const minDiff = Math.floor(8 + factor * 20); // 8 → 28
  const maxDiff = Math.floor(10 + factor * 25); // 12 → 42

  const minScore = Math.max(0, predicted - minDiff);
  const maxScore = predicted + maxDiff;

  return {
    min: minScore,
    max: maxScore,
    predicted,
    wickets,
  };
};

export const NormalizeCrexUrl = (url: string) => {
  return url
    .replace(/\/(live|scorecard)(\/)?$/i, "/info") // live or scorecard => info
    .replace(/\/info(\/)?$/i, "/info"); // ensure ending clean
};

// export const GetTeamShortName = (teamName: string): string => {
//   if (!teamName || typeof teamName !== "string") return "";

//   let name = teamName.toUpperCase().trim();

//   /* ---------- detect women ---------- */
//   const isWomen = /\bWOMEN\b|\bW\b/.test(name);

//   name = name
//     .replace(/\bWOMEN\b|\bW\b/g, "")
//     .replace(/[^A-Z\s]/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();

//   const words = name.split(" ").filter(Boolean);

//   let code = "";

//   /* ---------- multi word countries ---------- */
//   if (words.length >= 2) {
//     // take first letter of each word
//     code = words.map((w) => w[0]).join("");

//     // if more than 2 letters keep 2 (SL, NZ, SA, WI, HK)
//     if (code.length > 2) code = code.slice(0, 2);
//   } else if (words.length === 1) {
//     /* ---------- single word countries ---------- */
//     const w = words[0];

//     // remove vowels except first
//     // const consonants = w[0] + w.slice(1).replace(/[AEIOU]/g, "");

//     code = w.slice(0, 3);

//     // if still small, pad from name
//     if (code.length < 3) code = w.slice(0, 3);
//   }

//   /* ---------- franchise fallback ---------- */
//   if (!code) {
//     code = words
//       .map((w) => w[0])
//       .join("")
//       .slice(0, 3);
//   }

//   return isWomen ? `${code}-W` : code;
// };

export const GetTeamShortName = (teamName: string): string => {
  if (!teamName || typeof teamName !== "string") return "";

  let name = teamName.toUpperCase().trim();

  /* ---------- detect women ---------- */
  const isWomen = /\bWOMEN\b|\bW\b/.test(name);

  name = name
    .replace(/\bWOMEN\b|\bW\b/g, "")
    .replace(/[^A-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = name.split(" ").filter(Boolean);

  let code = "";

  /* ---------- RULE 1: Multi-word ---------- */
  if (words.length >= 2) {
    code = words.map((w) => w[0]).join("");

    // 👉 If 2 words → keep 2 letters (MI, CSK, SL, NZ)
    if (words.length === 2) {
      code = code.slice(0, 2);
    }

    // 👉 If 3+ words → keep 3 letters (KKR, RCB)
    else if (words.length >= 3) {
      code = code.slice(0, 3);
    }
  } else if (words.length === 1) {
    /* ---------- RULE 2: Single word ---------- */
    code = words[0].slice(0, 3);
  }

  /* ---------- fallback ---------- */
  if (!code) {
    code = words
      .map((w) => w[0])
      .join("")
      .slice(0, 3);
  }

  return isWomen ? `${code}-W` : code;
};

export const FilterSquad = (squads: any[]) => {
  const cleanPlayer = (player: any) => ({
    ...player,
    careerStats: {
      ...player?.careerStats,
      bowling: (player?.careerStats?.bowling ?? []).filter(
        (item: any) => !item?.format?.toLowerCase()?.includes("debut"),
      ),
    },
  });

  const a = (squads ?? []).map((team: any) => ({
    ...team,
    playingPlayers: (team?.playingPlayers ?? []).map(cleanPlayer),
    benchPlayers: (team?.benchPlayers ?? []).map(cleanPlayer),
  }));

  return a;
};

export const SendPrediction = async (prediction: any) => {
  try {
    const BOT_TOKEN = "8779344951:AAGQ2HQLS786MfYhi4vvdipJMzDSsashxx0";
    const CHAT_ID = "@sportbetting1998";
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    // const {
    //   team1,
    //   team2,
    //   team1Chance,
    //   team2Chance,
    //   finalWinner,
    //   message = "According to the analysis",
    //   stopLoss = "20 Paisa",
    //   brandName = "CricVista - 🎯 POWERED BY AI ❤️",
    // } = prediction;
    const team1 = prediction?.team1?.name;
    const team2 = prediction?.team2?.name;

    const team1Chance =
      prediction?.team1?.winnerPrediction?.probability?.toFixed(2) + "%";

    const team2Chance =
      prediction?.team2?.winnerPrediction?.probability?.toFixed(2) + "%";

    const finalWinner =
      prediction?.team1?.winnerPrediction?.probability >
      prediction?.team2?.winnerPrediction?.probability
        ? team1
        : team2;

    const brandName = "CricVista - 🎯 POWERED BY AI ❤️";
    const message = "According to the analysis";
    const stopLoss = "20 Paisa";

    const text = `
🕉 ${team1.toUpperCase()} VS ${team2.toUpperCase()} 🕉

📊 Winning Chances:
${team1.toUpperCase()} - ${team1Chance}
${team2.toUpperCase()} - ${team2Chance}

🏆 MATCH WINNER - ${finalWinner.toUpperCase()} 🏆

${message}

${finalWinner.toUpperCase()} WILL WIN THIS MATCH

⚠️ Loss cut at ${stopLoss} compulsory

${brandName}
`;

    // const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await axios.post(url, {
      chat_id: CHAT_ID,
      text: text,
    });

    return response.data;
  } catch (error: any) {
    console.log("Telegram Send Error:", error?.response?.data || error.message);
    return null;
  }
};

// {
//   "crons": [
//     {
//       "path": "/api/corn/match-status",
//       "schedule": "0 * * * *"
//     },
//         {
//       "path": "/api/corn/daily-match-list",
//       "schedule": "30 19 * * *"
//     }
//   ]
// }

export const SendPredictionResult = async (prediction: any, isPassed: boolean, matchResult: string) => {
  try {
    const BOT_TOKEN = "8779344951:AAGQ2HQLS786MfYhi4vvdipJMzDSsashxx0";
    const CHAT_ID = "@sportbetting1998";
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const team1 = prediction?.team1?.name || "Team 1";
    const team2 = prediction?.team2?.name || "Team 2";

    const finalWinner =
      prediction?.team1?.winnerPrediction?.probability >
      prediction?.team2?.winnerPrediction?.probability
        ? team1
        : team2;

    const brandName = "CricVista - 🎯 POWERED BY AI ❤️";
    const statusText = isPassed ? "✅ PREDICTION PASSED" : "❌ PREDICTION FAILED";

    const text = `
🕉 ${team1.toUpperCase()} VS ${team2.toUpperCase()} 🕉

${statusText}

🏏 Our Prediction: ${finalWinner.toUpperCase()}
🏆 Match Result: ${matchResult}

${brandName}
`;

    const response = await axios.post(url, {
      chat_id: CHAT_ID,
      text: text,
    });

    return response.data;
  } catch (error: any) {
    console.log("Telegram Result Send Error:", error?.response?.data || error.message);
    return null;
  }
};
