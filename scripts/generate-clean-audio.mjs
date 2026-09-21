import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const API_KEY = "sk_sp9oujj3tncjcu3unzsfygj0p24we8yj674i52pdtfhtbexs";
const VOICE_ID = "minimax_273587280617670";
const SPEED = "1.1";

const outputDir = path.resolve("videos/excise-showcase/audio/clean_beats");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const beats = [
  {
    id: "beat-01",
    scene: "scene1-hook",
    name: "Scene 1: The Predatory Hook & Front Door",
    text: "Every year, millions of emergency room patients face bills marked up five hundred percent over actual hospital cash rates. Under federal law, hospitals must publish machine-readable prices, but enforcing them has been impossible for patients. Excise changes that."
  },
  {
    id: "beat-02",
    scene: "scene2-add-audit",
    name: "Scene 2: The Add Audit Journey & Ingestion",
    text: "Adding an audit takes seconds. Patients upload an itemized bill or select an authentic hospital specimen. Excise launches a three-stage autonomous pipeline: Firecrawl ingests the hospital's federal machine-readable file, OpenAI audits clinical acuity, and AgentMail provisions a dispute inbox. Instantly, Convex indexes the case and loads the audit docket."
  },
  {
    id: "beat-03",
    scene: "scene3-calm-hud",
    name: "Scene 3: Cockpit HUD & Calm Patient Mode",
    text: "Our calm patient view distills complex hospital charges into four clean columns: the procedure, the statutory violation, the legal safe harbor, and the exact reduction. Here, Marcus Vance's fourteen thousand dollar emergency bill is reduced to thirty-seven hundred dollars, excising eleven thousand dollars in overcharges."
  },
  {
    id: "beat-04",
    scene: "scene4-coding-forensics",
    name: "Scene 4: Medical Coding Forensic Inspection",
    text: "Expanding any charge reveals the forensic breakdown. OpenAI analyzes clinical notes against CMS rules, exposing when hospitals upcode emergency visits to Level five trauma fees without resuscitation criteria, or unbundle routine supplies into fake charges."
  },
  {
    id: "beat-05",
    scene: "scene5-reactive-recalc",
    name: "Scene 5: Instant Reactive Settlement Recalculation",
    text: "Backed by Convex reactive subscriptions, every dispute strike syncs across clients instantly. Toggling a line item recalculates the entire settlement docket in under ten milliseconds, with zero reloads, zero network delay, and zero stale state."
  },
  {
    id: "beat-06",
    scene: "scene6-chargemaster-intel",
    name: "Scene 6: Chargemaster Intel Directory",
    text: "In the Chargemaster directory, patients search hospital facilities nationwide. Excise cross-references real hospital chargemasters against CMS median cash benchmarks, proving markups exceeding eight times the published allowable rate."
  },
  {
    id: "beat-07",
    scene: "scene7-statutory-letter",
    name: "Scene 7: Statutory Safe Harbor Dispute Letter",
    text: "Excise generates a formal statutory dispute notice citing federal price transparency mandates and No Surprises Act safe harbors. This turns legal theory into an enforceable settlement package addressed directly to hospital billing directors."
  },
  {
    id: "beat-08",
    scene: "scene8-agentmail-negotiation",
    name: "Scene 8: AgentMail 2-Way Negotiation Loop",
    text: "Patients never have to argue on the phone. Our autonomous AgentMail loop provisions a dedicated case inbox and dispatches verified settlement offers. When the hospital accepts a concession, the stepper marks the docket settled, securing the savings."
  },
  {
    id: "beat-09",
    scene: "scene9-proof-terminal",
    name: "Scene 9: Cryptographic Proof Rail & Terminal Backend",
    text: "Every settlement is sealed with SHA-two fifty-six cryptographic provenance. On the backend, Convex powers relational indexing, reactive mutations, and live synchronization with strict end-to-end type safety across every query."
  },
  {
    id: "beat-10",
    scene: "scene10-outro",
    name: "Scene 10: Master Outro & Submission Checklist",
    text: "Excise is live in production right now. Test the interactive docket, read our documentation, and inspect the codebase at the links below."
  }
];

async function generateBeat(beat) {
  const destPath = path.join(outputDir, `${beat.id}.mp3`);
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    console.log(`⏩ [${beat.id}] already cached (${fs.statSync(destPath).size} bytes)`);
    return { ...beat, audioPath: destPath };
  }

  console.log(`\n🎙️ Generating [${beat.id}] (${beat.name}): "${beat.text.slice(0, 50)}..."`);
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
  console.log(`Task ID: ${taskId}. Polling...`);

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(`https://api.ai33.pro/v1/task/${taskId}`, {
      headers: { "xi-api-key": API_KEY }
    });
    const pollData = await pollRes.json();

    if (pollData.status === "done") {
      const audioUrl = pollData.metadata?.audio_url;
      console.log(`Done! Downloading via curl: ${audioUrl.slice(0, 60)}...`);
      execSync(`curl -s -L -o "${destPath}" "${audioUrl}"`);
      const sz = fs.statSync(destPath).size;
      console.log(`✅ Saved ${sz} bytes to ${destPath}`);
      return { ...beat, audioPath: destPath };
    }

    if (pollData.status === "error") {
      throw new Error(`TTS generation error for ${beat.id}: ${JSON.stringify(pollData)}`);
    }
  }

  throw new Error(`Timeout waiting for task ${taskId}`);
}

async function run() {
  console.log("=================================================");
  console.log("🎙️ Generating 10 Tightened Clean TTS Beats at 1.1x...");
  console.log("=================================================");

  const generated = [];
  for (const beat of beats) {
    const res = await generateBeat(beat);
    const dur = parseFloat(
      execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${res.audioPath}"`).toString().trim()
    );
    generated.push({ ...res, duration: dur });
    console.log(`   [${beat.id}] Measured duration: ${dur.toFixed(2)}s`);
  }

  // Compute strictly sequential timeline with zero overlap
  const PAUSE_BETWEEN_BEATS = 1.2; // 1.2s breathing room between scenes
  const LEAD_IN = 0.5; // 0.5s visual lead before speech starts

  let currentTime = 0;
  const scheduled = generated.map((b, idx) => {
    const sceneStart = currentTime;
    const voStart = sceneStart + LEAD_IN;
    const voEnd = voStart + b.duration;
    const sceneDuration = LEAD_IN + b.duration + PAUSE_BETWEEN_BEATS;
    const sceneEnd = sceneStart + sceneDuration;
    currentTime = sceneEnd;

    return {
      ...b,
      sceneStart: parseFloat(sceneStart.toFixed(2)),
      sceneDuration: parseFloat(sceneDuration.toFixed(2)),
      sceneEnd: parseFloat(sceneEnd.toFixed(2)),
      voStart: parseFloat(voStart.toFixed(2)),
      voEnd: parseFloat(voEnd.toFixed(2))
    };
  });

  const totalVideoDuration = currentTime;
  console.log("\n=================================================");
  console.log(`⏱️ Sequential Zero-Overlap Timeline (Total: ${totalVideoDuration.toFixed(2)}s):`);
  console.log("=================================================");
  for (const s of scheduled) {
    console.log(
      `${s.id} (${s.scene}): Scene [${s.sceneStart}s -> ${s.sceneEnd}s (${s.sceneDuration}s)] | VO [${s.voStart}s -> ${s.voEnd}s]`
    );
  }

  // Save clean manifest
  const manifestPath = path.join(outputDir, "clean-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify({ totalVideoDuration, scheduled }, null, 2));
  console.log(`\n📄 Manifest saved to: ${manifestPath}`);

  // Build the master non-overlapping voice track using sequential concat with silence padding
  console.log("\n=== Building Strictly Sequential Zero-Overlap Master VO Track ===");
  const filterInputs = [];
  const filterParts = [];
  let filterConcatList = "";

  scheduled.forEach((s, i) => {
    // Add lead silence before beat
    // Audio piece: lead silence + beat audio + tail silence
    filterInputs.push("-i", s.audioPath);
  });

  // Assemble full audio track using exact adelay on each beat to match s.voStart
  const inputArgs = scheduled.flatMap((s) => ["-i", s.audioPath]);
  const delayFilters = scheduled
    .map((s, i) => `[${i}:a]adelay=${Math.round(s.voStart * 1000)}|${Math.round(s.voStart * 1000)}[a${i}]`)
    .join(";");
  const mixInputs = scheduled.map((_, i) => `[a${i}]`).join("");
  const voFilter = `${delayFilters};${mixInputs}amix=inputs=${scheduled.length}:dropout_transition=0:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=10[vo]`;

  const voTrackPath = path.join(outputDir, "clean-vo-master.wav");
  const cmdVO = `ffmpeg -y ${inputArgs.join(" ")} -filter_complex "${voFilter}" -map "[vo]" -t ${Math.ceil(totalVideoDuration)} "${voTrackPath}"`;
  console.log("Running ffmpeg sequential VO assembly...");
  execSync(cmdVO, { stdio: "inherit" });

  // Mix with BGM
  console.log("\n=== Mixing Sequential VO and Ducked BGM ===");
  const bgmPath = path.resolve("videos/excise-showcase/audio/bgm.mp3");
  const mixedTrackPath = path.resolve("videos/excise-showcase/audio/excise-showcase-audio-clean.mp3");
  const finalDur = Math.ceil(totalVideoDuration);

  const mixFilter = `
  [1:a]aloop=loop=-1:size=2e+09,atrim=0:${finalDur},asetpts=PTS-STARTPTS,afade=t=in:ss=0:d=1.5,afade=t=out:st=${finalDur - 3}:d=3,volume=0.14[bgm];
  [bgm][0:a]sidechaincompress=threshold=0.03:ratio=4:attack=50:release=350[ducked_bgm];
  [0:a][ducked_bgm]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[out]
  `.replace(/\n/g, "");

  const cmdMix = `ffmpeg -y -i "${voTrackPath}" -i "${bgmPath}" -filter_complex "${mixFilter}" -map "[out]" -b:a 256k -t ${finalDur} "${mixedTrackPath}"`;
  console.log("Running ffmpeg BGM + VO mix...");
  execSync(cmdMix, { stdio: "inherit" });

  console.log(`\n🎉 Zero-overlap master audio mixed at: ${mixedTrackPath}`);
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
