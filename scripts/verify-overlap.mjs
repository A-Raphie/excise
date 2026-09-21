import fs from "fs";
import path from "path";

const manifestPath = path.resolve("videos/excise-showcase/audio/clean_beats/clean-manifest.json");
const data = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const beats = data.scheduled;

console.log("=================================================");
console.log("🛡️ RUNNING AUTOMATED AUDIO STEM OVERLAP AUDIT");
console.log("=================================================");

let collisions = 0;
for (let i = 0; i < beats.length - 1; i++) {
  const current = beats[i];
  const next = beats[i + 1];

  const gap = next.voStart - current.voEnd;
  const isOverlap = current.voEnd > next.voStart;

  if (isOverlap) {
    const overlapSec = (current.voEnd - next.voStart).toFixed(2);
    console.error(
      `❌ COLLISION DETECTED: [${current.id}] (${current.name}) ends at ${current.voEnd}s, but [${next.id}] (${next.name}) starts at ${next.voStart}s! (Overlap: ${overlapSec}s)`
    );
    collisions++;
  } else {
    console.log(
      `✅ [${current.id}] -> [${next.id}]: Clean separation of +${gap.toFixed(2)}s (Current ends at ${current.voEnd}s, Next starts at ${next.voStart}s)`
    );
  }
}

console.log("=================================================");
if (collisions > 0) {
  console.error(`🚨 FATAL AUDIT FAILURE: ${collisions} audio collision(s) detected!`);
  process.exit(1);
} else {
  console.log("🎉 AUDIT PASSED: 100% Monophonic Speech Invariant Verified! Zero Overlap.");
  process.exit(0);
}
