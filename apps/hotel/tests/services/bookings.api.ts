import { request } from "@playwright/test";

const accessToken = process.env.ACCESS_TOKEN!;

const API_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const API_URL = process.env.VITE_SUPABASE_URL!;

const context = await request.newContext({
  baseURL: API_URL,
  extraHTTPHeaders: {
    apiKey: API_KEY,
    Authorization: `Bearer ${accessToken}`,
  },
});

export const getAllBookings = async () => {
  return context.get(`/rest/v1/bookings`);
};
