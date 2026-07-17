import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  mobile: string;
  credits: number;
  subscriptionPlan: string;
  subscriptionExpiry: string;
  status: "active" | "suspended" | "banned";
  joinedDate: string;
  lastLogin: string;
}

interface AdminOrder {
  id: string;
  userId: string;
  userName: string;
  plan: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed" | "refunded";
  paymentMethod: string;
}

interface AdminTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

interface Player {
  id: string;
  originalName: string;
  publicName: string;
  team: string;
  dob: string;
  createdAt: string;
  updatedAt: string;
}

interface Stadium {
  id: string;
  name: string;
  publicName: string;
  country: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

interface FinanceStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  pendingPayments: number;
  refunds: number;
  averageOrderValue: number;
}

interface AdminState {
  users: AdminUser[];
  orders: AdminOrder[];
  tickets: AdminTicket[];
  players: Player[];
  stadiums: Stadium[];
  financeStats: FinanceStats;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  orders: [],
  tickets: [],
  players: [],
  stadiums: [],
  financeStats: {
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    pendingPayments: 0,
    refunds: 0,
    averageOrderValue: 0,
  },
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<AdminUser[]>) => {
      state.users = action.payload;
    },
    setOrders: (state, action: PayloadAction<AdminOrder[]>) => {
      state.orders = action.payload;
    },
    setTickets: (state, action: PayloadAction<AdminTicket[]>) => {
      state.tickets = action.payload;
    },
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    setStadiums: (state, action: PayloadAction<Stadium[]>) => {
      state.stadiums = action.payload;
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players.unshift(action.payload);
    },
    updatePlayer: (state, action: PayloadAction<Player>) => {
      const index = state.players.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.players[index] = action.payload;
      }
    },
    deletePlayer: (state, action: PayloadAction<string>) => {
      state.players = state.players.filter((p) => p.id !== action.payload);
    },
    addStadium: (state, action: PayloadAction<Stadium>) => {
      state.stadiums.unshift(action.payload);
    },
    updateStadium: (state, action: PayloadAction<Stadium>) => {
      const index = state.stadiums.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.stadiums[index] = action.payload;
      }
    },
    deleteStadium: (state, action: PayloadAction<string>) => {
      state.stadiums = state.stadiums.filter((s) => s.id !== action.payload);
    },
    setFinanceStats: (state, action: PayloadAction<FinanceStats>) => {
      state.financeStats = action.payload;
    },
    updateUserStatus: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) {
        user.status = action.payload.status as any;
      }
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status as any;
      }
    },
    updateTicketStatus: (
      state,
      action: PayloadAction<{ id: string; status: string; assignedTo?: string }>
    ) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket.status = action.payload.status as any;
        ticket.updatedAt = new Date().toISOString();
        if (action.payload.assignedTo) {
          ticket.assignedTo = action.payload.assignedTo;
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  setOrders,
  setTickets,
  setPlayers,
  setStadiums,
  addPlayer,
  updatePlayer,
  deletePlayer,
  addStadium,
  updateStadium,
  deleteStadium,
  setFinanceStats,
  updateUserStatus,
  updateOrderStatus,
  updateTicketStatus,
  setLoading,
  setError,
} = adminSlice.actions;

export default adminSlice.reducer;
