// import puppeteer from "puppeteer";

import { getBrowser } from "@/lib/browser";

// Rate limiting helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const SquadList = async (url: string, squad: any[]) => {
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);

    await page
      .goto(url, { waitUntil: "networkidle2", timeout: 60000 })
      .catch(() => null);

    // ✅ wait some safe selector
    await page.waitForSelector("body", { timeout: 15000 }).catch(() => null);

    /* ===============================
 SQUADS (BEFORE + AFTER TOSS)
 =============================== */

    // Toss (null before toss)
    const toss = await page
      .$eval(".toss-wrap p", (el) => el.textContent?.trim())
      .catch(() => null);

    const isAfterToss = Boolean(toss);

    // wait team buttons
    await page.waitForSelector(".playingxi-button").catch(() => null);
    const squads: {
      teamName: string;
      toss: any;
      playingPlayers: any[];
      benchPlayers: any[];
    }[] = [];

    const teamCount = await page
      .$$eval(".playingxi-button", (btns) => btns.length)
      .catch(() => 0);

    // helper → extract currently visible players
    const extractPlayers = async () => {
      try {
        await page
          .waitForFunction(
            () => document.querySelectorAll(".playingxi-card-row").length > 0,
            { timeout: 15000 },
          )
          .catch(() => null);
      } catch {
        console.log("⚠️ Players not loaded, continuing...");
      }

      return page
        .$$eval(".playingxi-card-row", (rows) =>
          rows.map((row) => {
            const a = row.querySelector("a");

            return {
              name: a?.getAttribute("title") || "",
              shortName:
                row.querySelector(".p-name")?.textContent?.trim() || "",
              role:
                row.querySelector(".bat-ball-type div")?.textContent?.trim() ||
                "",
              isWK: row.textContent?.includes("(WK)") || false,
              playerUrl: a?.getAttribute("href")
                ? "https://crex.com" + a.getAttribute("href")
                : null,
              image:
                row.querySelector(".img-card img")?.getAttribute("src") || null,
            };
          }),
        )
        .catch(() => []);
    };

    for (let i = 0; i < teamCount; i++) {
      const teamName = await page
        .$$eval(
          ".playingxi-button",
          (btns, idx) => btns[idx]?.textContent?.trim(),
          i,
        )
        .catch(() => `Team ${i + 1}`);

      // click team
      await page
        .evaluate((idx) => {
          const btn = document.querySelectorAll(".playingxi-button")[
            idx
          ] as HTMLElement;
          btn?.click();
        }, i)
        .catch(() => null);

      await delay(400);

      // expand bench AFTER toss (EVERY TEAM)
      if (isAfterToss) {
        await page
          .evaluate(() => {
            const arrow = document.querySelector("#bench-arrow") as HTMLElement;
            arrow?.scrollIntoView({ block: "center" });
            arrow?.click();
          })
          .catch(() => null);

        // wait until bench rows appear (>11)
        await page
          .waitForFunction(
            () => document.querySelectorAll(".playingxi-card-row").length > 0,
            { timeout: 5000 },
          )
          .catch(() => null);

        await delay(300);
      }

      const allPlayers = await extractPlayers();

      let playingPlayers: any[] = [];
      let benchPlayers: any[] = [];

      if (!isAfterToss) {
        // BEFORE toss → full squad
        benchPlayers = allPlayers;
      } else {
        // AFTER toss → split
        playingPlayers = allPlayers.slice(0, 11);
        benchPlayers = allPlayers.slice(11);
      }

      squads.push({
        teamName: teamName || "",
        toss,
        playingPlayers,
        benchPlayers,
      });
    }

    await page.close();

    const prepareSquad = squad.map((team: any) => {
      const liveTeam = squads.find((t: any) => t.teamName === team.teamName);
      if (!liveTeam) return team;

      const fullPlayerList = [...team.playingPlayers, ...team.benchPlayers];

      const updatedPlayingPlayers = fullPlayerList.filter((player) =>
        liveTeam.playingPlayers.some((lp) => lp.playerUrl === player.playerUrl),
      );

      const updatedBenchPlayers = fullPlayerList.filter(
        (player) =>
          !liveTeam.playingPlayers.some(
            (lp) => lp.playerUrl === player.playerUrl,
          ),
      );

      return {
        ...team,
        toss: liveTeam.toss,
        playingPlayers: updatedPlayingPlayers,
        benchPlayers: updatedBenchPlayers,
      };
    });

    return prepareSquad;
  } catch (error) {
    return squad;
  }
};
