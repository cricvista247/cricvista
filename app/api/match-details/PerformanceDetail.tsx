import { GetHtml, GetTeamList } from "@/lib/utils";
import Stats from "../stats/StatsModel";

export const BattingForm = async (url: string) => {
  try {
    const $ = await GetHtml(url);

    // If HTML failed to load → return empty
    if (!$) return [];

    const matches: any[] = [];

    // locate batting table safely
    const table = $('div.tab-pane[id$="-batting"] table');
    if (!table || table.length === 0) return [];

    table.find("tbody tr").each((_, row) => {
      const columns = $(row).find("td");
      if (!columns || columns.length === 0) return;

      const date = $(columns[0]).text()?.trim() || "";
      const match = $(columns[1]).text()?.trim() || "";

      // DNB or missing columns
      if ($(columns[2]).attr("colspan") === "5") {
        matches.push({
          date,
          match,
          bo: "DNB",
          run: "DNB",
          fours_sixes: "DNB",
          sr: "DNB",
          out: "DNB",
        });
      } else {
        matches.push({
          date,
          match,
          bo: $(columns[2]).text()?.trim() || "",
          run: $(columns[3]).text()?.trim() || "",
          fours_sixes: $(columns[4]).text()?.trim() || "",
          sr: $(columns[5]).text()?.trim() || "",
          out: $(columns[6]).text()?.trim() || "",
        });
      }
    });

    return matches;
  } catch (err) {
    console.error(
      `BattingForm error for ${url}:`,
      (err as any)?.message || err
    );
    return [];
  }
};

export const BowlingForm = async (url: string) => {
  try {
    const $ = await GetHtml(url);

    // If HTML failed to load
    if (!$) return [];

    const bowlingStats: any[] = [];

    // Select bowling table
    const table = $('div.tab-pane[id$="-bowling"] table');
    if (!table || table.length === 0) return [];

    table.find("tbody tr").each((_, row) => {
      const columns = $(row).find("td");
      if (!columns || columns.length === 0) return;

      const date = $(columns[0]).text()?.trim() || "";
      const match = $(columns[1]).text()?.trim() || "";

      // DNB (colspan = 5)
      if ($(columns[2]).attr("colspan") === "5") {
        bowlingStats.push({
          date,
          match,
          o: "DNB",
          r: "DNB",
          w: "DNB",
          m: "DNB",
          eco: "DNB",
        });
      } else {
        bowlingStats.push({
          date,
          match,
          o: $(columns[2]).text()?.trim() || "",
          r: $(columns[3]).text()?.trim() || "",
          w: $(columns[4]).text()?.trim() || "",
          m: $(columns[5]).text()?.trim() || "",
          eco: $(columns[6]).text()?.trim() || "",
        });
      }
    });

    return bowlingStats;
  } catch (err) {
    console.error(
      `BowlingForm error for ${url}:`,
      (err as any)?.message || err
    );
    return [];
  }
};

export const BattingStats = async (url: string) => {
  try {
    const $ = await GetHtml(url);

    // If HTML did not load
    if (!$) return [];

    const result: any[] = [];

    // Find batting stats table rows safely
    const tableRows = $("div[id$='-batting-stats'] table tbody tr.tsuccess");

    if (!tableRows || tableRows.length === 0) return [];

    tableRows.each((_, row) => {
      const cols = $(row).find("td");
      if (!cols || cols.length < 14) return; // avoid undefined errors

      result.push({
        year: $(cols[0]).text()?.trim() || "",
        mode: $(cols[1]).text()?.trim() || "",
        matches: $(cols[2]).text()?.trim() || "",
        innings: $(cols[3]).text()?.trim() || "",
        runs: $(cols[4]).text()?.trim() || "",
        balls: $(cols[5]).text()?.trim() || "",
        notOut: $(cols[6]).text()?.trim() || "",
        average: $(cols[7]).text()?.trim() || "",
        strikeRate: $(cols[8]).text()?.trim() || "",
        highScore: $(cols[9]).text()?.trim() || "",
        fifty: $(cols[10]).text()?.trim() || "",
        hundred: $(cols[11]).text()?.trim() || "",
        fours: $(cols[12]).text()?.trim() || "",
        sixes: $(cols[13]).text()?.trim() || "",
      });
    });

    return result;
  } catch (err) {
    console.error(
      `BattingStats error for ${url}:`,
      (err as any)?.message || err
    );
    return [];
  }
};

export const BowlingStats = async (url: string) => {
  try {
    const $ = await GetHtml(url);

    // If HTML didn't load, return empty
    if (!$) return [];

    const result: any[] = [];

    // safely find the rows
    const tableRows = $("div[id$='-bowling-stats'] table tbody tr.tsuccess");
    if (!tableRows || tableRows.length === 0) return [];

    tableRows.each((_, row) => {
      const cols = $(row).find("td");

      // avoid undefined column errors
      if (!cols || cols.length < 13) return;

      result.push({
        year: $(cols[0]).text()?.trim() || "",
        mode: $(cols[1]).text()?.trim() || "",
        matches: $(cols[2]).text()?.trim() || "",
        innings: $(cols[3]).text()?.trim() || "",
        balls: $(cols[4]).text()?.trim() || "",
        runs: $(cols[5]).text()?.trim() || "",
        wicket: $(cols[6]).text()?.trim() || "",
        strikeRate: $(cols[7]).text()?.trim() || "",
        twoWicket: $(cols[8]).text()?.trim() || "",
        threeWicket: $(cols[9]).text()?.trim() || "",
        fiveWicket: $(cols[10]).text()?.trim() || "",
        economy: $(cols[11]).text()?.trim() || "",
        average: $(cols[12]).text()?.trim() || "",
      });
    });

    return result;
  } catch (err) {
    console.error(
      `BowlingStats error for ${url}:`,
      (err as any)?.message || err
    );
    return [];
  }
};

export const FantasyStats = async (url: string) => {
  try {
    const $ = await GetHtml(url);

    // HTML didn't load
    if (!$) return [];

    const container = $(
      "div[id$='dream11-points'], div[class*='dream11-points']"
    );

    if (!container || container.length === 0) {
      console.warn(`FantasyStats: Dream11 container not found for URL: ${url}`);
      return [];
    }

    const rows = container.find("tbody tr");
    const dream11Stats: any[] = [];

    rows.each((_, row) => {
      const cols = $(row).find("td");

      // columns missing -> skip safely
      if (!cols || cols.length < 6) return;

      const date = $(cols[0]).text()?.trim() || "";
      const match = $(cols[1]).find("a").text()?.trim() || "";
      const bat = $(cols[2]).text()?.trim() || "";
      const bowl = $(cols[3]).text()?.trim() || "";
      const field = $(cols[4]).text()?.trim() || "";
      const total = $(cols[5]).text()?.trim() || "";

      dream11Stats.push({ date, match, bat, bowl, field, total });
    });

    return dream11Stats;
  } catch (err) {
    console.error(
      `FantasyStats error for ${url}:`,
      (err as any)?.message || err
    );
    return [];
  }
};

export const OverallStats = async (url: string) => {
  try {
    // try to extract selector name from URL
    const match = url?.match?.(/cricketer\/([^/]+)\//);
    const selectorName: string | null = match ? match[1] : null;

    const $ = await GetHtml(url);
    if (!$) {
      console.error(`OverallStats: failed to load HTML for ${url}`);
      return {
        name: selectorName || "",
        batting: {},
        bowling: {},
        fielding: {},
      };
    }

    const playerData: any = {
      name: selectorName || "",
      batting: {},
      bowling: {},
      fielding: {},
    };

    if (!selectorName) {
      // If selectorName couldn't be determined, try to guess common patterns
      // but don't fail — just return empty structured object
      console.warn(`OverallStats: selectorName not found in URL: ${url}`);
      return playerData;
    }

    // Build selectors safely
    const battingTableSelector = `#${selectorName}-batting tbody tr`;
    const bowlingTableSelector = `#${selectorName}-bowling tbody tr`;
    const fieldingTableSelector = `#${selectorName}-fielding tbody tr`;

    // Helper to safely read text at given index
    const cellText = (row: any, idx: number) =>
      row.find("td").eq(idx).text()?.trim() || "";

    // Extract Batting Stats
    const battingRows = $(battingTableSelector);
    if (battingRows && battingRows.length > 0) {
      battingRows.each((_, el) => {
        const row = $(el);
        const statName = row.find("td").first().text()?.trim() || "";
        if (!statName) return;
        // Skip header-like rows
        if (statName === "Outtype" || statName === "Wicket Taker") return;

        playerData.batting[statName] = {
          ODI: cellText(row, 1),
          T20: cellText(row, 2),
          IPL: cellText(row, 3),
        };
      });
    }

    // Extract Bowling Stats
    const bowlingRows = $(bowlingTableSelector);
    if (bowlingRows && bowlingRows.length > 0) {
      bowlingRows.each((_, el) => {
        const row = $(el);
        const statName = row.find("td").first().text()?.trim() || "";
        if (!statName) return;
        if (statName === "Batsman Type" || statName === "Wickets") return;

        playerData.bowling[statName] = {
          ODI: cellText(row, 1),
          T20: cellText(row, 2),
          IPL: cellText(row, 3),
        };
      });
    }

    // Extract Fielding Stats
    const fieldingRows = $(fieldingTableSelector);
    if (fieldingRows && fieldingRows.length > 0) {
      fieldingRows.each((_, el) => {
        const row = $(el);
        const statName = row.find("td").first().text()?.trim() || "";
        if (!statName) return;

        playerData.fielding[statName] = {
          ODI: cellText(row, 1),
          T20: cellText(row, 2),
          IPL: cellText(row, 3),
        };
      });
    }

    return playerData;
  } catch (err) {
    console.error(
      `OverallStats error for ${url}:`,
      (err as any)?.message || err
    );
    return { name: "", batting: {}, bowling: {}, fielding: {} };
  }
};

export const StadiumStats = async (url: string) => {
  try {
    if (!url) return [];

    // extract stadium slug safely
    const stadiumSlug = url.split("/stadium/")[1]?.split("/")[0] || "";
    if (!stadiumSlug) {
      console.warn(
        "StadiumStats: unable to extract stadium slug from URL:",
        url
      );
      return [];
    }
    const sectionId = `${stadiumSlug}-recent-matches`;

    const $ = await GetHtml(url);
    if (!$) {
      console.error("StadiumStats: failed to load HTML for", url);
      return [];
    }

    const matches: any[] = [];

    const rows = $(`#${sectionId} table tr`);
    if (!rows || rows.length === 0) return [];

    rows.each((i, row) => {
      // skip header row(s)
      if (i === 0) return;

      const columns = $(row).find("td");
      if (!columns || columns.length === 0) return;

      // date & link
      const dateLink = $(columns[0]).find("a");
      const date =
        dateLink.text()?.trim() || $(columns[0]).text()?.trim() || "";
      const matchTitle = dateLink.attr("title")?.trim() || "";
      const matchUrlRaw = dateLink.attr("href")?.trim() || "";

      // normalize match url if relative
      const matchUrl =
        matchUrlRaw && matchUrlRaw.startsWith("http")
          ? matchUrlRaw
          : matchUrlRaw
          ? `https://advancecricket.com${matchUrlRaw}`
          : "";

      // innings — replace <br> with " - " and trim
      const safeHtmlText = (el: any) =>
        el
          .html?.()
          ?.replace(/<br\s*\/?>/gi, " - ")
          .replace(/\s+/g, " ")
          .trim() || "";

      const inn1 = safeHtmlText($(columns[1]));
      const inn2 = safeHtmlText($(columns[2]));

      matches.push({
        date,
        matchTitle,
        matchUrl,
        inn1Score: inn1,
        inn2Score: inn2,
      });
    });

    return matches;
  } catch (err) {
    console.error(
      `StadiumStats error for ${url}:`,
      (err as any)?.message || err
    );
    return [];
  }
};

export const AgaintStadiumStats = async (
  url: string,
  filterStadium: string
) => {
  try {
    if (!url)
      return {
        player: "",
        stadium: filterStadium || "",
        battingStats: [],
        bowlingStats: [],
      };

    const $ = await GetHtml(url);
    if (!$) {
      console.error("AgaintStadiumStats: failed to load HTML for", url);
      return {
        player: "",
        stadium: filterStadium || "",
        battingStats: [],
        bowlingStats: [],
      };
    }

    const headingText = $("div.tab-pane h2").first().text()?.trim() || "";
    const extractedPlayer = headingText.split(" Against")[0]?.trim() || "";

    // find nav-link hrefs robustly (case insensitive)
    const navLinks = $("a.nav-link").toArray();
    const findHrefByText = (needle: string) => {
      const found = navLinks.find((el) =>
        ($(el).text() || "").toLowerCase().includes(needle.toLowerCase())
      );
      return found ? $(found).attr("href") || "" : "";
    };

    let battingTabHref = findHrefByText("bat");
    let bowlingTabHref = findHrefByText("bowl");

    // Fallback: if href missing, try to locate div IDs that look like '-batting-stats' or '-bowling-stats'
    if (!battingTabHref) {
      const battingDiv = $("div[id$='-batting-stats']").first();
      battingTabHref = battingDiv.length ? `#${battingDiv.attr("id")}` : "";
    }
    if (!bowlingTabHref) {
      const bowlingDiv = $("div[id$='-bowling-stats']").first();
      bowlingTabHref = bowlingDiv.length ? `#${bowlingDiv.attr("id")}` : "";
    }

    const battingStats: any[] = [];
    const bowlingStats: any[] = [];

    const stadiumToMatch = (filterStadium || "").toLowerCase().trim();

    // helper to safely read text from cols by index
    const textAt = (cols: any, idx: number) =>
      cols.eq(idx).text()?.trim() || "";

    // Parse batting table rows if selector exists
    if (battingTabHref) {
      $(`${battingTabHref} table tbody .tsuccess`).each((_, el) => {
        try {
          const cols = $(el).find("td");
          if (!cols || cols.length < 16) return; // ensure enough cols for batting structure

          const stadium = textAt(cols, 0);
          if (stadium.toLowerCase() !== stadiumToMatch) return;

          battingStats.push({
            team: textAt(cols, 1),
            year: textAt(cols, 2),
            mode: textAt(cols, 3),
            matches: textAt(cols, 4),
            innings: textAt(cols, 5),
            runs: textAt(cols, 6),
            balls: textAt(cols, 7),
            no: textAt(cols, 8),
            avg: textAt(cols, 9),
            sr: textAt(cols, 10),
            hs: textAt(cols, 11),
            fifty: textAt(cols, 12),
            hundred: textAt(cols, 13),
            fours: textAt(cols, 14),
            sixes: textAt(cols, 15),
          });
        } catch (e) {
          console.error("AgaintStadiumStats: error parsing batting row:", e);
        }
      });
    } else {
      console.warn(
        "AgaintStadiumStats: batting tab selector not found for",
        url
      );
    }

    // Parse bowling table rows if selector exists
    if (bowlingTabHref) {
      $(`${bowlingTabHref} table tbody .tsuccess`).each((_, el) => {
        try {
          const cols = $(el).find("td");
          if (!cols || cols.length < 15) return; // ensure enough cols for bowling structure

          const stadium = textAt(cols, 0);
          if (stadium.toLowerCase() !== stadiumToMatch) return;

          bowlingStats.push({
            team: textAt(cols, 1),
            year: textAt(cols, 2),
            mode: textAt(cols, 3),
            matches: textAt(cols, 4),
            innings: textAt(cols, 5),
            balls: textAt(cols, 6),
            runs: textAt(cols, 7),
            wickets: textAt(cols, 8),
            sr: textAt(cols, 9),
            twoWkts: textAt(cols, 10),
            threeWkts: textAt(cols, 11),
            fiveWkts: textAt(cols, 12),
            econ: textAt(cols, 13),
            avg: textAt(cols, 14),
          });
        } catch (e) {
          console.error("AgaintStadiumStats: error parsing bowling row:", e);
        }
      });
    } else {
      console.warn(
        "AgaintStadiumStats: bowling tab selector not found for",
        url
      );
    }

    return {
      player: extractedPlayer,
      stadium: filterStadium,
      battingStats,
      bowlingStats,
    };
  } catch (err) {
    console.error(
      "AgaintStadiumStats unexpected error:",
      (err as any)?.message || err
    );
    return {
      player: "",
      stadium: filterStadium || "",
      battingStats: [],
      bowlingStats: [],
    };
  }
};

export const AgaintTeamStats = async (url: string, filterOpponent: string) => {
  try {
    if (!url) {
      console.warn("AgaintTeamStats: empty url");
      return {
        player: "",
        againstTeams: filterOpponent || "",
        battingStats: [],
        bowlingStats: [],
      };
    }

    const $ = await GetHtml(url);
    if (!$) {
      console.error("AgaintTeamStats: failed to load HTML for", url);
      return {
        player: "",
        againstTeams: filterOpponent || "",
        battingStats: [],
        bowlingStats: [],
      };
    }

    const headingText = $("div.tab-pane h2").first().text()?.trim() || "";
    const extractedPlayer = headingText.split(" Against")[0]?.trim() || "";

    // find nav-link hrefs robustly (case-insensitive)
    const navLinks = $("a.nav-link").toArray();
    const findHrefByText = (needle: string) => {
      const found = navLinks.find((el) =>
        ($(el).text() || "").toLowerCase().includes(needle.toLowerCase())
      );
      return found ? $(found).attr("href") || "" : "";
    };

    let battingTabHref = findHrefByText("bat");
    let bowlingTabHref = findHrefByText("bowl");

    // Fallback: find div IDs
    if (!battingTabHref) {
      const battingDiv = $("div[id$='-batting-stats']").first();
      battingTabHref = battingDiv.length ? `#${battingDiv.attr("id")}` : "";
    }
    if (!bowlingTabHref) {
      const bowlingDiv = $("div[id$='-bowling-stats']").first();
      bowlingTabHref = bowlingDiv.length ? `#${bowlingDiv.attr("id")}` : "";
    }

    const battingStats: any[] = [];
    const bowlingStats: any[] = [];

    const opponentToMatch = (filterOpponent || "").toLowerCase().trim();

    // helper to get trimmed text safely
    const textAt = (cols: any, idx: number) =>
      cols.eq(idx).text()?.trim() || "";

    // Parse batting rows
    if (battingTabHref) {
      $(`${battingTabHref} table tbody .tsuccess`).each((_, el) => {
        try {
          const cols = $(el).find("td");
          if (!cols || cols.length < 15) return; // ensure expected batting columns

          const team = textAt(cols, 0);
          if (team.toLowerCase() !== opponentToMatch) return;

          battingStats.push({
            team,
            year: textAt(cols, 1),
            mode: textAt(cols, 2),
            matches: textAt(cols, 3),
            innings: textAt(cols, 4),
            runs: textAt(cols, 5),
            balls: textAt(cols, 6),
            no: textAt(cols, 7),
            avg: textAt(cols, 8),
            sr: textAt(cols, 9),
            hs: textAt(cols, 10),
            fifty: textAt(cols, 11),
            hundred: textAt(cols, 12),
            fours: textAt(cols, 13),
            sixes: textAt(cols, 14),
          });
        } catch (e) {
          console.error("AgaintTeamStats: error parsing batting row:", e);
        }
      });
    } else {
      console.warn("AgaintTeamStats: batting tab selector not found for", url);
    }

    // Parse bowling rows
    if (bowlingTabHref) {
      $(`${bowlingTabHref} table tbody .tsuccess`).each((_, el) => {
        try {
          const cols = $(el).find("td");
          if (!cols || cols.length < 14) return; // ensure expected bowling columns

          const team = textAt(cols, 0);
          if (team.toLowerCase() !== opponentToMatch) return;

          bowlingStats.push({
            team,
            year: textAt(cols, 1),
            mode: textAt(cols, 2),
            matches: textAt(cols, 3),
            innings: textAt(cols, 4),
            balls: textAt(cols, 5),
            runs: textAt(cols, 6),
            wickets: textAt(cols, 7),
            sr: textAt(cols, 8),
            twoWkts: textAt(cols, 9),
            threeWkts: textAt(cols, 10),
            fiveWkts: textAt(cols, 11),
            econ: textAt(cols, 12),
            avg: textAt(cols, 13),
          });
        } catch (e) {
          console.error("AgaintTeamStats: error parsing bowling row:", e);
        }
      });
    } else {
      console.warn("AgaintTeamStats: bowling tab selector not found for", url);
    }

    return {
      player: extractedPlayer,
      againstTeams: filterOpponent,
      battingStats,
      bowlingStats,
    };
  } catch (err) {
    console.error(
      "AgaintTeamStats unexpected error:",
      (err as any)?.message || err
    );
    return {
      player: "",
      againstTeams: filterOpponent || "",
      battingStats: [],
      bowlingStats: [],
    };
  }
};

export const FindTeamName = async (teamName: string) => {
  try {
    if (!teamName) return { teamName: "", teamUrl: "" };

    // 1) Search directly using input
    let teamList: any[] = [];
    try {
      teamList = await GetTeamList(teamName);
    } catch (e) {
      console.error("FindTeamName: GetTeamList failed:", e);
      teamList = [];
    }

    // 2) If not found, try using Stats DB fallback
    if (!teamList || teamList.length === 0) {
      try {
        const teamDetails: any = await Stats.findOne({
          publicName: teamName,
        });
        if (teamDetails?.originalName) {
          teamList = await GetTeamList(teamDetails.originalName).catch(
            () => []
          );
        }
      } catch (dbErr) {
        console.error("FindTeamName: Stats.findOne error:", dbErr);
      }
    }

    // 3) Still no list? Return empty
    if (!teamList || teamList.length === 0) {
      return { teamName: "", teamUrl: "" };
    }

    // 4) Try to match team by name
    const findTeam = teamList.find(
      (team: any) =>
        team?.name?.toLowerCase?.().trim() === teamName.toLowerCase().trim()
    );

    if (!findTeam) {
      // No throw — just return empty response
      return { teamName: "", teamUrl: "" };
    }

    return {
      teamName: findTeam.name || "",
      teamUrl: findTeam.url?.startsWith("http")
        ? findTeam.url
        : `https://advancecricket.com${findTeam.url}`,
    };
  } catch (err) {
    console.error(
      "FindTeamName unexpected error:",
      (err as any)?.message || err
    );
    return { teamName: "", teamUrl: "" };
  }
};

export const TeamStats = async (reqTeamName: string) => {
  try {
    if (!reqTeamName) return [];

    // 1) Resolve team name + url
    const { teamName, teamUrl } = await FindTeamName(reqTeamName);
    if (!teamName || !teamUrl) {
      console.warn("TeamStats: FindTeamName returned empty for", reqTeamName);
      return [];
    }

    // 2) Extract slug and id safely
    const urlParts = (teamUrl || "").split("/").filter(Boolean);
    if (urlParts.length < 2) {
      console.warn("TeamStats: unexpected teamUrl format:", teamUrl);
      return [];
    }
    const teamSlug = urlParts[urlParts.length - 2] || "";
    const teamId = urlParts[urlParts.length - 1] || "";
    if (!teamSlug || !teamId) {
      console.warn("TeamStats: couldn't derive slug/id from", teamUrl);
      return [];
    }

    // 3) Construct fixtures URL (section anchor targets recent matches)
    const modifyUrl = `https://advancecricket.com/team-fixtures/${teamSlug}/${teamId}#${teamSlug}-recent-matches`;

    // 4) Load HTML
    const $ = await GetHtml(modifyUrl);
    if (!$) {
      console.error("TeamStats: failed to load HTML for", modifyUrl);
      return [];
    }

    // 5) Build section selector
    const sectionSelector = `#${teamSlug}-recent-matches`;
    const container = $(sectionSelector);
    if (!container || container.length === 0) {
      console.warn(
        "TeamStats: recent matches section not found:",
        sectionSelector
      );
      return [];
    }

    const matches: {
      match: string;
      teamName: string;
      team1: { name: string; image: string; score: string };
      team2: { name: string; image: string; score: string };
      result: string;
      title: string;
      url: string;
    }[] = [];

    // 6) Iterate match cards safely
    $(`${sectionSelector} .row .col a`).each((_, element) => {
      try {
        const el = $(element);
        const rawUrl = el.attr("href")?.trim() || "";
        const title = el.attr("title")?.trim() || "";
        const match =
          el.find("b.font-14.fw-light.text-secondary").text()?.trim() || "";

        if (!match || !title) return; // skip incomplete cards

        // normalize link
        const url = rawUrl.startsWith("http")
          ? rawUrl
          : rawUrl
          ? `https://advancecricket.com${rawUrl}`
          : "";

        // images (normalize)
        const teamImages = el
          .find("img.team-icon")
          .map((_, img) => {
            const src = $(img).attr("src")?.trim() || "";
            return src.startsWith("http")
              ? src
              : src
              ? `https://advancecricket.com${src}`
              : "";
          })
          .get();

        // short names
        const teamNames = el
          .find(".font-16.fw-bolder.mainhead")
          .map((_, n) => $(n).text()?.trim() || "")
          .get();

        // scores
        const scores = el
          .find(".d-flex.justify-content-between b.font-14.fw-bold.mainhead")
          .map((_, s) => $(s).text()?.trim() || "")
          .get();

        const result =
          el
            .find(".bg-light.text-info.text-center.py-1.font-12")
            .text()
            ?.trim() || "";

        const team1 = {
          name: teamNames[0] || "",
          image: teamImages[0] || "",
          score: scores[0] || "",
        };
        const team2 = {
          name: teamNames[1] || "",
          image: teamImages[1] || "",
          score: scores[1] || "",
        };

        matches.push({
          match,
          teamName,
          team1,
          team2,
          result,
          title,
          url,
        });
      } catch (rowErr) {
        console.error(
          "TeamStats: error parsing match card:",
          (rowErr as any)?.message || rowErr
        );
        // continue to next element
      }
    });

    if (matches.length === 0) {
      // no matches found — return empty to keep behavior consistent
      return [];
    }

    return { teamName, teamSlug, teamId, matches };
  } catch (err) {
    console.error("TeamStats unexpected error:", (err as any)?.message || err);
    return [];
  }
};
