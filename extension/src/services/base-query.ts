import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const baseUrl = import.meta.env.VITE_BACKEND_URL;
export const baseQuery = () =>
  fetchBaseQuery({
    baseUrl,
    credentials: "include",
    // Be tolerant of non-JSON bodies from the backend (e.g., 201 with empty body).
    responseHandler: async (response) => {
      const text = await response.text();
      if (!text) return null;
      try {
        return JSON.parse(text);
      } catch (error) {
        console.warn("Falling back to plain text response", error);
        return text;
      }
    },
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
