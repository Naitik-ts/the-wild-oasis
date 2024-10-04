import { test, expect } from "@playwright/test";

test("C3: can display cabins page", async ({ page }) => {
  await page.goto("/cabins");

  const pageTitle = page.getByText("Our Luxury Cabin");

  await expect(pageTitle).toBeVisible();
});
