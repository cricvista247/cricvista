import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionPlan {
  _id: string;
  type: string;
  name: string;
  price: number;
  credits: number;
  description: string;
  popular: boolean;
  features: string[];
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface SubscriptionState {
  plans: SubscriptionPlan | null;
  orderHistory: any;
}

const initialState: SubscriptionState = {
  plans: null,
  orderHistory: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<SubscriptionPlan | null>) => {
      state.plans = action.payload;
    },
    setOrderHistory: (state, action: PayloadAction<any>) => {
      state.orderHistory = action.payload;
    },
  },
});

export const { setPlans, setOrderHistory } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
