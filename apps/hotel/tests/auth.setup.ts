import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";
const DASHBOARD_URL = `${BASE_URL}/dashboard`;
const LOGIN_URL = `${BASE_URL}/login`;

test("Login setup", async ({ page }) => {
  await page.goto(DASHBOARD_URL);

  await page.waitForURL(LOGIN_URL);
  expect(page.url()).toBe(LOGIN_URL);

  const loginPageTitle = page.getByText("Log in to your account");
  await expect(loginPageTitle).toBeVisible();

  const formContainer = page.locator("form");
  await expect(formContainer).toBeVisible();

  const emailInputField = formContainer.getByLabel("Email address");
  await expect(emailInputField).toBeVisible();
  await emailInputField.fill("gowtham@gowthamreilly.com");
  await expect(emailInputField).toHaveValue("gowtham@gowthamreilly.com");

  const passwordInputField = formContainer.getByLabel("Password");
  await expect(passwordInputField).toBeVisible();
  await passwordInputField.fill("Revolution@24");
  await expect(passwordInputField).toHaveValue("Revolution@24");

  const loginButton = formContainer.getByRole("button", { name: "Log in" });
  await loginButton.click();

  await page.waitForURL(DASHBOARD_URL);
  expect(page.url()).toBe(DASHBOARD_URL);

  await page.context().storageState({
    path: "auth.json",
  });
});
