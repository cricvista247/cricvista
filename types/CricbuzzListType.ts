export type Source = Array<{
  scheduleAdWrapper: {
    date: string; // "FRI, NOV 14 2025"
    longDate: string;
    matchScheduleList: Array<{
      seriesName: string;
      seriesId: number;
      seriesCategory?: string;
      seriesHomeCountry?: number;
    }>;
    matchInfo: Array<{
      matchId: number;
      seriesId: number;
      matchDesc: string; // e.g. "1st Match"
      matchFormat: string; // e.g. "T20", "TEST"
      startDate: string; // "1763085600000" (ms)
      endDate: string; // "1763164799000" (ms)
      team1: {
        teamId: number;
        teamName: string;
        teamSName: string;
        imageId?: number;
        isFullMember?: boolean;
      };
      team2: {
        teamId: number;
        teamName: string;
        teamSName: string;
        imageId?: number;
        isFullMember?: boolean;
      };
      venueInfo?: {
        ground?: string;
        city?: string;
        country?: string;
        timezone?: string; // "+05:30"
      };
    }>;
  };
}>;

export type Target = {
  tourId: number | null;
  tourName: string | null;
  matchId: number;
  matchName: string | null; // not in source -> null
  matchDescription: string | null; // from matchDesc
  startTime: string | null; // ms
  endTime: string | null; // ms
  status: string | null; // not in source -> null
  venue: {
    ground: string | null;
    city: string | null;
    country: string | null;
    timezone: string | null;
  } | null;
  tour: string | null; // map from seriesCategory
  format: string | null; // matchFormat
  sport: string | null; // no sport.slug -> "cricket"
  teams: Array<{
    squadId: number; // map from teamId
    teamName: string;
    teamShortName: string;
    teamFlagUrl: string | null; // image URL unknown -> null
    isWinner: boolean | null; // not in source
    color: string | null; // not in source
    cricketScore: any | null; // not in source
    squadNo: number | null; // not in source
  }>;
};
