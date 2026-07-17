import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CricketScore {
  runs: number;
  overs: string;
  balls: string;
  status: "COMPLETED" | "IN_PROGRESS";
  wickets: number;
}

interface Team {
  squadId: number;
  teamName: string;
  teamShortName: string;
  teamFlagUrl: string;
  isWinner: boolean | null;
  color: string;
  cricketScore: CricketScore[];
  squadNo: number | null;
}

interface Tour {
  id: number;
  name: string;
}

interface Match {
  _id: string;
  matchId: string;
  matchName: string;
  matchDescription: string;
  startTime: string;
  status: "NOT_STARTED" | "LIVE" | "COMPLETED" | "ABANDONED";
  venue: string;
  tour: Tour;
  format: string;
  sport: string;
  teams: Team[];
}

interface Player {
  id: string;
  name: string;
  role: string;
  battingStats: {
    matches: number;
    runs: number;
    average: number;
    strikeRate: number;
  };
  bowlingStats: {
    matches: number;
    wickets: number;
    economy: number;
    average: number;
  };
  fantasyPoints: number[];
  recentForm: string;
}

interface MatchState {
  matches: Match[];
  selectedMatch: Match | null;
  loading: boolean;
  error: string | null;
}

const initialState: MatchState = {
  matches: [],
  selectedMatch: null,
  loading: false,
  error: null,
};

const matchSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<Match[]>) => {
      state.matches = action.payload;
    },
    setSelectedMatch: (state, action: PayloadAction<Match>) => {
      state.selectedMatch = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMatches, setSelectedMatch, setLoading, setError } =
  matchSlice.actions;
export default matchSlice.reducer;
