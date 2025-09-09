import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query";
import { ICreateArticleServicePayload } from "../models/articles/service";
import { IArticle } from "../models/articles/store";

export const articlesApi = createApi({
  reducerPath: "api",
  baseQuery: baseQuery(),
  endpoints: (builder) => ({
    createArticle: builder.mutation<IArticle, ICreateArticleServicePayload>({
      query: (payload) => ({
        url: "/articles/",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export default articlesApi;
