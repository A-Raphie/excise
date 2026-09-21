import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const ARTIFACT_DIR = "/Users/raphie/.gemini/antigravity/brain/2acec0f8-2c9f-48d5-bc5e-d3fe24384a81";
const TARGET_URL = "https://tryexcise.netlify.app";

async function main() {
  console.log("Launching Chromium for visual verification...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log(`Navigating to ${TARGET_URL}...`);
  await page.goto(TARGET_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // 1. Enter Cockpit Surface 2
  console.log("Entering Live Cockpit Surface 2...");
  const docketNavButton = page.locator("nav button:has-text('Audit Docket')").first();
  await docketNavButton.click();
  await page.waitForTimeout(2000);

  // 2. Capture Calm Patient View (Default)
  console.log("Capturing Calm Patient View...");
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "live_patient_view_calm.png"),
    fullPage: false,
  });

  // 3. Switch to Forensic Ledger and Capture
  console.log("Switching to Forensic Ledger...");
  const forensicButton = page.locator("button:has-text('Forensic Ledger')").first();
  if (await forensicButton.isVisible()) {
    await forensicButton.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "live_forensic_ledger_toggle.png"),
      fullPage: false,
    });
  }

  // 4. Switch to Chargemaster Directory tab and Capture
  console.log("Navigating to Chargemaster Directory tab...");
  const chargemasterTab = page.locator("button:has-text('Chargemaster Intel')").first();
  if (await chargemasterTab.isVisible()) {
    await chargemasterTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "live_simplified_chargemaster.png"),
      fullPage: false,
    });
  }

  // 5. Switch to Proof & Evidence Rail and Capture
  console.log("Navigating to Proof & Evidence Rail tab...");
  const proofNavButton = page.locator("nav button:has-text('Receipts & Proof')").first();
  await proofNavButton.click();
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "live_assurance_proof_rail.png"),
    fullPage: false,
  });

  console.log("All calm visual verification captures completed!");
  await browser.close();
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
