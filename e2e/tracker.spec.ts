import { test, expect } from "@playwright/test";

test.describe("MyDietTracker", () => {
  test("dashboard loads with calories and protein sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("Calories")).toBeVisible();
    await expect(page.getByText("Protein")).toBeVisible();
  });

  test("quick-add calories accumulates on dashboard", async ({ page }) => {
    await page.goto("/");

    // Add 500 calories
    await page.getByTestId("quick-calories-input").fill("500");
    await page.getByTestId("quick-calories-add-btn").click();
    await expect(page.getByTestId("quick-calories-total")).toContainText("500");

    // Add 300 more
    await page.getByTestId("quick-calories-input").fill("300");
    await page.getByTestId("quick-calories-add-btn").click();
    await expect(page.getByTestId("quick-calories-total")).toContainText("800");
  });

  test("navigates to day detail via dynamic route", async ({ page }) => {
    await page.goto("/day/2026-04-07");
    await expect(page.getByTestId("day-heading")).toBeVisible();
    await expect(page.locator("text=2026-04-07")).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "History" }).click();
    await expect(page).toHaveURL("/history");
    await expect(page.getByRole("heading", { name: "History" })).toBeVisible();

    await page.getByRole("link", { name: "Stats" }).click();
    await expect(page).toHaveURL("/stats");

    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page).toHaveURL("/settings");
  });

  test("undo removes last calorie entry on day detail", async ({ page }) => {
    await page.goto("/day/2026-01-15");

    // Add 500
    await page.getByTestId("calories-input").fill("500");
    await page.getByTestId("calories-add-btn").click();
    await expect(page.getByTestId("calories-total")).toContainText("500");

    // Add 300
    await page.getByTestId("calories-input").fill("300");
    await page.getByTestId("calories-add-btn").click();
    await expect(page.getByTestId("calories-total")).toContainText("800");

    // Undo last
    await page.getByTestId("calories-undo-btn").click();
    await expect(page.getByTestId("calories-total")).toContainText("500");
  });
});
