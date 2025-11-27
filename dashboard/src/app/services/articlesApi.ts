import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, buildQueryString } from "../../utils/api";
import type { Article, Intent, PaginatedResponse, Topic } from "../../types";
import type { RootState } from "../store";

const PAGE_SIZE = 20;

const withArticlePatches = (
  articleId: string,
  updater: (article: Article) => void,
  dispatch: any,
  getState: () => RootState,
) => {
  const patches: { undo?: () => void }[] = [];
  const state = getState();
  const queries = (state as any)[articlesApi.reducerPath]?.queries ?? {};

  Object.values(queries).forEach((entry: any) => {
    const { endpointName, originalArgs } = entry ?? {};
    if (!endpointName) return;
    if (endpointName === "getArticles" || endpointName === "filterArticles") {
      try {
        const patch = dispatch(
          articlesApi.util.updateQueryData(endpointName, originalArgs, (draft: any) => {
            const items: Article[] | undefined = draft?.items ?? draft;
            const target = items?.find((a) => a.id === articleId);
            if (target) updater(target);
          }),
        );
        patches.push(patch as { undo?: () => void });
      } catch (error) {
        /* ignore cache misses */
      }
    }
  });

  try {
    const patch = dispatch(
      articlesApi.util.updateQueryData("getArticle", articleId, (draft) => {
        if (draft) updater(draft as Article);
      }),
    );
    patches.push(patch as { undo?: () => void });
  } catch (error) {
    /* ignore cache misses */
  }

  return patches;
};

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery,
  tagTypes: ["Articles", "Article", "Topics", "UserStats"],
  endpoints: (builder) => ({
    getArticles: builder.query<PaginatedResponse<Article>, { skip?: number; take?: number } | void>({
      query: (params) => {
        const skip = params?.skip ?? 0;
        const take = params?.take ?? PAGE_SIZE;
        return `/api/articles${buildQueryString({ skip, take })}`;
      },
      providesTags: (result) => [
        ...(result?.items?.map((article) => ({ type: "Article" as const, id: article.id })) ?? []),
        { type: "Articles", id: "LIST" },
        { type: "UserStats", id: "me" },
      ],
    }),
    getArticle: builder.query<Article, string>({
      query: (id) => `/api/articles/${id}`,
      providesTags: (result, error, id) => [
        { type: "Article", id },
        { type: "Articles", id: "LIST" },
        { type: "UserStats", id: "me" },
      ],
    }),
    filterArticles: builder.query<PaginatedResponse<Article>, {
      topicIds?: string[];
      intent?: string;
      skip?: number;
      take?: number;
      mode?: string;
    }>({
      query: ({ topicIds, intent, skip = 0, take = PAGE_SIZE, mode }) => {
        const topic_ids = topicIds?.join(",");
        return `/api/articles/filter${buildQueryString({ topic_ids, intent, skip, take, mode })}`;
      },
      providesTags: (result) => [
        ...(result?.items?.map((article) => ({ type: "Article" as const, id: article.id })) ?? []),
        { type: "Articles", id: "LIST" },
      ],
    }),
    getTopics: builder.query<Topic[], void>({
      query: () => "/api/topics",
      providesTags: [{ type: "Topics", id: "LIST" }],
    }),
    getTrendingIntents: builder.query<Intent[], void>({
      query: () => "/api/intents/trending",
    }),
    deleteArticle: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/articles/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [
        { type: "Article", id },
        { type: "Articles", id: "LIST" },
        { type: "UserStats", id: "me" },
      ],
      async onQueryStarted(articleId, { dispatch, getState, queryFulfilled }) {
        const patches: { undo?: () => void }[] = [];
        const state = getState();
        const queries = (state as any)[articlesApi.reducerPath]?.queries ?? {};

        Object.values(queries).forEach((entry: any) => {
          const { endpointName, originalArgs } = entry ?? {};
          if (endpointName === "getArticles" || endpointName === "filterArticles") {
            try {
              const patch = dispatch(
                articlesApi.util.updateQueryData(endpointName, originalArgs, (draft: any) => {
                  const items: Article[] | undefined = draft?.items ?? draft;
                  if (Array.isArray(items)) {
                    const idx = items.findIndex((a) => a.id === articleId);
                    if (idx >= 0) items.splice(idx, 1);
                  }
                }),
              );
              patches.push(patch as { undo?: () => void });
            } catch (error) {
              /* ignore cache misses */
            }
          }
        });
        try {
          await queryFulfilled;
        } catch (error) {
          patches.forEach((p) => p.undo?.());
        }
      },
    }),
    markRead: builder.mutation<Article, string>({
      query: (id) => ({ url: `/api/articles/${id}/read`, method: "PATCH" }),
      invalidatesTags: (result, error, id) => [
        { type: "Article", id },
        { type: "Articles", id: "LIST" },
        { type: "UserStats", id: "me" },
      ],
      async onQueryStarted(articleId, { dispatch, getState, queryFulfilled }) {
        const patches = withArticlePatches(
          articleId,
          (article) => {
            article.isRead = !article.isRead;
          },
          dispatch,
          getState,
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patches.forEach((p) => p.undo?.());
        }
      },
    }),
    toggleBookmark: builder.mutation<Article, string>({
      query: (id) => ({ url: `/api/articles/${id}/bookmark`, method: "PATCH" }),
      invalidatesTags: (result, error, id) => [
        { type: "Article", id },
        { type: "Articles", id: "LIST" },
        { type: "UserStats", id: "me" },
      ],
      async onQueryStarted(articleId, { dispatch, getState, queryFulfilled }) {
        const patches = withArticlePatches(
          articleId,
          (article) => {
            article.isBookmarked = !article.isBookmarked;
          },
          dispatch,
          getState,
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patches.forEach((p) => p.undo?.());
        }
      },
    }),
    resummarize: builder.mutation<Article, string>({
      query: (id) => ({ url: `/api/articles/${id}/resummarize`, method: "POST" }),
      invalidatesTags: (result, error, id) => [
        { type: "Article", id },
        { type: "Articles", id: "LIST" },
      ],
      async onQueryStarted(articleId, { dispatch, getState, queryFulfilled }) {
        const patches = withArticlePatches(
          articleId,
          (article) => {
            article.summary = "Regenerating summary...";
          },
          dispatch,
          getState,
        );
        try {
          const { data } = await queryFulfilled;
          const applyResult = withArticlePatches(
            articleId,
            (article) => {
              article.summary = data.summary;
            },
            dispatch,
            getState,
          );
          // no rollback needed on success patch
          applyResult.forEach(() => null);
        } catch (error) {
          patches.forEach((p) => p.undo?.());
        }
      },
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useFilterArticlesQuery,
  useGetTopicsQuery,
  useGetTrendingIntentsQuery,
  useDeleteArticleMutation,
  useMarkReadMutation,
  useToggleBookmarkMutation,
  useResummarizeMutation,
} = articlesApi;

export const DEFAULT_PAGE = { skip: 0, take: PAGE_SIZE } as const;
