import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Complaint {
  id: string;
  subject: string;
  description: string;
  matchId?: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

interface HelpdeskState {
  complaints: Complaint[];
  loading: boolean;
  error: string | null;
}

const initialState: HelpdeskState = {
  complaints: [],
  loading: false,
  error: null,
};

const helpdeskSlice = createSlice({
  name: 'helpdesk',
  initialState,
  reducers: {
    setComplaints: (state, action: PayloadAction<Complaint[]>) => {
      state.complaints = action.payload;
    },
    addComplaint: (state, action: PayloadAction<Complaint>) => {
      state.complaints.unshift(action.payload);
    },
    updateComplaintStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const complaint = state.complaints.find(c => c.id === action.payload.id);
      if (complaint) {
        complaint.status = action.payload.status as any;
        complaint.updatedAt = new Date().toISOString();
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

export const { setComplaints, addComplaint, updateComplaintStatus, setLoading, setError } = helpdeskSlice.actions;
export default helpdeskSlice.reducer;