import { GetHtml } from "@/lib/utils";
import {
  ExtractKeyObject,
  FindMatchingClose,
  SplitTopLevelArrayItems,
  UnescapeJsStringLiteral,
} from "../schedule/CricBuzzScarbList";

export const extractRankingData = ($: any) => {
  let rankingData: any = null;

  $("script").each((_: any, element: any) => {
    const scriptContent = $(element).html();
    if (!scriptContent) return;

    if (!scriptContent.includes("formatTypesData")) return;

    const pushIdx = scriptContent.indexOf("self.__next_f.push");
    if (pushIdx === -1) return;

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
    const items = SplitTopLevelArrayItems(arrayText);

    let candidateStr: string | null = null;

    for (let it of items) {
      const un = UnescapeJsStringLiteral(it);
      if (un && un.includes("formatTypesData")) {
        candidateStr = un;
        break;
      }
    }

    if (!candidateStr) return;

    const parsed = ExtractKeyObject(candidateStr, "formatTypesData");

    if (parsed) {
      rankingData = parsed;
      return false;
    }
  });

  return rankingData;
};
export const TeamRank = async (
  teamName: string,
  type: "MEN" | "WOMEN",
  mode: "TEST" | "ODI" | "T20",
) => {
  const url =
    type === "MEN"
      ? "https://www.cricbuzz.com/cricket-stats/icc-rankings/men/teams"
      : "https://www.cricbuzz.com/cricket-stats/icc-rankings/women/teams";
  try {
    const $: any = await GetHtml(url);

    const data = extractRankingData($);
    if (!data) return null;

    const formatKey = mode.toLowerCase();
    const rankingArray = data?.[formatKey]?.rank;
    if (!rankingArray) return null;

    const team = rankingArray.find(
      (t: any) => t.name.toLowerCase() === teamName.toLowerCase(),
    );

    if (!team) return null;

    return {
      rank: Number(team.rank),
      team: team.name,
      rating: Number(team.rating) || 0,
      points: Number(team.points) || 0,
      matches: Number(team.matches) || 0,
      mode,
      type,
    };
  } catch (error) {
    return null;
  }
};
