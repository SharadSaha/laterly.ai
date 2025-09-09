import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const baseUrl = import.meta.env.VITE_BACKEND_URL;
export const baseQuery = () =>
  fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: async (headers) => {
      let token = localStorage.getItem("token");
      const chromeToken: string | undefined = await new Promise((resolve) => {
        chrome.storage.local.get(["token"], (result) => {
          resolve(result?.token);
        });
      });

      if (chromeToken) {
        token = chromeToken;
      }

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });
