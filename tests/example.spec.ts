import { test, expect } from "@playwright/test";

test("Main", async ({ page }) => {
  await page.goto("https://www.ikea.com/at/en/");
  await page.getByRole("button", { name: "Accept" }).click();
  await page.getByRole("combobox").first().click();
  await page.getByRole("combobox").first().fill("BILLY");
  await page.getByRole("combobox").first().press("Enter");
  await page
    .getByRole("button", { name: 'Add "BILLY Bookcase" to cart' })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Dismiss message" }).click();
  await page
    .locator("div")
    .filter({ hasText: "Hej!Add your postal code to" })
    .nth(5)
    .click();
  await page.getByRole("link", { name: "Shopping bag, 1 items" }).click();
  await expect(
    page.getByRole("heading", { name: "BILLY, blue bookcase, blue," }),
  ).toBeVisible();
});
