import { test, expect } from "@playwright/test";
import { getAllBookings } from "./services/bookings.api";

test("booking page", async ({ page }) => {
  await page.goto("/bookings");
  const bookingHeading = page.getByRole("heading", { name: "All bookings" });
  await expect(bookingHeading).toBeVisible();

  const res = await getAllBookings();
  const data = await res.json();
  console.log("Booking data", data);
});
