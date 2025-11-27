import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { articlesApi } from "../services/articlesApi";
import type { User } from "../../types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: "idle",
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User | null; accessToken?: string | null }>,
    ) => {
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      if (action.payload.accessToken !== undefined) {
        state.accessToken = action.payload.accessToken;
      }
      if (action.payload.user) {
        state.status = "authenticated";
      } else if (action.payload.accessToken) {
        state.status = "loading";
      } else {
        state.status = "unauthenticated";
      }
      state.hydrated = action.payload.user ? true : state.hydrated;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "unauthenticated";
      state.hydrated = true;
    },
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.hydrated = action.payload;
      if (!action.payload) {
        state.status = "idle";
      }
    },
  },
});

export const { setCredentials, clearAuth, setHydrated } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [articlesApi.reducerPath]: articlesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, articlesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
