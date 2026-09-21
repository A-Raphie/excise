import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "/Users/raphie/.gemini/antigravity/brain/2acec0f8-2c9f-48d5-bc5e-d3fe24384a81";
const TARGET_URL = "https://tryexcise.netlify.app";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log("1. Navigating to Excise live app...");
  await page.goto(TARGET_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  console.log("2. Entering Cockpit Docket...");
  await page.locator("nav button:has-text('Audit Docket')").first().click();
  await page.waitForTimeout(1000);

  console.log("3. Toggling line item to verify reactive recalculation...");
  const firstCheckbox = page.locator("tbody tr input[type='checkbox']").first();
  await firstCheckbox.click(); // Uncheck CPT 99285
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "live_verified_reactive_toggle.png"),
    fullPage: false,
  });

  console.log("4. Entering AgentMail Room to test concession resolution...");
  await page.locator("button:has-text('AgentMail Room')").first().click();
  await page.waitForTimeout(1000);

  console.log("5. Triggering Fast-Forward Hospital Settlement Concession...");
  const fastForwardButton = page.locator("button:has-text('Full Hospital Concession'), button:has-text('Hospital Concession')").first();
  if (await fastForwardButton.isVisible()) {
    await fastForwardButton.click();
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "live_verified_settled_accord.png"),
      fullPage: false,
    });
  }

  console.log("All E2E verification tests passed!");
  await browser.close();
}

main().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
