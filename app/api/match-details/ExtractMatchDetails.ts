import { CrexDetails } from "./CrexDetails";
import { fetchSquadWithDetails } from "./FetchSquad";

const cleanPlayer = (player: any) => ({
  ...player,
  careerStats: {
    ...player?.careerStats,
    bowling: (player?.careerStats?.bowling ?? []).filter(
      (item: any) =>
        !item?.format || !item.format.toLowerCase().includes("debut"),
    ),
  },
});
export const ExtractMatchDetails = async (url: string) => {
  try {
    const overviewData = await CrexDetails(`${url}/match-details`);
    const squadData = await fetchSquadWithDetails(`${url}/match-details`);

    const cleanedSquads = (squadData ?? []).map((team: any) => ({
      ...team,
      playingPlayers: (team?.playingPlayers ?? []).map(cleanPlayer),
      benchPlayers: (team?.benchPlayers ?? []).map(cleanPlayer),
    }));

    return { squads: cleanedSquads, ...overviewData };
  } catch (error) {
    return null;
  }
};
