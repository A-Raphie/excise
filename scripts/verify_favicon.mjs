import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "/Users/raphie/.gemini/antigravity/brain/2acec0f8-2c9f-48d5-bc5e-d3fe24384a81";
const TARGET_URL = "https://tryexcise.netlify.app";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("Navigating to https://tryexcise.netlify.app/icon.svg...");
  await page.goto("https://tryexcise.netlify.app/icon.svg", { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "live_new_favicon_rendered.png"),
  });

  console.log("Navigating to main site to verify page load...");
  await page.goto(TARGET_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Check favicon link in DOM
  const faviconHref = await page.$eval("link[rel*='icon']", el => el.href).catch(() => "none");
  console.log("Favicon href in DOM:", faviconHref);

  await browser.close();
}

main().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
