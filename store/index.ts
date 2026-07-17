import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import matchSlice from "./slices/matchSlice";
import subscriptionSlice from "./slices/subscriptionSlice";
import helpdeskSlice from "./slices/helpdeskSlice";
import adminSlice from "./slices/adminSlice";
import notificationSlice from "./slices/notificationSlice";
import storage from "redux-persist/lib/storage";
// import storage from "redux-persist/lib/storage/session";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
  persistStore,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  matches: matchSlice,
  subscription: subscriptionSlice,
  helpdesk: helpdeskSlice,
  admin: adminSlice,
  notification: notificationSlice,
});

const persistReducers = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
