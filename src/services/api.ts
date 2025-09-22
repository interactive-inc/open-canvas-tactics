import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

/**
 * Base API configuration for RTK Query
 */
export const srpgApi = createApi({
  reducerPath: "srpgApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      // Add authentication headers if needed
      return headers
    },
  }),
  tagTypes: ["Unit", "Battle", "Save", "Campaign"],
  endpoints: () => ({}),
})
