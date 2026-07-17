import { GetHtml } from "@/lib/utils";

export const CrexList = async (): Promise<any> => {
  const $: any = await GetHtml("https://crex.com/fixtures/match-list");

  const matches: any = [];

  $(".date-wise-matches-card > div").each((_: any, dateBlock: any) => {
    const matchDate = $(dateBlock).find(".date div").text().trim();

    $(dateBlock)
      .find("li.match-card-container")
      .each((_: any, matchEl: any) => {
        const link = $(matchEl).find("a.match-card-wrapper").attr("href");

        const teamEls = $(matchEl).find(".team-name");
        const scoreEls = $(matchEl).find(".team-score");
        const imgEls = $(matchEl).find(".team img");
        const oversEls = $(matchEl).find(".total-overs");

        const team1 = $(teamEls[0]).text().trim();
        const team2 = $(teamEls[1]).text().trim();

        const score1 = $(scoreEls[0]).text().trim() || null;
        const score2 = $(scoreEls[1]).text().trim() || null;

        const overs1 = $(oversEls[0]).text().trim() || "";
        const overs2 = $(oversEls[1]).text().trim() || "";

        const team1Flag = $(imgEls[0]).attr("src") || null;
        const team2Flag = $(imgEls[1]).attr("src") || null;

        const isLive = $(matchEl).find(".liveTag").length > 0;
        const isUpcoming = $(matchEl).find(".not-started").length > 0;

        let status: "LIVE" | "UPCOMING" | "COMPLETED";
        if (isLive) status = "LIVE";
        else if (isUpcoming) status = "UPCOMING";
        else status = "COMPLETED";

        const result =
          $(matchEl).find(".result span").first().text().trim() || null;

        const startTime = $(matchEl).find(".start-text").text().trim() || null;

        const description =
          $(matchEl).find(".time").text().replace(/\s+/g, " ").trim() || null;
        // const result =
        //   $(matchEl).find(".result span").first().text().trim() || null;

        matches.push({
          matchId: link?.split("/")[3] || null,
          url: link ? `https://crex.com${link}` : null,
          matchName: `${team1} vs ${team2}`,
          matchDescription: description,
          startTime,
          matchDate,
          status,
          format: description?.includes("T20")
            ? "T20"
            : description?.includes("ODI")
              ? "ODI"
              : null,
          sport: "cricket",
          teams: [
            {
              teamName: team1,
              teamShortName: team1.split(" ")[0],
              teamFlagUrl: team1Flag,
              cricketScore: score1 ? `${score1} (${overs1})` : null,
            },
            {
              teamName: team2,
              teamShortName: team2.split(" ")[0],
              teamFlagUrl: team2Flag,
              cricketScore: score2 ? `${score2} (${overs2})` : null,
            },
          ],
          score: {
            score: [
              score1 ? { team: team1, run: `${score1} (${overs1})` } : null,
              score2 ? { team: team2, run: `${score2} (${overs2})` } : null,
            ].filter(Boolean),
            result: result || "",
          },
        });
      });
  });

  return matches;
};
