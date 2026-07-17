import { GetHtml } from "@/lib/utils";

export const CrexMatchScorecard = async (url: string) => {
  const $ = await GetHtml(url);
  if (!$) return null;

  /* ================= RESULT ================= */

  const result = $(".result-box span")
    .first()
    .text()
    .replace(/\s+/g, " ")
    .trim();

  /* ================= TEAMS ================= */

  const teams: any[] = [];

  $(".team-tab").each((_, el) => {
    const teamName = $(el).find(".team-name").text().trim();

    const score = $(el).find(".score-over span").first().text().trim();

    const overs = $(el)
      .find(".score-over .over")
      .text()
      .replace(/[()]/g, "")
      .trim();

    const flagUrl =
      $(el).find("img").attr("src") ||
      $(el).find("img").attr("data-src") ||
      null;

    if (teamName && score) {
      teams.push({
        name: teamName,
        score,
        overs,
        flagUrl,
      });
    }
  });

  return {
    result: result || null,
    teams,
  };
};
