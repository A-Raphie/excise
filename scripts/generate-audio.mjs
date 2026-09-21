import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const API_KEY = "sk_sp9oujj3tncjcu3unzsfygj0p24we8yj674i52pdtfhtbexs";
const VOICE_ID = "minimax_273587280617670";
const SPEED = "1.0";
const TOTAL_DURATION = 165;

const outputDir = path.resolve("videos/excise-showcase/audio");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const beats = [
  {
    id: "beat-1-hook",
    name: "Scene 1: The Predatory Hook & Front Door",
    text: "Every year, millions of emergency room patients receive bills inflated by five hundred percent over actual hospital cash rates. Under federal law forty-five CFR part one eighty, hospitals are mandated to publish their real machine-readable prices. But finding and enforcing those numbers has been impossible for ordinary patients. Excise changes that.",
    targetStartMs: 500, // 0.5s
  },
  {
    id: "beat-2-add-audit",
    name: "Scene 2: The Add Audit Journey & Ingestion",
    text: "Adding an audit takes seconds. Patients can drag and drop any medical bill scan or select from authentic hospital chargemaster specimens. When you trigger the audit, Excise initiates an autonomous three-stage pipeline: Firecrawl indexes the provider's federal machine-readable file, OpenAI audits clinical acuity and CPT unbundling, and AgentMail provisions a verified settlement inbox. In milliseconds, the new case is committed to the Convex database and loaded into the audit cockpit.",
    targetStartMs: 16500, // 16.5s
  },
  {
    id: "beat-3-calm-hud",
    name: "Scene 3: Cockpit HUD & Calm Patient Mode",
    text: "Instead of overwhelming patients with dense walls of spreadsheet data, our calm patient view distills complex hospital charges into four clear columns: the procedure, the statutory violation, the legal safe harbor, and the exact dollar reduction. Here, Marcus Vance's fourteen thousand dollar emergency visit is immediately reduced to thirty-seven hundred dollars, excising over eleven thousand dollars in overcharges.",
    targetStartMs: 38500, // 38.5s
  },
  {
    id: "beat-4-coding-forensics",
    name: "Scene 4: Medical Coding Forensic Inspection",
    text: "Clicking inspect reveals the forensic breakdown. OpenAI analyzes clinical documentation against AMA and CMS guidelines, exposing when hospitals upcode standard emergency visits to Level 5 trauma fees without resuscitation criteria, or unbundle routine CT scans into redundant facility charges.",
    targetStartMs: 54500, // 54.5s
  },
  {
    id: "beat-5-reactive-recalc",
    name: "Scene 5: Instant Reactive Settlement Recalculation",
    text: "Backed by Convex real-time reactive subscriptions, every dispute strike synchronizes across clients instantly. Toggling a line item recalculates statutory settlements across the entire case docket in under ten milliseconds, with zero page reloads, zero network delay, and zero stale state.",
    targetStartMs: 72500, // 72.5s
  },
  {
    id: "beat-6-chargemaster-intel",
    name: "Scene 6: Chargemaster Intel Directory",
    text: "In the Chargemaster Intel directory, patients and healthcare attorneys can search across hospital facilities nationwide. Excise cross-references real hospital chargemasters against official CMS median cash benchmarks, proving that hospital markups frequently exceed eight times the legal allowable rate.",
    targetStartMs: 92500, // 92.5s
  },
  {
    id: "beat-7-statutory-letter",
    name: "Scene 7: Statutory Safe Harbor Dispute Letter",
    text: "Excise immediately generates a formal statutory dispute notice. It cites federal price transparency mandates, No Surprises Act safe harbors, and official CMS cash benchmarks, turning legal theory into an actionable settlement package addressed directly to hospital billing directors.",
    targetStartMs: 108500, // 108.5s
  },
  {
    id: "beat-8-agentmail-negotiation",
    name: "Scene 8: AgentMail 2-Way Negotiation Loop",
    text: "Patients never have to spend hours arguing with hospital billing departments on the phone. Our autonomous AgentMail loop provisions a dedicated case inbox and dispatches cryptographically verified settlement offers. When the hospital responds with an unbundling concession, the four-step negotiation stepper automatically updates to settled, securing the savings with complete cryptographic receipts.",
    targetStartMs: 122500, // 122.5s
  },
  {
    id: "beat-9-proof-terminal",
    name: "Scene 9: Cryptographic Proof Rail & Terminal Backend",
    text: "Every settlement is sealed with SHA-256 cryptographic provenance. On the backend, Convex handles relational case indexing, automated mutations, and live client synchronization with strict end-to-end type safety across every query and mutation.",
    targetStartMs: 144500, // 144.5s
  },
  {
    id: "beat-10-outro",
    name: "Scene 10: Master Outro & Submission Checklist",
    text: "Excise is live in production right now. Test the interactive docket, read our build log, and inspect the codebase at the links below.",
    targetStartMs: 160000, // 160.0s
  }
];

async function generateBeat(beat) {
  const destPath = path.join(outputDir, `${beat.id}.mp3`);
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    console.log(`⏩ [${beat.id}] already exists (${fs.statSync(destPath).size} bytes), skipping generation.`);
    return { ...beat, audioPath: destPath };
  }

  console.log(`\n🎙️ Generating [${beat.id}]: "${beat.text.slice(0, 60)}..."`);
  const form = new FormData();
  form.append("text", beat.text);
  form.append("voice_id", VOICE_ID);
  form.append("speed", SPEED);

  const initRes = await fetch("https://api.ai33.pro/v3/text-to-speech", {
    method: "POST",
    headers: { "xi-api-key": API_KEY },
    body: form
  });

  const initData = await initRes.json();
  if (!initData.task_id) {
    throw new Error(`Failed to initialize task for ${beat.id}: ${JSON.stringify(initData)}`);
  }

  const taskId = initData.task_id;
  console.log(`Task ID: ${taskId}. Polling for completion...`);

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(`https://api.ai33.pro/v1/task/${taskId}`, {
      headers: { "xi-api-key": API_KEY }
    });
    const pollData = await pollRes.json();

    if (pollData.status === "done") {
      const audioUrl = pollData.metadata?.audio_url;
      console.log(`Done! Downloading from CDN: ${audioUrl}`);

      const audioRes = await fetch(audioUrl);
      const buffer = Buffer.from(await audioRes.arrayBuffer());
      fs.writeFileSync(destPath, buffer);
      console.log(`✅ Saved ${buffer.length} bytes to ${destPath}`);
      return { ...beat, audioPath: destPath };
    }

    if (pollData.status === "error") {
      throw new Error(`TTS generation error for ${beat.id}: ${JSON.stringify(pollData)}`);
    }
  }

  throw new Error(`Timeout waiting for task ${taskId}`);
}

async function main() {
  console.log("=================================================");
  console.log(`🚀 Generating 10 VO Beats for ${TOTAL_DURATION}s Master Cut...`);
  console.log("=================================================");

  const results = [];
  for (const beat of beats) {
    const res = await generateBeat(beat);
    results.push(res);
  }

  const manifestPath = path.join(outputDir, "manifest-165s.json");
  fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Manifest saved to: ${manifestPath}`);

  // Assemble full VO track with adelay
  console.log(`\n=== Assembling ${TOTAL_DURATION}s Full VO Track ===`);
  const inputArgs = results.flatMap((b) => ["-i", b.audioPath]);
  const delayFilters = results
    .map((b, i) => `[${i}:a]adelay=${b.targetStartMs}|${b.targetStartMs}[a${i}]`)
    .join(";");
  const mixInputs = results.map((_, i) => `[a${i}]`).join("");
  const voFilter = `${delayFilters};${mixInputs}amix=inputs=${results.length}:dropout_transition=0:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=10[vo]`;

  const voTrackPath = path.join(outputDir, "vo-165s-full.wav");
  const cmdVO = `ffmpeg -y ${inputArgs.join(" ")} -filter_complex "${voFilter}" -map "[vo]" -t ${TOTAL_DURATION} "${voTrackPath}"`;
  console.log("Running ffmpeg VO assembly...");
  execSync(cmdVO, { stdio: "inherit" });

  // Mix with BGM using sidechain ducking
  console.log("\n=== Mixing Voiceover and BGM with Sidechain Ducking ===");
  const bgmPath = path.join(outputDir, "bgm.mp3");
  const mixedTrackPath = path.join(outputDir, "excise-showcase-audio.mp3");

  // Loop BGM to cover 165s
  const mixFilter = `
  [1:a]aloop=loop=-1:size=2e+09,atrim=0:${TOTAL_DURATION},asetpts=PTS-STARTPTS,afade=t=in:ss=0:d=1.5,afade=t=out:st=${TOTAL_DURATION - 4}:d=4,volume=0.16[bgm];
  [bgm][0:a]sidechaincompress=threshold=0.03:ratio=4:attack=50:release=350[ducked_bgm];
  [0:a][ducked_bgm]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[out]
  `.replace(/\n/g, "");

  const cmdMix = `ffmpeg -y -i "${voTrackPath}" -i "${bgmPath}" -filter_complex "${mixFilter}" -map "[out]" -b:a 256k -t ${TOTAL_DURATION} "${mixedTrackPath}"`;
  console.log("Running ffmpeg BGM + VO mix...");
  execSync(cmdMix, { stdio: "inherit" });

  console.log(`\n🎉 Master audio successfully mixed at: ${mixedTrackPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
