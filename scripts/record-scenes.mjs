import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { injectCursor, moveCursor, clickCursor, typeCursor } from "./mac-cursor.js";

const TARGET_URL = "https://tryexcise.netlify.app";
const OUTPUT_DIR = path.resolve("videos/excise-showcase/media");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const requestedScenes = process.argv.slice(2);
function shouldRunScene(name) {
  if (requestedScenes.length === 0) return true;
  return requestedScenes.some((s) => name.includes(s));
}

async function enterCockpit(page) {
  await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(1000);
    const visible = await page.locator("text=Pre-Settlement Legal Safe Harbor Active").isVisible().catch(() => false);
    if (visible) return;
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Explore Sample Docket'));
      if (b) b.click();
    });
  }
  await page.waitForSelector("text=Pre-Settlement Legal Safe Harbor Active", { timeout: 12000 });
  await page.waitForTimeout(600);
}

async function switchTab(page, tabName, expectedSelector) {
  for (let i = 0; i < 6; i++) {
    const isVis = await page.locator(expectedSelector).first().isVisible().catch(() => false);
    if (isVis) return;
    await page.evaluate((name) => {
      const b = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes(name));
      if (b) b.click();
    }, tabName);
    await page.waitForTimeout(1000);
  }
  await page.waitForSelector(expectedSelector, { timeout: 12000 });
}

async function recordScene(name, targetDurationSec, setupFn, actionFn) {
  if (!shouldRunScene(name)) {
    console.log(`⏩ Skipping ${name} (not requested in CLI args)`);
    return;
  }
  console.log(`\n======================================================`);
  console.log(`🎬 Recording Scene: ${name} (target: ${targetDurationSec}s)...`);
  console.log(`======================================================`);
  const sceneDir = path.join(OUTPUT_DIR, `raw-${name}`);
  if (!fs.existsSync(sceneDir)) fs.mkdirSync(sceneDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: sceneDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();
  const t0 = Date.now();
  let tStartAction = t0;
  try {
    // 1. Setup phase: navigate, await elements, set tab (not part of trimmed video)
    await setupFn(page);
    await page.waitForTimeout(600); // brief stabilization
    tStartAction = Date.now();

    // 2. Action phase: choreographed user interactions with cursor
    await actionFn(page);

    // 3. Ensure we cover the full target duration
    const elapsed = (Date.now() - tStartAction) / 1000;
    if (elapsed < targetDurationSec) {
      await page.waitForTimeout(Math.ceil((targetDurationSec - elapsed) * 1000) + 600);
    }
  } catch (err) {
    console.error(`Error in scene ${name}:`, err);
    throw err;
  } finally {
    await context.close();
    await browser.close();
  }

  const files = fs.readdirSync(sceneDir).filter(f => f.endsWith(".webm"));
  if (files.length > 0) {
    files.sort((a, b) => fs.statSync(path.join(sceneDir, b)).mtimeMs - fs.statSync(path.join(sceneDir, a)).mtimeMs);
    const rawPath = path.join(sceneDir, files[0]);
    const finalMp4 = path.join(OUTPUT_DIR, `${name}.mp4`);
    const trimSec = Math.max(0, (tStartAction - t0) / 1000).toFixed(2);
    // Trim initial page load/setup and cap to target duration + 0.5s safety tail
    execSync(`ffmpeg -y -ss ${trimSec} -i "${rawPath}" -t ${targetDurationSec + 0.5} -c:v libx264 -pix_fmt yuv420p -crf 12 -preset medium -r 30 "${finalMp4}"`, { stdio: "ignore" });
    console.log(`✅ Saved MP4: ${finalMp4} (trimmed ${trimSec}s preamble, output ~${targetDurationSec}s)`);
    fs.rmSync(sceneDir, { recursive: true, force: true });
  }
}

async function runAll() {
  // SCENE 1: Predatory Hook & Front Door Hero (16s)
  await recordScene(
    "scene1-hook",
    16,
    async (page) => {
      await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1200);
      await page.waitForSelector("button:has-text('Audit Your Bill')", { timeout: 15000 });
      await injectCursor(page);
    },
    async (page) => {
      // Hover over high-authority badge
      await moveCursor(page, 320, 215, { duration: 700 });
      await page.waitForTimeout(800);

      // Smooth scroll through 5-beat hero
      await page.evaluate(() => window.scrollBy({ top: 280, behavior: "smooth" }));
      await page.waitForTimeout(1400);

      // Hover over primary CTA
      const cta = page.locator("button:has-text('Audit Your Bill')").first();
      await moveCursor(page, 520, 390, { duration: 800 });
      await page.waitForTimeout(1000);

      // Move to CDGI Controlled Demonstration Card
      await page.evaluate(() => window.scrollBy({ top: 220, behavior: "smooth" }));
      await page.waitForTimeout(1200);
      await moveCursor(page, 680, 480, { duration: 800 });
      await page.waitForTimeout(2000);
    }
  );

  // SCENE 2: Add Audit Journey & Ingestion Pipeline (24s)
  await recordScene(
    "scene2-add-audit",
    24,
    async (page) => {
      await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1200);
      await page.waitForSelector("button:has-text('Add Hospital Audit'), button:has-text('Audit Your Bill')", { timeout: 15000 });
      await injectCursor(page);
    },
    async (page) => {
      // Click Add Hospital Audit to open intake workstation modal
      const cta = page.locator("button:has-text('Add Hospital Audit'), button:has-text('Audit Your Bill')").first();
      await clickCursor(page, cta, { duration: 700 });
      await page.waitForSelector("text=Forensic Hospital Bill Intake Workstation", { timeout: 8000 });
      await page.waitForTimeout(800);

      // Select Memorial Regional specimen
      const specimen = page.locator("div:has-text('Emergency Room Tra')").last();
      if (await specimen.isVisible()) {
        await clickCursor(page, specimen, { duration: 700 });
        await page.waitForTimeout(800);
      }

      // Scroll inside modal to reveal fields
      await moveCursor(page, 720, 520, { duration: 600 });
      await page.waitForTimeout(600);

      // Click Run Autonomous Forensic Audit
      const auditBtn = page.locator("button:has-text('Run Autonomous Forensic Audit')").first();
      if (await auditBtn.isVisible()) {
        await clickCursor(page, auditBtn, { duration: 700 });
      }

      // Wait for 3-stage pipeline to execute and auto-route into Cockpit Docket
      await page.waitForSelector("text=Pre-Settlement Legal Safe Harbor Active", { timeout: 12000 });
      await page.waitForTimeout(1000);

      // Smoothly hover across the newly populated Docket in Cockpit
      await moveCursor(page, 520, 240, { duration: 800 });
      await page.waitForTimeout(800);
      await moveCursor(page, 800, 240, { duration: 800 });
      await page.waitForTimeout(1200);

      // Scroll down to the newly audited line items
      await page.evaluate(() => window.scrollBy({ top: 220, behavior: "smooth" }));
      await page.waitForTimeout(4000);
    }
  );

  // SCENE 3: Cockpit HUD & Calm Patient Mode (16s)
  await recordScene(
    "scene3-calm-hud",
    16,
    async (page) => {
      await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1200);
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Explore Sample Docket'));
        if (btn) btn.click();
      });
      await page.waitForSelector("text=Pre-Settlement Legal Safe Harbor Active", { timeout: 10000 });
      await injectCursor(page);
    },
    async (page) => {
      // Move across Unified Transformation Card ($14,850 -> $3,735)
      await moveCursor(page, 520, 240, { duration: 800 });
      await page.waitForTimeout(800);
      await moveCursor(page, 800, 240, { duration: 800 });
      await page.waitForTimeout(800);

      // Scroll down to the 4-column calm table
      await page.evaluate(() => window.scrollBy({ top: 220, behavior: "smooth" }));
      await page.waitForTimeout(1000);

      // Hover over first violation and statutory resolution
      await moveCursor(page, 550, 480, { duration: 700 });
      await page.waitForTimeout(1200);
      await moveCursor(page, 950, 480, { duration: 700 });
      await page.waitForTimeout(2000);
    }
  );

  // SCENE 4: OpenAI Medical Coding Forensics (18s)
  await recordScene(
    "scene4-coding-forensics",
    18,
    async (page) => {
      await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1200);
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Explore Sample Docket'));
        if (btn) btn.click();
      });
      await page.waitForSelector("text=Pre-Settlement Legal Safe Harbor Active", { timeout: 10000 });
      await page.evaluate(() => window.scrollBy({ top: 240 }));
      await page.waitForTimeout(400);
      await injectCursor(page);
    },
    async (page) => {
      // Click first table row to expand forensic drawer
      const firstRow = page.locator("tbody tr").first();
      await clickCursor(page, firstRow, { duration: 700 });
      await page.waitForTimeout(2000);

      // Move cursor over clinical acuity violation details
      await moveCursor(page, 650, 560, { duration: 800 });
      await page.waitForTimeout(1500);

      // Hover over second row (CPT 99070 supplies)
      const secondRow = page.locator("tbody tr").nth(2);
      if (await secondRow.isVisible()) {
        await moveCursor(page, 720, 680, { duration: 800 });
        await page.waitForTimeout(1500);
      }
    }
  );

  // SCENE 5: Convex Instant Reactive Settlement Recalculation (20s)
  await recordScene(
    "scene5-reactive-recalc",
    20,
    async (page) => {
      await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1200);
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Explore Sample Docket'));
        if (btn) btn.click();
      });
      await page.waitForSelector("text=Pre-Settlement Legal Safe Harbor Active", { timeout: 10000 });
      await page.evaluate(() => window.scrollBy({ top: 120 }));
      await page.waitForTimeout(400);
      await injectCursor(page);
    },
    async (page) => {
      // Move to dispute checkbox for CPT 99285
      const firstCheckbox = page.locator("tbody tr input[type='checkbox']").first();
      await clickCursor(page, firstCheckbox, { duration: 700 }); // UNCHECK

      // HOLD 4s: Showcase instantaneous Convex recalculation to $6,285
      await page.waitForTimeout(4000);

      // Move back to checkbox and RE-CHECK
      await clickCursor(page, firstCheckbox, { duration: 600 }); // RE-CHECK

      // Snaps back to $3,735 instantly
      await page.waitForTimeout(3500);
    }
  );

  // SCENE 6: Chargemaster Intel Directory (16s)
  await recordScene(
    "scene6-chargemaster-intel",
    16,
    async (page) => {
      await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1200);
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Explore Sample Docket'));
        if (btn) btn.click();
      });
      await page.waitForSelector("text=Pre-Settlement Legal Safe Harbor Active", { timeout: 10000 });
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Chargemaster Intel'));
        if (btn) btn.click();
      });
      await page.waitForSelector("input[placeholder*='Search by CPT']", { timeout: 10000 });
      await injectCursor(page);
    },
    async (page) => {
      // Type in search input
      const searchInput = page.locator("input[placeholder*='Search by CPT']").first();
      if (await searchInput.isVisible()) {
        await typeCursor(page, searchInput, "Stanford", { duration: 600 });
        await page.waitForTimeout(1200);
      }

      // Scroll down to cards
      await page.evaluate(() => window.scrollBy({ top: 240, behavior: "smooth" }));
      await page.waitForTimeout(1200);

      // Expand accordion on first card
      const accordionBtn = page.locator("button:has-text('Inspect Data')").first();
      if (await accordionBtn.isVisible()) {
        await clickCursor(page, accordionBtn, { duration: 600 });
        await page.waitForTimeout(2000);
      }
    }
  );

  // SCENE 7: Statutory Safe Harbor Dispute Letter (14s)
  await recordScene(
    "scene7-statutory-letter",
    14,
    async (page) => {
      await enterCockpit(page);
      await switchTab(page, "Statutory Demand Notice", "text=Statutory Dispute Demand Notice");
      await injectCursor(page);
    },
    async (page) => {
      // Scroll smoothly down through the statutory letter
      await page.evaluate(() => window.scrollBy({ top: 320, behavior: "smooth" }));
      await page.waitForTimeout(2000);
      await page.evaluate(() => window.scrollBy({ top: 320, behavior: "smooth" }));
      await page.waitForTimeout(2000);
      await moveCursor(page, 720, 480, { duration: 700 });
      await page.waitForTimeout(1500);
    }
  );

  // SCENE 8: AgentMail 2-Way Negotiation Loop (22s)
  await recordScene(
    "scene8-agentmail-negotiation",
    22,
    async (page) => {
      await enterCockpit(page);
      await switchTab(page, "AgentMail Room", "text=Autonomous Dispute Negotiation Chamber");
      await injectCursor(page);
    },
    async (page) => {
      // Click Copy Dedicated Case Inbox
      const copyInboxBtn = page.locator("button[title*='copy case inbox']").first();
      if (await copyInboxBtn.isVisible()) {
        await clickCursor(page, copyInboxBtn, { duration: 600 });
        await page.waitForTimeout(1000);
      }

      // Click Simulate Hospital Concession to fast-forward SLA
      const simulateBtn = page.locator("button:has-text('Simulate Supply Concession')").first();
      if (await simulateBtn.isVisible()) {
        await clickCursor(page, simulateBtn, { duration: 700 });
        await page.waitForTimeout(2000);
      }

      // Click Simulate Full Settlement
      const fullSettleBtn = page.locator("button:has-text('Simulate Full Settlement')").first();
      if (await fullSettleBtn.isVisible()) {
        await clickCursor(page, fullSettleBtn, { duration: 700 });
        await page.waitForTimeout(2000);
      }

      // Scroll to view settled transmissions
      await page.evaluate(() => window.scrollBy({ top: 220, behavior: "smooth" }));
      await page.waitForTimeout(2000);
    }
  );

  // SCENE 9: Cryptographic Proof Rail (16s)
  await recordScene(
    "scene9-proof-terminal",
    16,
    async (page) => {
      await enterCockpit(page);
      await switchTab(page, "Proof & Receipts", "text=Cryptographic State Sealed");
      await injectCursor(page);
    },
    async (page) => {
      // Move cursor across Human Assurance Strip
      await moveCursor(page, 450, 180, { duration: 800 });
      await page.waitForTimeout(1000);
      await moveCursor(page, 750, 180, { duration: 800 });
      await page.waitForTimeout(1000);

      // Scroll down to SHA-256 seal & cryptographic proof rail
      await page.evaluate(() => window.scrollBy({ top: 280, behavior: "smooth" }));
      await page.waitForTimeout(1500);
      await moveCursor(page, 620, 450, { duration: 700 });
      await page.waitForTimeout(2500);
    }
  );

  console.log("\n🎉 ALL 9 LIVE SCENES RECORDED WITH PRECISION!");
}

runAll().catch((err) => {
  console.error("Recording failed:", err);
  process.exit(1);
});
