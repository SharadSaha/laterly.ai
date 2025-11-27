import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../utils/api";
import type { User } from "../../types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["UserStats"],
  endpoints: (builder) => ({
    login: builder.mutation<{ access_token?: string }, { email: string; password: string }>(
      {
        query: (body) => ({
          url: "/api/auth/login",
          method: "POST",
          body,
        }),
      },
    ),
    me: builder.query<User, void>({
      query: () => ({ url: "/api/me" }),
      providesTags: [{ type: "UserStats", id: "me" }],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      invalidatesTags: [{ type: "UserStats", id: "me" }],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;
