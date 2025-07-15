import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const baseUrl = import.meta.env.VITE_BACKEND_URL;
export const baseQuery = () =>
  fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `${token}`);
      }

      return headers;
    },
  });
