import { GetConfidence, GetHint } from "@/lib/utils";

const squadAnanlysis = (team: any) => {
  const squad = team?.players ?? [];

  let totalImpactRun = 0;
  let totalImpactWicket = 0;
  let totalImpactRunConced = 0;

  squad.forEach((element: any) => {
    totalImpactRun += element.impactRun;
    totalImpactWicket += element.impactWicket;
    totalImpactRunConced += element.impactRunConced;
  });

  return {
    totalImpactRun,
    totalImpactWicket,
    totalImpactRunConced,
  };
};

const PrepareScore = (teamA: any, teamB: any) => {
  const baseAScore =
    (teamA.totalImpactRun + teamB.totalImpactRunConced) / 2 -
    teamB.totalImpactWicket * 5;

  const baseBScore =
    (teamB.totalImpactRun + teamA.totalImpactRunConced) / 2 -
    teamA.totalImpactWicket * 5;

  const roundedAScore = Math.round(baseAScore);
  const roundedBScore = Math.round(baseBScore);

  const totalScore = roundedAScore + roundedBScore;

  const teamAWinChance = totalScore
    ? ((roundedAScore / totalScore) * 100).toFixed(2)
    : 50;

  const teamBWinChance = totalScore
    ? ((roundedBScore / totalScore) * 100).toFixed(2)
    : 50;

  return {
    teamAPredictedScore: {
      score: roundedAScore,
      wicket:
        teamA.totalImpactWicket > 10 ? 10 : Math.round(teamA.totalImpactWicket),
    },
    teamBPredictedScore: {
      score: roundedBScore,
      wicket:
        teamB.totalImpactWicket > 10 ? 10 : Math.round(teamB.totalImpactWicket),
    },

    teamAWinChance: Number(teamAWinChance),
    teamBWinChance: Number(teamBWinChance),
  };
};

const getTopPerformers = (team: any) => {
  const squad = team?.players ?? [];

  const topRunner = [...squad].sort((a, b) => b.impactRun - a.impactRun)[0];

  const topWicketTaker = [...squad].sort(
    (a, b) => b.impactWicket - a.impactWicket,
  )[0];

  const keyPlayers = squad
    .sort((a: any, b: any) => b.impactScore - a.impactScore)
    .slice(0, 5);

  return {
    topRunner,
    topWicketTaker,
    keyPlayers,
  };
};

const generateDream11Team = (teamA: any, teamB: any) => {
  const teamAPlayers = (teamA?.players ?? []).map((p: any) => ({
    ...p,
    team: teamA.teamName,
  }));

  const teamBPlayers = (teamB?.players ?? []).map((p: any) => ({
    ...p,
    team: teamB.teamName,
  }));

  const allPlayers = [...teamAPlayers, ...teamBPlayers].sort(
    (a, b) => b.impactScore - a.impactScore,
  );

  const team: any[] = [];
  const teamCount: any = {};
  const roleCount: any = { WK: 0, BAT: 0, AR: 0, BOWL: 0 };

  const addPlayer = (player: any, roleType: string) => {
    if (team.length >= 11) return false;

    const currentTeamCount = teamCount[player.team] || 0;
    if (currentTeamCount >= 7) return false;

    if (team.find((p) => p.name === player.name)) return false;

    team.push(player);

    teamCount[player.team] = currentTeamCount + 1;
    roleCount[roleType]++;

    return true;
  };

  // WK
  allPlayers
    .filter((p) => p.isWK)
    .forEach((p) => {
      if (roleCount.WK < 1) addPlayer(p, "WK");
    });

  // BAT
  allPlayers
    .filter((p) => p.role === "Batter")
    .forEach((p) => {
      if (roleCount.BAT < 3) addPlayer(p, "BAT");
    });

  // AR
  allPlayers
    .filter((p) => p.role === "All Rounder")
    .forEach((p) => {
      if (roleCount.AR < 1) addPlayer(p, "AR");
    });

  // BOWL
  allPlayers
    .filter((p) => p.role === "Bowler")
    .forEach((p) => {
      if (roleCount.BOWL < 3) addPlayer(p, "BOWL");
    });

  // Fill remaining slots
  for (const p of allPlayers) {
    if (team.length >= 11) break;
    addPlayer(p, "BAT");
  }

  // Find captain & vice captain
  const sortedTeam = [...team].sort((a, b) => b.impactScore - a.impactScore);

  const captainName = sortedTeam[0]?.name;
  const viceCaptainName = sortedTeam[1]?.name;

  const finalTeam = team.map((player) => ({
    ...player,
    isCaptain: player.name === captainName,
    isViceCaptain: player.name === viceCaptainName,
  }));

  return finalTeam;
};

export const GetNewAnalysis = (data: any): any => {
  const preparedTeams = (data?.squads ?? []).map((team: any) => {
    let rankMultiplier = 1;

    const teamRank = (data?.matchInfo?.teams ?? []).find(
      (item: any) => item.teamShortName === team.teamName,
    );

    if (teamRank?.teamRank?.rank) {
      const maxRank = 147;
      const rank = Number(teamRank.teamRank.rank);

      const rankFactor = (maxRank - rank + 1) / maxRank;

      rankMultiplier = 0.8 + rankFactor * 0.4;
    }

    const squad = (
      team?.playingPlayers?.length
        ? team.playingPlayers
        : (team?.benchPlayers ?? [])
    ).map((player: any) => {
      const batting = player?.recentForm?.batting || [];
      const bowling = player?.recentForm?.bowling || [];
      const role = player?.role;

      let totalRuns = 0;
      let totalBalls = 0;
      let totalRunConceded = 0;
      let totalWickets = 0;

      // Batting
      batting.forEach((item: any) => {
        const score = item.score;

        const runs = parseInt(score.split(" ")[0]);

        const ballsMatch = score.match(/\((\d+)\)/);
        const balls = ballsMatch ? parseInt(ballsMatch[1]) : 0;

        totalRuns += runs;
        totalBalls += balls;
      });

      // Bowling
      bowling.forEach((item: any) => {
        const score = item.score;

        const [wicket, run] = score.split("-");

        totalWickets += parseInt(wicket);
        totalRunConceded += parseInt(run);
      });

      const avgTotalRun = batting.length ? totalRuns / batting.length : 0;
      const avgTotalBall = batting.length ? totalBalls / batting.length : 0;

      const avgRunConced = bowling.length
        ? totalRunConceded / bowling.length
        : 0;

      const avgWicket = bowling.length ? totalWickets / bowling.length : 0;

      const roleMultiplier: any = {
        Batter: { run: 1.1, wicket: 0.3, concede: 1.1 },
        Bowler: { run: 0.3, wicket: 1.1, concede: 0.8 },
        "All Rounder": { run: 0.7, wicket: 0.8, concede: 0.9 },
      };

      const multiplier = roleMultiplier[role] || {
        run: 1,
        wicket: 1,
        concede: 1,
      };

      const impactRun = avgTotalRun * multiplier.run * rankMultiplier;
      const impactWicket = avgWicket * multiplier.wicket * rankMultiplier;
      const impactRunConced =
        avgRunConced * multiplier.concede * rankMultiplier;

      const impactScore = impactRun + impactWicket * 25;

      return {
        name: player.name,
        shortName: player.shortName,
        role: player.role,
        isWK: player.isWK,
        image: player.image,
        style: player.style,

        impactRun,
        impactWicket,
        impactRunConced,
        impactScore,
      };
    });

    return {
      teamName: team.teamName,
      rank: teamRank?.teamRank?.rank ?? null,
      rankMultiplier,
      players: squad,
    };
  });

  const teamA = preparedTeams[0];
  const teamB = preparedTeams[1];

  let teamAScore = squadAnanlysis(teamA);
  let teamBScore = squadAnanlysis(teamB);

  const teamPrediction = PrepareScore(teamAScore, teamBScore);

  const teamATopPerformer = getTopPerformers(teamA);
  const teamBTopPerformer = getTopPerformers(teamB);

  const dream11Team = generateDream11Team(teamA, teamB);

  const hintData = GetHint(
    teamPrediction.teamAWinChance,
    teamPrediction.teamBWinChance,
  );

  return {
    team1: {
      name: data?.matchInfo?.teams[0]?.teamName ?? teamA.teamName,
      shortName: teamA?.teamName,
      flag: data?.matchInfo?.teams[0]?.teamFlagUrl,

      firstInnings: {
        min: Math.round(teamPrediction.teamAPredictedScore.score * 0.9),
        max: Math.round(teamPrediction.teamAPredictedScore.score * 1.1),
        predicted: teamPrediction.teamAPredictedScore.score,
        wickets: teamPrediction.teamAPredictedScore.wicket,
      },

      winnerPrediction: {
        probability: teamPrediction.teamAWinChance || 50,
        confidence: GetConfidence(teamPrediction.teamAWinChance || 50),
        hint: {
          hintMessage: hintData.team1.message,
          badgeColor: hintData.team1.badgeColor,
          color: hintData.team1.color,
        },
      },

      topBatsman: teamATopPerformer.topRunner,
      topBowler: teamATopPerformer.topWicketTaker,
      keyPlayers: teamATopPerformer.keyPlayers,
    },

    team2: {
      name: data?.matchInfo?.teams[1]?.teamName ?? teamB.teamName,
      shortName: teamB?.teamName,
      flag: data?.matchInfo?.teams[1]?.teamFlagUrl,

      firstInnings: {
        min: Math.round(teamPrediction.teamBPredictedScore.score * 0.9),
        max: Math.round(teamPrediction.teamBPredictedScore.score * 1.1),
        predicted: teamPrediction.teamBPredictedScore.score,
        wickets: teamPrediction.teamBPredictedScore.wicket,
      },

      winnerPrediction: {
        probability: teamPrediction.teamBWinChance || 50,
        confidence: GetConfidence(teamPrediction.teamBWinChance || 50),
        hint: {
          hintMessage: hintData.team1.message,
          badgeColor: hintData.team1.badgeColor,
          color: hintData.team1.color,
        },
      },

      topBatsman: teamBTopPerformer.topRunner,
      topBowler: teamBTopPerformer.topWicketTaker,
      keyPlayers: teamBTopPerformer.keyPlayers,
    },

    dream11Team,

    venueStats: data?.venueDetails?.stats?.matches
      ? data.venueDetails.stats
      : null,

    venueWeather: data?.venueDetails?.weather?.temperature
      ? data.venueDetails.weather
      : null,
  };
};
