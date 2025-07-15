import { IUserLoginServicePayload, IUserResponse } from "@/models/auth/service";
import { IUser } from "@/models/auth/store";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query";

export const authApi = createApi({
  reducerPath: "api",
  baseQuery: baseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: IUser; token: string },
      IUserLoginServicePayload
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (res: IUserResponse) => {
        return {
          user: {
            id: res.id,
            name: res.name,
            email: res.email,
            articleCount: res.article_count || 0,
          },
          token: res.token,
        };
      },
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export default authApi;
