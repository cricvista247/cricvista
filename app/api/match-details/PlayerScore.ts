import { getBrowser } from "@/lib/browser";

export const PlayerScore = async (playerUrl: string, scorecardUrl: string, existingBrowser?: any) => {
  const browser = existingBrowser || (await getBrowser());
  const page = await browser.newPage();

  try {
    await page.goto(scorecardUrl, { waitUntil: "networkidle2" });

    // ✅ Wait for team selection tabs
    await page.waitForSelector(".team-score-card", { timeout: 15000 }).catch(() => null);

    const data = await page.evaluate(async (playerUrl: string) => {
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
      
      const teamTabs = Array.from(document.querySelectorAll(".team-score-card"));
      
      // Match Format Extraction
      const matchHeader = document.querySelector(".match-info-header")?.textContent || "";
      let matchFormat = 20;
      if (matchHeader.toLowerCase().includes("odi")) matchFormat = 50;
      else if (matchHeader.toLowerCase().includes("t20")) matchFormat = 20;
      else if (matchHeader.toLowerCase().includes("t10")) matchFormat = 10;
      else if (matchHeader.toLowerCase().includes("test")) matchFormat = 100;

      let finalPlayer: any = null;

      for (let i = 0; i < teamTabs.length; i++) {
        // Click Team Tab
        (teamTabs[i] as HTMLElement).click();
        await delay(500); // Wait for Angular render

        const teamName = teamTabs[i].querySelector(".team-name")?.textContent?.trim() || "";
        const cards = document.querySelectorAll(".card.score-card");

        cards.forEach((card) => {
          const header = card.querySelector(".card-header")?.textContent?.trim().toUpperCase() || "";
          const isBatting = header.includes("BATTING");
          const isBowling = header.includes("BOWLING");

          if (!isBatting && !isBowling) return;

          const table = card.querySelector("table");
          const rows = table?.querySelectorAll("tbody tr") || [];

          rows.forEach((row, rowIndex) => {
            const a = row.querySelector("a");
            const href = a?.getAttribute("href");
            const fullUrl = href ? "https://crex.com" + href : null;

            if (fullUrl === playerUrl) {
              if (!finalPlayer) {
                finalPlayer = {
                  name: a?.textContent?.trim() || "",
                  batting: 0,
                  bowling: 0,
                  ballFaced: 0,
                  overs: 0,
                  position: null,
                  matchFormat,
                  teamName,
                };
              }

              const tds = row.querySelectorAll("td");
              if (isBatting) {
                finalPlayer.batting = Number(tds[1]?.textContent?.trim() || 0);
                finalPlayer.ballFaced = Number(tds[2]?.textContent?.trim() || 0);
                finalPlayer.position = rowIndex + 1;
              } else if (isBowling) {
                finalPlayer.overs = Number(tds[1]?.textContent?.trim() || 0);
                finalPlayer.bowling = Number(tds[4]?.textContent?.trim() || 0);
              }
            }
          });
        });

        if (finalPlayer) break; // Exit loop if player found
      }

      return finalPlayer;
    }, playerUrl);

    return data;
  } catch (err) {
    console.error("PlayerScore Error:", err);
    return null;
  } finally {
    await page.close();
    if (!existingBrowser && browser) {
      await browser.close().catch(() => null);
    }
  }
};

