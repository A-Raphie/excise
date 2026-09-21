import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "/Users/raphie/.gemini/antigravity/brain/2acec0f8-2c9f-48d5-bc5e-d3fe24384a81";
const TARGET_URL = "https://tryexcise.netlify.app";

async function main() {
  console.log("Launching Chromium for modal & deduplication capture...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log(`Navigating to ${TARGET_URL}...`);
  await page.goto(TARGET_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // 1. Open Add Audit Modal and Capture (Verify photo removed!)
  console.log("Opening Add Audit Modal...");
  const addAuditButton = page.locator("button:has-text('Audit Bill')").first();
  await addAuditButton.click();
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "live_add_audit_no_photos.png"),
    fullPage: false,
  });

  // Close modal
  const closeButton = page.locator("button:has(svg.lucide-x)").first();
  if (await closeButton.isVisible()) {
    await closeButton.click();
    await page.waitForTimeout(800);
  }

  // 2. Navigate to Cockpit
  console.log("Navigating to Cockpit...");
  const docketNav = page.locator("nav button:has-text('Audit Docket')").first();
  await docketNav.click();
  await page.waitForTimeout(1500);

  // Open first line item drawer to verify duplicate strike button removed
  console.log("Expanding first line item drawer...");
  const firstRow = page.locator("tbody tr").first();
  await firstRow.click();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "live_cockpit_deduplicated_drawer.png"),
    fullPage: false,
  });

  console.log("Captures completed successfully!");
  await browser.close();
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
