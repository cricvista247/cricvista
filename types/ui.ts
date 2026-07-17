export interface Player {
  id: number;
  name: string;
  shortName: string;
  batStyle: string;
  bowlStyle: string;
  imageUrl: { src: string };
  type: string;
  fantasyPoints: Array<{
    date: string;
    match: string;
    bat: string;
    bowl: string;
    field: string;
    total: string;
  }>;
  battingForm: Array<{
    date: string;
    match: string;
    bo: string;
    run: string;
    fours_sixes: string;
    sr: string;
    out: string;
  }>;
  bowlingForm: Array<{
    date: string;
    match: string;
    o: string;
    r: string;
    w: string;
    m: string;
    eco: string;
  }>;
  battingStats: Array<{
    year: string;
    mode: string;
    matches: string;
    innings: string;
    runs: string;
    balls: string;
    notOut: string;
    average: string;
    strikeRate: string;
    highScore: string;
    fifty: string;
    hundred: string;
    fours: string;
    sixes: string;
  }>;
  bowlingStats: Array<{
    year: string;
    mode: string;
    matches: string;
    innings: string;
    balls: string;
    runs: string;
    wicket: string;
    strikeRate: string;
    twoWicket: string;
    threeWicket: string;
    fiveWicket: string;
    economy: string;
    average: string;
  }>;
  overallStats: any;
  stadiumStats: any;
  againstTeamsStats: any;
}

export interface Squad {
  flag: string;
  color: string;
  shortName: string;
  playingPlayer: Player[];
  benchPlayer: Player[];
}

export interface MatchData {
  squadList: Squad[];
  stadiumStats: Array<{
    date: string;
    matchTitle: string;
    matchUrl: string;
    inn1Score: string;
    inn2Score: string;
  }>;
  matchInfo: {
    matchId: number;
    matchName: string;
    matchDescription: string;
    startTime: string;
    status: string;
    venue: string;
    tour: {
      id: number;
      name: string;
    };
    format: string;
    sport: string;
    teams: Array<{
      squadId: number;
      teamName: string;
      teamShortName: string;
      teamFlagUrl: string;
      isWinner: boolean | null;
      color: string;
      cricketScore: any[];
      squadNo: number | null;
    }>;
  };
  GroundWheather: any;
  overview: {
    groundAndWheather: {
      pitchType: string;
      avgScore: string;
      wheatherType: string;
      temprature: string;
    };
    stats: {
      recentMatch: Array<any>;
      h2h: {
        h2hStat: Array<any>;
        recentH2HMatch: Array<any>;
      };
      teamStrength: Array<any>;
    };
  };
}
